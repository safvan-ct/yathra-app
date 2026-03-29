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

	const formatTime = (time) => {
		if (!time) return "";

		const [h, m] = time.split("h ");
		const hours = parseInt(h);
		const mins = parseInt(m);

		if (hours === 0) return `${mins}m`;
		return `${hours}h ${mins}m`;
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
									<label className="small fw-bold text-muted mb-1">From</label>
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
										// disabled={stationsLoading}
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
										// disabled={stationsLoading}
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
								buses?.map((bus, idx) => {
									const isRunningToday = bus.is_running_today == 1;
									const items = [];

									// 1. Push the standard Bus Card
									items.push(
										<div
											key={`bus-${idx}`}
											className={`bus-card card border-0 shadow-sm mb-3 position-relative overflow-hidden ${!isRunningToday ? "opacity-75 grayscale" : ""}`}
											style={{
												borderRadius: "0rem",
												background: isRunningToday ? "#ffffff" : "#f8f9fa",
												filter: isRunningToday
													? "none"
													: "grayscale(100%) brightness(0.85)",
											}}
										>
											<div
												className={`position-absolute start-0 top-0 bottom-0 ${isRunningToday ? "bg-primary" : "bg-secondary"}`}
												style={{ width: "4px", opacity: 0.6 }}
											></div>

											<div className="card-body p-3">
												<div className="row align-items-center g-0">
													{/* Bus Branding & Speed Details Composite */}
													<div className="col-12 col-md-5">
														<div className="d-flex align-items-center ps-2 pe-3">
															<div className="d-flex align-items-center flex-grow-1">
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
																	<h6
																		className="fw-bold text-dark mb-0 lh-1"
																		style={{ fontSize: "0.95rem" }}
																	>
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

															<div className="text-end border-start ps-3 ms-2">
																{!isRunningToday ? (
																	<span
																		className="badge bg-secondary-subtle text-black rounded-pill px-2 border"
																		style={{ fontSize: "0.5rem" }}
																	>
																		NOT RUNNING TODAY
																	</span>
																) : (
																	<div className="lh-1">
																		<span
																			className="text-muted d-block text-uppercase fw-800 mb-1"
																			style={{
																				fontSize: "0.5rem",
																				letterSpacing: "0.7px",
																			}}
																		>
																			AVG SPD
																		</span>
																		<span
																			className="fw-900 text-dark"
																			style={{ fontSize: "0.95rem" }}
																		>
																			{bus.speed_kmh || "00"}
																			<small
																				className="fw-normal text-muted ms-1"
																				style={{ fontSize: "0.65rem" }}
																			>
																				km/h
																			</small>
																		</span>
																	</div>
																)}
															</div>
														</div>
													</div>

													{/* Timeline Section */}
													<div className="col-12 col-md-7 mt-3 mt-md-0 border-start-md">
														<div className="d-flex align-items-center justify-content-between px-2">
															<div className="text-center">
																<span className="d-block fw-bold text-primary fs-6">
																	{bus.departure_time}
																</span>
															</div>
															<div className="flex-grow-1 px-3 d-flex flex-column align-items-center">
																<div className="d-flex align-items-center w-100 justify-content-center mb-1">
																	<div
																		className="rounded-circle border border-primary"
																		style={{ width: "6px", height: "6px" }}
																	></div>
																	<div
																		className="flex-grow-1 bg-primary mx-1"
																		style={{ height: "1.5px" }}
																	></div>
																	<i
																		className="bi bi-chevron-right text-primary opacity-50"
																		style={{ fontSize: "0.6rem" }}
																	></i>
																	<div
																		className="flex-grow-1 bg-primary mx-1"
																		style={{ height: "1.5px" }}
																	></div>
																	<div
																		className="rounded-circle bg-success"
																		style={{ width: "6px", height: "6px" }}
																	></div>
																</div>
																<div
																	className="d-flex gap-2"
																	style={{ fontSize: "0.6rem" }}
																>
																	<span className="text-muted fw-bold">
																		<i className="bi bi-clock me-1"></i>
																		{bus.time_taken}
																	</span>
																	<span className="text-muted opacity-50">
																		|
																	</span>
																	<span className="text-muted fw-bold">
																		<i className="bi bi-signpost-split me-1"></i>
																		{parseInt(bus.trip_distance_km)} Km
																	</span>
																</div>
															</div>
															<div className="text-center">
																<span className="d-block fw-bold text-success fs-6">
																	{bus.arrival_time}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>,
									);

									// 2. AD CARD LOGIC: After every 3 bus cards
									if ((idx + 1) % 3 === 0) {
										items.push(
											<div
												key={`ad-${idx}`}
												className="bus-card card border-0 shadow-sm mb-3 position-relative overflow-hidden"
												style={{ borderRadius: "0rem", background: "#fffdf0" }} // Slight yellow tint for subtle Ad feel
											>
												{/* Golden/Orange Side Accent for Ads */}
												<div
													className="position-absolute start-0 top-0 bottom-0 bg-warning"
													style={{ width: "4px", opacity: 0.8 }}
												></div>

												<div className="card-body p-3">
													<div className="row align-items-center g-0">
														{/* Ad Brand Group */}
														<div className="col-12 col-md-5">
															<div className="d-flex align-items-center ps-2 pe-3">
																<div className="d-flex align-items-center flex-grow-1">
																	<div
																		className="bg-warning bg-opacity-10 d-flex align-items-center justify-content-center rounded"
																		style={{ width: "35px", height: "35px" }}
																	>
																		<i className="bi bi-megaphone-fill text-warning"></i>
																	</div>
																	<div className="ms-3">
																		<h6
																			className="fw-bold text-dark mb-0 lh-1"
																			style={{ fontSize: "0.95rem" }}
																		>
																			Yathra Premium
																		</h6>
																		<small
																			className="text-warning fw-bold text-uppercase"
																			style={{
																				fontSize: "0.6rem",
																				letterSpacing: "1px",
																			}}
																		>
																			Sponsored
																		</small>
																	</div>
																</div>
																{/* Placeholder to keep layout consistent with Bus Card */}
																<div className="text-end border-start ps-3 ms-2 opacity-0">
																	<div className="lh-1">
																		<span style={{ fontSize: "0.95rem" }}>
																			00
																		</span>
																	</div>
																</div>
															</div>
														</div>

														{/* Ad Content: Replaces Timeline */}
														<div className="col-12 col-md-7 mt-2 mt-md-0 border-start-md">
															<div className="d-flex align-items-center justify-content-between px-2">
																<div className="flex-grow-1">
																	<p
																		className="mb-0 text-dark fw-medium"
																		style={{ fontSize: "0.85rem" }}
																	>
																		Enjoy ad-free search and schedules.
																	</p>
																</div>
																<div className="ms-2">
																	<button
																		className="btn btn-warning btn-sm fw-bold px-1 rounded-pill shadow-sm"
																		style={{ fontSize: "0.75rem" }}
																	>
																		GET NOW
																	</button>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>,
										);
									}

									return items;
								})}

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
