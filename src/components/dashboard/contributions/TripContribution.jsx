import React, { useState, useEffect, useRef, useCallback } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useContributions } from "../../../hooks/useContributions";
import api from "../../../services/api";

/* ─────────────────────────────────────────────────────────────
   Generic searchable Choices hook
   - boots one Choices instance on a bare <select> ref
   - calls fetchFn(query) on user search input (debounced)
   - pushes formatted results into the dropdown
   - syncs selection → onSelect callback
───────────────────────────────────────────────────────────── */
const useChoicesSearch = (
	ref,
	{ fetchFn, formatOption, placeholder, onSelect },
) => {
	const instanceRef = useRef(null);
	const debounceRef = useRef(null);
	const abortRef = useRef(null);

	// Boot once
	useEffect(() => {
		if (!ref.current || instanceRef.current) return;

		const instance = new Choices(ref.current, {
			searchEnabled: true,
			shouldSort: false,
			removeItemButton: true,
			placeholderValue: placeholder,
			searchPlaceholderValue: "Type to search…",
			allowHTML: true,
			noResultsText: "No results found",
			noChoicesText: "Type to search…",
		});

		// Search event
		instance.passedElement.element.addEventListener("search", (e) => {
			const query = e.detail?.value?.trim() || "";

			// Debounce
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(async () => {
				// Cancel previous request
				if (abortRef.current) abortRef.current.abort();
				const controller = new AbortController();
				abortRef.current = controller;

				try {
					const res = await fetchFn(query, controller.signal);
					const items = Array.isArray(res) ? res : res?.data || [];
					const options = items.map(formatOption);
					instance.clearChoices();
					instance.setChoices(options, "value", "label", true);
				} catch (err) {
					if (err?.name !== "AbortError" && err?.code !== "ERR_CANCELED") {
						console.warn("Choices search error:", err);
					}
				}
			}, 350);
		});

		// Change event → sync to form
		instance.passedElement.element.addEventListener("change", (e) => {
			onSelect(e.target.value);
		});

		instanceRef.current = instance;

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			if (abortRef.current) abortRef.current.abort();
			try {
				instanceRef.current?.destroy();
			} catch (_) {}
			instanceRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Initial load (empty query → fetch first page)
	const loadInitial = useCallback(async () => {
		const instance = instanceRef.current;
		if (!instance) return;
		try {
			const res = await fetchFn("", null);
			const items = Array.isArray(res) ? res : res?.data || [];
			const options = items.map(formatOption);
			instance.clearChoices();
			instance.setChoices(options, "value", "label", true);
		} catch (err) {
			console.warn("Choices initial load error:", err);
		}
	}, [fetchFn, formatOption]);

	return { loadInitial };
};

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
const TripContribution = ({ goBack, onSuccess }) => {
	const [form, setForm] = useState({
		bus_id: "",
		route_id: "",
		departure_time: "",
		arrival_time: "",
		days_of_week: [1, 1, 1, 1, 1, 1, 1], // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
	});

	const {
		submitLoading: loading,
		error,
		success,
		submitContribution,
	} = useContributions();

	const busRef = useRef(null);
	const routeRef = useRef(null);

	/* ── API fetch functions ── */
	const fetchBuses = useCallback(async (query, signal) => {
		return await api.get("/buses", {
			params: { search: query, per_page: 20 },
			...(signal ? { signal } : {}),
		});
	}, []);

	const fetchRoutes = useCallback(async (query, signal) => {
		return await api.get("/routes", {
			params: { search: query, per_page: 20 },
			...(signal ? { signal } : {}),
		});
	}, []);

	/* ── Option formatters ── */
	const formatBus = useCallback(
		(b) => ({
			value: String(b.id),
			label: `<span class="badge bg-primary me-1">${b.bus_number || b.number || "#"}</span> ${b.bus_name || b.name || `Bus ${b.id}`}`,
		}),
		[],
	);

	const formatRoute = useCallback(
		(r) => ({
			value: String(r.id),
			label: `<i class="bi bi-signpost me-1"></i> ${r.origin.name} - ${r.destination.name} (${r.path_signature})`,
		}),
		[],
	);

	/* ── Wire up Choices ── */
	const { loadInitial: loadBuses } = useChoicesSearch(busRef, {
		fetchFn: fetchBuses,
		formatOption: formatBus,
		placeholder: "Search buses…",
		onSelect: (val) => setForm((prev) => ({ ...prev, bus_id: val })),
	});

	const { loadInitial: loadRoutes } = useChoicesSearch(routeRef, {
		fetchFn: fetchRoutes,
		formatOption: formatRoute,
		placeholder: "Search routes…",
		onSelect: (val) => setForm((prev) => ({ ...prev, route_id: val })),
	});

	// Pre-load on mount
	useEffect(() => {
		loadBuses();
		loadRoutes();
	}, [loadBuses, loadRoutes]);

	/* ── Handlers ── */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const toggleDay = (index) => {
		if (isDisabled) return;
		setForm((prev) => {
			const next = [...prev.days_of_week];
			next[index] = next[index] === 1 ? 0 : 1;
			return { ...prev, days_of_week: next };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const saved = await submitContribution("trip", form);
		if (saved) {
			setForm({
				bus_id: "",
				route_id: "",
				departure_time: "",
				arrival_time: "",
				days_of_week: [0, 0, 0, 0, 0, 0, 0],
			});
			onSuccess("trip");
		}
	};

	const isDisabled = loading || success;

	const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<div id="form-trip" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-calendar-event me-2 text-primary" />
					Suggest Trip
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2" />
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					{/* ── Bus ── */}
					<div className="mb-3">
						<label className="small fw-bold text-muted mb-1">Bus</label>
						<select
							id="busChoiceSelect"
							ref={busRef}
							className="choice-select"
							disabled={isDisabled}
						/>
					</div>

					{/* ── Route ── */}
					<div className="mb-3">
						<label className="small fw-bold text-muted mb-1">Route</label>
						<select
							id="routeChoiceSelect"
							ref={routeRef}
							className="choice-select"
							disabled={isDisabled}
						/>
					</div>

					{/* ── Times ── */}
					<div className="row mb-3 g-2">
						<div className="col-6">
							<div className="form-floating">
								<input
									type="time"
									className="form-control"
									id="depTime"
									name="departure_time"
									value={form.departure_time}
									onChange={handleChange}
									required
									disabled={isDisabled}
								/>
								<label htmlFor="depTime" className="text-muted">
									Dep. Time
								</label>
							</div>
						</div>
						<div className="col-6">
							<div className="form-floating">
								<input
									type="time"
									className="form-control"
									id="arrTime"
									name="arrival_time"
									value={form.arrival_time}
									onChange={handleChange}
									required
									disabled={isDisabled}
								/>
								<label htmlFor="arrTime" className="text-muted">
									Arr. Time
								</label>
							</div>
						</div>
					</div>

					{/* ── Operating Days ── */}
					<div className="mb-4">
						<label className="form-label d-block text-muted small fw-bold mb-2">
							Operating Days
						</label>
						<div className="d-flex gap-1">
							{DAY_LABELS.map((day, i) => {
								const active = form.days_of_week[i] === 1;
								return (
									<button
										key={day}
										type="button"
										onClick={() => toggleDay(i)}
										disabled={isDisabled}
										title={day}
										style={{
											width: "36px",
											height: "36px",
											flexShrink: 0,
											fontSize: "0.7rem",
											fontWeight: 700,
											border: `1.5px solid ${active ? "#0d6efd" : "#dee2e6"}`,
											borderRadius: "6px",
											background: active ? "#0d6efd" : "#fff",
											color: active ? "#fff" : "#6c757d",
											cursor: isDisabled ? "not-allowed" : "pointer",
											transition: "all 0.15s",
											padding: 0,
										}}
									>
										{day[0]}
									</button>
								);
							})}
						</div>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center"
						disabled={isDisabled}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" />
								Submitting…
							</>
						) : (
							"SUBMIT TRIP"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default TripContribution;
