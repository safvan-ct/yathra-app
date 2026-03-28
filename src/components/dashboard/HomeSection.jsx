import React, { useEffect, useRef } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useBuses } from "../../../src/hooks/useBuses";
import { useStationSearch } from "../../../src/hooks/useStationSearch";

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
		searchStations,
		stationResults,
		isSearching: stationsLoading,
		error: stationsError,
	} = useStationSearch();

	useEffect(() => {
		searchStations("");
	}, []);

	useEffect(() => {
		const attachInstance = (ref, id) => {
			if (!ref.current || choicesInstances.current[id]) return;

			const instance = new Choices(ref.current, {
				searchEnabled: true,
				shouldSort: false,
				removeItemButton: true,
				placeholderValue: "Search stops...",
				allowHTML: true,
			});

			instance.passedElement.element.addEventListener("search", (e) => {
				const queryValue = e.detail?.value || "";
				searchStations(queryValue);
			});

			choicesInstances.current[id] = instance;
		};

		attachInstance(desktopFromRef, "from-desktop");
		attachInstance(desktopToRef, "to-desktop");
		attachInstance(mobileFromRef, "from-mobile");
		attachInstance(mobileToRef, "to-mobile");

		return () => {
			Object.values(choicesInstances.current).forEach((instance) => {
				try {
					instance?.destroy();
				} catch (err) {}
			});
			choicesInstances.current = {};
		};
	}, [searchStations]);

	useEffect(() => {
		if (!stationResults) return;

		// Pre-compute dropdown markup elements identically mapped
		const formattedOptions = stationResults.map((r) => ({
			value: String(r.id || r.code),
			label: `<span class="badge bg-primary">${String(r.code)
				.substring(0, 3)
				.toUpperCase()}</span> ${r.name || r.code} <small class="text-muted"></small>`,
		}));

		Object.values(choicesInstances.current).forEach((instance) => {
			if (!instance || !instance.passedElement || !instance.containerOuter)
				return;

			try {
				instance.clearChoices();
				instance.setChoices(formattedOptions, "value", "label", true);
			} catch (err) {
				console.warn("Skipped choices injection due to invalid state.", err);
			}
		});
	}, [stationResults]);

	const handleBusSearch = async (view) => {
		const fId = `from-${view}`;
		const tId = `to-${view}`;

		const fromChoice = choicesInstances.current[fId]?.getValue(true);
		const toChoice = choicesInstances.current[tId]?.getValue(true);

		const from = fromChoice || "";
		const to = toChoice || "";

		await searchBuses(from, to);
	};

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
									></select>
								</div>
								<div className="col-auto pt-4">
									<button
										type="button"
										className="btn btn-primary px-5 fw-bold h-100 rounded-3"
										onClick={() => handleBusSearch("desktop")}
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
									onClick={() => handleBusSearch("mobile")}
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
									<div
										className="bus-card card border-0 shadow-sm mb-3 position-relative overflow-hidden"
										style={{ borderRadius: "1.25rem", background: "#ffffff" }}
									>
										{/* Subtle side accent instead of top bar */}
										<div
											className="position-absolute start-0 top-0 bottom-0 bg-primary"
											style={{ width: "4px", opacity: 0.6 }}
										></div>

										<div className="card-body p-3">
											<div className="row align-items-center g-0">
												{/* 1. Brand Section: Minimalist & Clean */}
												<div className="col-12 col-md-4 mb-3 mb-md-0">
													<div className="d-flex align-items-center ps-2">
														<div
															className="d-flex align-items-center justify-content-center"
															style={{
																color:
																	bus.bus_color?.toLowerCase() === "white"
																		? "#aeafb3"
																		: bus.bus_color,
															}}
														>
															<i className="bi bi-bus-front fs-4"></i>
														</div>
														<div className="ms-3">
															<h6 className="fw-bold text-dark mb-0 lh-1">
																{bus.bus_name}
															</h6>
															<small
																className="text-muted opacity-75 fw-medium"
																style={{ fontSize: "0.7rem" }}
															>
																{bus.bus_number}
															</small>
														</div>
													</div>
												</div>

												{/* 2. Timeline Section: Lightweight Journey Flow */}
												<div className="col-12 col-md-8">
													<div className="d-flex align-items-center">
														{/* Departure */}
														<div className="text-start">
															<span className="d-block fw-800 text-primary fs-5">
																{bus.departure_time}
															</span>
															<span
																className="text-uppercase text-muted fw-bold"
																style={{ fontSize: "0.6rem" }}
															>
																Depart
															</span>
														</div>

														{/* Minimalist Path Line */}
														<div className="flex-grow-1 px-4 position-relative d-flex flex-column align-items-center">
															<div className="d-flex align-items-center w-100 justify-content-center">
																{/* Start Point */}
																<div
																	className="rounded-circle border border-primary"
																	style={{ width: "7px", height: "7px" }}
																></div>

																{/* Thin Connector */}
																<div
																	className="flex-grow-1 bg-primary mx-1"
																	style={{ height: "1.5px" }}
																></div>

																{/* Subtle Direction Icon */}
																<i
																	className="bi bi-chevron-right text-primary"
																	style={{ fontSize: "0.7rem" }}
																></i>

																<div
																	className="flex-grow-1 bg-primary mx-1"
																	style={{ height: "1.5px" }}
																></div>

																{/* End Point */}
																<div
																	className="rounded-circle bg-success"
																	style={{ width: "7px", height: "7px" }}
																></div>
															</div>
														</div>

														{/* Arrival */}
														<div className="text-end">
															<span className="d-block fw-800 text-success fs-5">
																{bus.arrival_time}
															</span>
															<span
																className="text-uppercase text-muted fw-bold"
																style={{ fontSize: "0.6rem" }}
															>
																Arrive
															</span>
														</div>

														{/* Action: Only a chevron for interaction hint */}
														<div className="ms-3 d-none d-md-block">
															<i className="bi bi-arrow-right-short fs-4 text-primary opacity-25"></i>
														</div>
													</div>
												</div>
											</div>
										</div>

										<style jsx>{`
											.bus-card {
												transition: all 0.2s ease-in-out;
												cursor: pointer;
											}
											.bus-card:hover {
												transform: translateX(4px);
												box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
											}
										`}</style>
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
