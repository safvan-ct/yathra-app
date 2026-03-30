import React, { useState, useEffect, useRef, useCallback } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useContributions } from "../../../hooks/useContributions";
import api from "../../../services/api";

/* ─────────────────────────────────────────────────────────────
   Generic searchable Choices hook (same pattern as TripContribution)
───────────────────────────────────────────────────────────── */
const useChoicesSearch = (
	ref,
	{ fetchFn, formatOption, placeholder, onSelect },
) => {
	const instanceRef = useRef(null);
	const debounceRef = useRef(null);
	const abortRef = useRef(null);

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

		instance.passedElement.element.addEventListener("search", (e) => {
			const query = e.detail?.value?.trim() || "";
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(async () => {
				if (abortRef.current) abortRef.current.abort();
				const controller = new AbortController();
				abortRef.current = controller;
				try {
					const res = await fetchFn(query, controller.signal);
					const items = Array.isArray(res) ? res : res?.data || [];
					instance.clearChoices();
					instance.setChoices(items.map(formatOption), "value", "label", true);
				} catch (err) {
					if (err?.name !== "AbortError" && err?.code !== "ERR_CANCELED") {
						console.warn("Choices search error:", err);
					}
				}
			}, 350);
		});

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

	const loadInitial = useCallback(async () => {
		const instance = instanceRef.current;
		if (!instance) return;
		try {
			const res = await fetchFn("", null);
			const items = Array.isArray(res) ? res : res?.data || [];
			instance.clearChoices();
			instance.setChoices(items.map(formatOption), "value", "label", true);
		} catch (err) {
			console.warn("Choices initial load error:", err);
		}
	}, [fetchFn, formatOption]);

	/* Expose a way to reload choices with a fresh set of items */
	const setItems = useCallback(
		(items) => {
			const instance = instanceRef.current;
			if (!instance) return;
			instance.clearChoices();
			instance.setChoices(items.map(formatOption), "value", "label", true);
		},
		[formatOption],
	);

	return { loadInitial, setItems };
};

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
const StopContribution = ({ goBack, onSuccess }) => {
	const [form, setForm] = useState({
		route_id: "",
		before_node_id: "",
		station_id: "",
		distance_from_origin: "",
	});

	const {
		submitLoading: loading,
		error,
		success,
		submitContribution,
	} = useContributions();

	const routeRef = useRef(null);
	const beforeRef = useRef(null);
	const beforeInstanceRef = useRef(null); // direct Choices instance for "Before Stop"
	const stationRef = useRef(null);

	const isDisabled = loading || success;

	/* ── API fetch functions ── */
	const fetchRoutes = useCallback(async (query, signal) => {
		return await api.get("/routes", {
			params: { search: query, per_page: 20 },
			...(signal ? { signal } : {}),
		});
	}, []);

	const fetchNodes = useCallback(async (routeId, query, signal) => {
		if (!routeId) return [];
		return await api.get(`/routes/${routeId}/nodes`, {
			params: { search: query, per_page: 50 },
			...(signal ? { signal } : {}),
		});
	}, []);

	const fetchStations = useCallback(async (query, signal) => {
		return await api.get("/stations", {
			params: { search: query, per_page: 20 },
			...(signal ? { signal } : {}),
		});
	}, []);

	/* ── Option formatters ── */
	const formatRoute = useCallback(
		(r) => ({
			value: String(r.id),
			label: `<i class="bi bi-signpost me-1"></i> ${r.origin?.name ?? "?"} &rarr; ${r.destination?.name ?? "?"} <span class="text-muted small">(${r.path_signature ?? ""})</span>`,
		}),
		[],
	);

	const formatNode = useCallback(
		(n) => ({
			value: String(n.id),
			label: `<i class="bi bi-geo-alt me-1"></i> ${n.station?.name ?? n.name ?? `Node ${n.id}`} <span class="text-muted small">— ${n.distance_from_origin ?? "?"} km</span>`,
		}),
		[],
	);

	const formatStation = useCallback(
		(s) => ({
			value: String(s.id),
			label: `<span class="badge bg-primary-subtle text-primary me-1">${s.code ?? "STN"}</span> ${s.name ?? `Station ${s.id}`}`,
		}),
		[],
	);

	/* ── Wire up Choices ── */
	const { loadInitial: loadRoutes } = useChoicesSearch(routeRef, {
		fetchFn: fetchRoutes,
		formatOption: formatRoute,
		placeholder: "Search routes…",
		onSelect: (val) => {
			setForm((prev) => ({ ...prev, route_id: val, before_node_id: "" }));
		},
	});

	const { loadInitial: loadStations } = useChoicesSearch(stationRef, {
		fetchFn: fetchStations,
		formatOption: formatStation,
		placeholder: "Search stations…",
		onSelect: (val) => setForm((prev) => ({ ...prev, station_id: val })),
	});

	/* ── Boot "Before Stop" Choices directly (no useChoicesSearch)
	   Reason: Choices.js silently ignores setChoices() on a disabled
	   instance, so we must boot it unconditionally and call
	   .enable() / .disable() ourselves via the Choices API.
	────────────────────────────────────────────────────────────── */
	useEffect(() => {
		if (!beforeRef.current || beforeInstanceRef.current) return;

		const instance = new Choices(beforeRef.current, {
			searchEnabled: false,
			shouldSort: false,
			removeItemButton: true,
			placeholderValue: "Select a node from the route…",
			allowHTML: true,
			noChoicesText: "Select a route first…",
			noResultsText: "No nodes found",
		});

		instance.passedElement.element.addEventListener("change", (e) => {
			setForm((prev) => ({ ...prev, before_node_id: e.target.value }));
		});

		instance.disable(); // start disabled until a route is chosen
		beforeInstanceRef.current = instance;

		return () => {
			try {
				beforeInstanceRef.current?.destroy();
			} catch (_) {}
			beforeInstanceRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* Pre-load on mount */
	useEffect(() => {
		loadRoutes();
		loadStations();
	}, [loadRoutes, loadStations]);

	/* Re-load nodes whenever route_id changes */
	useEffect(() => {
		const instance = beforeInstanceRef.current;
		if (!instance) return;

		if (!form.route_id) {
			instance.clearChoices();
			instance.disable();
			return;
		}

		(async () => {
			try {
				const res = await fetchNodes(form.route_id, "", null);
				const items = Array.isArray(res) ? res : res?.data || [];
				instance.clearChoices();
				instance.setChoices(items.map(formatNode), "value", "label", true);
				instance.enable();
			} catch (err) {
				console.warn("Failed to load nodes:", err);
			}
		})();
	}, [form.route_id, fetchNodes, formatNode]);

	/* ── Submit ── */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const saved = await submitContribution("stop", form);
		if (saved) {
			setForm({
				route_id: "",
				before_node_id: "",
				station_id: "",
				distance_from_origin: "",
			});
			onSuccess("stop");
		}
	};

	return (
		<div id="form-stop" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-dot me-2 text-primary" />
					Intermediate Stop
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2" />
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					{/* ── 1. Select Route ── */}
					<div className="mb-3">
						<label className="small fw-bold text-muted mb-1">
							<i className="bi bi-signpost me-1" />
							Select Route
						</label>
						<select
							id="stopRouteChoiceSelect"
							ref={routeRef}
							className="choice-select"
							disabled={isDisabled}
						/>
					</div>

					{/* ── 2. Before Stop (nodes of selected route) ── */}
					<div className="mb-3">
						<label className="small fw-bold text-muted mb-1">
							<i className="bi bi-pin-map me-1" />
							Before Stop
							{!form.route_id && (
								<span
									className="text-warning ms-2"
									style={{ fontSize: "0.7rem" }}
								>
									(select a route first)
								</span>
							)}
						</label>
						<select
							id="stopBeforeNodeChoiceSelect"
							ref={beforeRef}
							className="choice-select"
						/>
					</div>

					{/* ── 3. Suggest Stop (station search) ── */}
					<div className="mb-3">
						<label className="small fw-bold text-muted mb-1">
							<i className="bi bi-geo-alt-fill me-1 text-primary" />
							Suggest Stop
						</label>
						<select
							id="stopStationChoiceSelect"
							ref={stationRef}
							className="choice-select"
							disabled={isDisabled}
						/>
					</div>

					{/* ── 4. Distance from Origin ── */}
					<div className="mb-4 form-floating">
						<input
							type="number"
							className="form-control"
							id="distOrigin"
							name="distance_from_origin"
							value={form.distance_from_origin}
							onChange={handleChange}
							required
							placeholder="Distance"
							disabled={isDisabled}
						/>
						<label htmlFor="distOrigin" className="text-muted">
							Distance from Origin (KM)
						</label>
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
							"SUBMIT STOP"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default StopContribution;
