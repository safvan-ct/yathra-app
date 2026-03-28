import React, { useEffect, useRef, useState } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useBuses } from "../../../src/hooks/useBuses";
import { useRoutes } from "../../../src/hooks/useRoutes";

const HomeSection = () => {
	const desktopFromRef = useRef(null);
	const desktopToRef = useRef(null);
	const mobileFromRef = useRef(null);
	const mobileToRef = useRef(null);
	const choicesInstances = useRef({});

	const {
		buses,
		loading: busesLoading,
		error: busesError,
		searchBuses,
	} = useBuses();
	const {
		stations,
		loading: stationsLoading,
		error: stationsError,
		loadAllDependencies,
	} = useRoutes();

	useEffect(() => {
		loadAllDependencies();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let isMounted = true;

		const initAllChoices = (data) => {
			const initChoices = (ref, id) => {
				if (ref.current) {
					// re-init prevention
					if (choicesInstances.current[id]) {
						choicesInstances.current[id].destroy();
					}
					const instance = new Choices(ref.current, {
						searchEnabled: true,
						shouldSort: false,
						removeItemButton: true,
						placeholderValue: "Search stops...",
						allowHTML: true,
					});

					instance.setChoices(data, "value", "label", true);
					choicesInstances.current[id] = instance;
				}
			};

			initChoices(desktopFromRef, "from-desktop");
			initChoices(desktopToRef, "to-desktop");
			initChoices(mobileFromRef, "from-mobile");
			initChoices(mobileToRef, "to-mobile");
		};

		if (stations && stations.length > 0 && isMounted) {
			const choicesOptions = stations.map((r) => ({
				value: String(r.id || r.code),
				label: `<span class="badge bg-primary">${String(r.code)
					.substring(0, 3)
					.toUpperCase()}</span> ${r.name || r.code} <small class="text-muted"></small>`,
			}));
			initAllChoices(choicesOptions);
		} else if (stationsError) {
			initAllChoices([]);
		}

		return () => {
			isMounted = false;
		};
	}, [stations, stationsError]);

	// Cleanup choices separately
	useEffect(() => {
		return () => {
			Object.values(choicesInstances.current).forEach((instance) => {
				if (instance) instance.destroy();
			});
			choicesInstances.current = {};
		};
	}, []);

	const handleSwap = (view) => {
		const fId = `from-${view}`;
		const tId = `to-${view}`;

		const f = choicesInstances.current[fId];
		const t = choicesInstances.current[tId];

		if (f && t) {
			const fVal = f.getValue();
			const tVal = t.getValue();

			f.removeActiveItems();
			t.removeActiveItems();

			if (tVal) {
				f.setChoices(
					[{ value: tVal.value, label: tVal.label, selected: true }],
					"value",
					"label",
					true,
				);
			}
			if (fVal) {
				t.setChoices(
					[{ value: fVal.value, label: fVal.label, selected: true }],
					"value",
					"label",
					true,
				);
			}
		}
	};

	const handleSearch = async (view) => {
		const fId = `from-${view}`;
		const tId = `to-${view}`;

		const fromChoice = choicesInstances.current[fId]?.getValue();
		const toChoice = choicesInstances.current[tId]?.getValue();

		const from = fromChoice ? fromChoice.value : "";
		const to = toChoice ? toChoice.value : "";

		await searchBuses(from, to);
	};

	return (
		<div id="section-home" className="app-section active">
			<div className="search-header text-center">
				<div className="container">
					<h1 className="fw-800 mb-1">YATHRA</h1>
					<p className="opacity-75">
						Instant access to city-wide bus schedules
					</p>
				</div>
			</div>

			<div className="dashboard-container">
				<div className="search-section-wrapper">
					<div className="card search-card mb-4">
						<div className="card-body p-3 p-md-4">
							{(busesError || stationsError) && (
								<div className="alert alert-danger py-2 small mb-3">
									{busesError || stationsError}
								</div>
							)}
							<div className="d-none d-md-flex row g-3 align-items-center">
								<div className="col">
									<label className="small fw-bold text-muted mb-1">
										{stationsLoading ? "Loading Stations..." : "From"}
									</label>
									<select
										id="from-desktop"
										className="choice-select"
										ref={desktopFromRef}
										disabled={stationsLoading}
									></select>
								</div>
								<div className="col-auto pt-4">
									<button
										type="button"
										className="btn btn-swap-creative shadow-sm"
										data-view="desktop"
										onClick={() => handleSwap("desktop")}
										disabled={stationsLoading}
									>
										<i className="bi bi-arrow-left-right"></i>
									</button>
								</div>
								<div className="col">
									<label className="small fw-bold text-muted mb-1">To</label>
									<select
										id="to-desktop"
										className="choice-select"
										ref={desktopToRef}
										disabled={stationsLoading}
									></select>
								</div>
								<div className="col-auto pt-4">
									<button
										type="button"
										className="btn btn-primary px-5 fw-bold h-100 rounded-3"
										onClick={() => handleSearch("desktop")}
										disabled={busesLoading || stationsLoading}
									>
										{busesLoading ? "..." : "SEARCH"}
									</button>
								</div>
							</div>

							<div className="d-block d-md-none" id="mobile-inputs">
								<div className="journey-inputs-container">
									{stationsLoading && (
										<div className="small text-muted mb-2 text-center">
											Loading stations...
										</div>
									)}
									<div className="d-flex flex-column gap-2">
										<div className="position-relative">
											<span className="stop-dot start"></span>
											<select
												id="from-mobile"
												className="choice-select"
												ref={mobileFromRef}
											></select>
										</div>
										<div className="mobile-connector"></div>
										<div className="position-relative">
											<span className="stop-dot end"></span>
											<select
												id="to-mobile"
												className="choice-select"
												ref={mobileToRef}
											></select>
										</div>
									</div>
									<button
										type="button"
										className="btn btn-swap-floating shadow-sm"
										data-view="mobile"
										onClick={() => handleSwap("mobile")}
										disabled={stationsLoading}
									>
										<i className="bi bi-arrow-down-up"></i>
									</button>
								</div>
								<button
									type="button"
									className="btn btn-primary w-100 py-3 mt-3 fw-bold shadow-sm"
									onClick={() => handleSearch("mobile")}
									disabled={busesLoading || stationsLoading}
								>
									{busesLoading ? "SEARCHING..." : "FIND BUS"}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="results-section py-2 pb-4 mb-5">
					<div className="row g-3">
						<div className="col-12">
							{busesLoading && (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							)}

							{!busesLoading && buses !== null && buses.length === 0 && (
								<div className="text-center py-5">
									<i className="bi bi-bus-front text-muted fs-1"></i>
									<p className="text-muted mt-2 fw-bold">No buses found</p>
								</div>
							)}

							{!busesLoading &&
								buses?.map((bus, idx) => (
									<div key={idx} className="bus-card card shadow-sm">
										<div className="card-body p-3 p-md-4">
											<div className="row align-items-center">
												<div className="col-md-3 mb-3 mb-md-0">
													<div className="d-flex align-items-center">
														<div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
															<i className="bi bi-bus-front fs-3"></i>
														</div>
														<div>
															<div className="fw-bold fs-5 lh-1 mb-1">
																{bus.bus_name || bus.name || "KSRTC Superfast"}
															</div>
															<small className="text-muted">
																{bus.number || "KL-15-A-9900"}
															</small>
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<div className="d-flex align-items-center justify-content-between">
														<div className="text-primary text-center">
															<div className="time-display">
																{bus.departure_time ||
																	bus.departure ||
																	"06:15 AM"}
															</div>
															<small className="text-muted fw-bold">
																DEPARTURE
															</small>
														</div>
														<div className="route-line"></div>
														<div className="text-success text-center">
															<div className="time-display">
																{bus.arrival_time || bus.arrival || "09:40 AM"}
															</div>
															<small className="text-muted fw-bold">
																ARRIVAL
															</small>
														</div>
													</div>
												</div>
												<div className="col-md-3 text-md-end mt-3 mt-md-0 d-flex flex-row flex-md-column justify-content-between align-items-center">
													<div className="mb-md-2">
														<span className="badge bg-success px-3 py-2 rounded-pill">
															{bus.status || "RUNNING"}
														</span>
													</div>
													<div className="fw-800 text-dark fs-5">
														{bus.price ? `₹${bus.price}` : "₹120.00"}
													</div>
												</div>
											</div>
										</div>
									</div>
								))}

							{buses === null && !busesLoading && (
								<div className="text-center py-5">
									<p className="text-muted opacity-50 small fw-bold">
										Select destinations to explore bus timings
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeSection;
