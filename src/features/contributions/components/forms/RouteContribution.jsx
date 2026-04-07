import React, { useState, useEffect, useRef, useCallback } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useContributions } from "../../hooks/useContributions";
import { useStationSearch } from "../../../buses/hooks/useStationSearch";
import "../../styles/Forms.css";

const useChoicesStation = (
	ref,
	instanceKey,
	searchStations,
	stationResults,
	onSelect,
) => {
	const instanceRef = useRef(null);

	useEffect(() => {
		if (!ref.current || instanceRef.current) return;

		const instance = new Choices(ref.current, {
			searchEnabled: true,
			shouldSort: false,
			removeItemButton: true,
			placeholderValue: "Search stations…",
			searchPlaceholderValue: "Type to search…",
			allowHTML: true,
			noResultsText: "No stations found",
			noChoicesText: "Type to search stations",
		});

		// Trigger search on user typing
		instance.passedElement.element.addEventListener("search", (e) => {
			searchStations(e.detail?.value || "");
		});

		// Sync selected value up to form state
		instance.passedElement.element.addEventListener("change", (e) => {
			onSelect(e.target.value);
		});

		instanceRef.current = instance;

		return () => {
			try {
				instanceRef.current?.destroy();
			} catch (_) {}
			instanceRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 2. Push new results into the dropdown whenever hook data changes
	useEffect(() => {
		const instance = instanceRef.current;
		if (!instance || !stationResults?.length) return;

		const options = stationResults.map((r) => ({
			value: String(r.id ?? r.code),
			label: `<span class="badge bg-primary">${String(r.code ?? "")
				.substring(0, 3)
				.toUpperCase()}</span> ${r.name ?? r.code}`,
		}));

		try {
			instance.clearChoices();
			instance.setChoices(options, "value", "label", true);
		} catch (err) {
			console.warn("Choices update skipped:", err);
		}
	}, [stationResults]);

	// 3. Disable/enable when form state changes
	const setDisabled = useCallback((disabled) => {
		const instance = instanceRef.current;
		if (!instance) return;
		try {
			disabled ? instance.disable() : instance.enable();
		} catch (_) {}
	}, []);

	return { setDisabled };
};

/* ─────────────────────────────────────────────────────────────
   Main Component
 ───────────────────────────────────────────────────────────── */
const RouteContribution = ({ goBack, onSuccess }) => {
	const [form, setForm] = useState({
		origin_id: "",
		destination_id: "",
		path_signature: "",
		distance: "",
	});

	// Two independent station search hook instances
	const { searchStations: searchOrigin, stationResults: originResults } =
		useStationSearch();

	const { searchStations: searchDest, stationResults: destResults } =
		useStationSearch();

	const {
		submitLoading: loading,
		error,
		success,
		submitContribution,
	} = useContributions();

	// DOM refs for the bare <select> elements
	const originRef = useRef(null);
	const destRef = useRef(null);

	// Wire up Choices for Origin
	useChoicesStation(originRef, "origin", searchOrigin, originResults, (val) =>
		setForm((prev) => ({ ...prev, origin_id: val || "" })),
	);

	// Wire up Choices for Destination
	useChoicesStation(destRef, "destination", searchDest, destResults, (val) =>
		setForm((prev) => ({ ...prev, destination_id: val || "" })),
	);

	// Pre-load some stations on mount so dropdowns aren't empty
	useEffect(() => {
		searchOrigin("");
		searchDest("");
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const saved = await submitContribution("route", form);
		if (saved) {
			setForm({
				origin_id: "",
				destination_id: "",
				path_signature: "",
				distance: "",
			});
			onSuccess("route");
		}
	};

	const isDisabled = loading || success;

	return (
		<div id="form-route" className="contribution-form">
			<div className="card contribution-card border-0 shadow-sm rounded-2">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-signpost me-2 text-primary" />
					Suggest Route
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2" />
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					{/* ── Origin ── */}
					<div className="mb-2">
						<label className="small fw-bold text-muted mb-1">
							Origin Station
						</label>
						<select
							id="originSelect"
							ref={originRef}
							className="choice-select"
							disabled={isDisabled}
						/>
					</div>

					{/* ── Destination ── */}
					<div className="mb-3">
						<label className="small fw-bold text-muted mb-1">
							Destination Station
						</label>
						<select
							id="destinationSelect"
							ref={destRef}
							className="choice-select"
							disabled={isDisabled}
						/>
					</div>

					{/* ── Via ── */}
					<div className="mb-3">
						<textarea
							className="form-control form-textarea-md"
							id="viaInput"
							name="path_signature"
							value={form.path_signature}
							onChange={handleChange}
							placeholder="e.g. Via NH66, Alappuzha, Kollam"
							disabled={isDisabled}
						/>
					</div>

					{/* ── Distance ── */}
					<div className="mb-4 form-floating">
						<input
							type="number"
							className="form-control"
							id="distInput"
							name="distance"
							value={form.distance}
							onChange={handleChange}
							placeholder="200"
							disabled={isDisabled}
						/>
						<label htmlFor="distInput" className="text-muted">
							Distance (KM)
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
							"SUBMIT ROUTE"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default RouteContribution;
