import React, { useEffect, useRef, useState } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useBuses } from "../../buses/hooks/useBuses";
import { useStationSearch } from "../../buses/hooks/useStationSearch";
import "../styles/HomeSection.css";

const LS_KEY = "yathra_stops";

const HomeSection = ({ onBusClick }) => {
	const desktopFromRef = useRef(null);
	const desktopToRef = useRef(null);
	const mobileFromRef = useRef(null);
	const mobileToRef = useRef(null);

	const choicesInstances = useRef({});
	const [validationError, setValidationError] = useState("");

	const {
		buses,
		loading: busesLoading,
		error: busesError,
		searchBuses,
		clearBuses,
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
		const saved = (() => {
			try {
				return JSON.parse(localStorage.getItem(LS_KEY)) || {};
			} catch {
				return {};
			}
		})();

		const attachInstance = (ref, id) => {
			if (!ref.current || choicesInstances.current[id]) return;

			const instance = new Choices(ref.current, {
				searchEnabled: true,
				shouldSort: false,
				removeItemButton: true,
				placeholderValue: "Search stops...",
				allowHTML: true,
			});

			const role = id.startsWith("from") ? "from" : "to";
			if (saved[role]) {
				instance.setChoices(
					[
						{
							value: saved[role].value,
							label: saved[role].label,
							selected: true,
						},
					],
					"value",
					"label",
					true,
				);
			}

			instance.passedElement.element.addEventListener("search", (e) => {
				searchStations(e.detail?.value || "");
			});

			choicesInstances.current[id] = instance;
		};

		attachInstance(desktopFromRef, "from-desktop");
		attachInstance(desktopToRef, "to-desktop");
		attachInstance(mobileFromRef, "from-mobile");
		attachInstance(mobileToRef, "to-mobile");

		return () => {
			Object.values(choicesInstances.current).forEach((inst) => {
				try {
					inst?.destroy();
				} catch (err) {}
			});
			choicesInstances.current = {};
		};
	}, [searchStations]);

	useEffect(() => {
		if (!stationResults) return;

		const formattedOptions = stationResults.map((r) => ({
			value: String(r.id),
			label: `${r.name}${r.display_name ? ` <small class="choice-secondary-label">${r.display_name}</small>` : ""}`,
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

		const fChoice = choicesInstances.current[fId]?.getValue();
		const tChoice = choicesInstances.current[tId]?.getValue();

		const from = fChoice?.value || "";
		const to = tChoice?.value || "";

		if (!from && !to) {
			setValidationError("Please select both From and To stations.");
			return;
		}
		if (!from) {
			setValidationError("Please select a From station.");
			return;
		}
		if (!to) {
			setValidationError("Please select a To station.");
			return;
		}
		if (from === to) {
			setValidationError("From and To stations cannot be the same.");
			return;
		}

		setValidationError("");

		try {
			localStorage.setItem(
				LS_KEY,
				JSON.stringify({
					from: fChoice ? { value: fChoice.value, label: fChoice.label } : null,
					to: tChoice ? { value: tChoice.value, label: tChoice.label } : null,
				}),
			);
		} catch (_) {}

		await searchBuses(from, to);
	};

	const handleClear = () => {
		["from-desktop", "to-desktop", "from-mobile", "to-mobile"].forEach((id) => {
			try {
				choicesInstances.current[id]?.removeActiveItems();
			} catch (_) {}
		});
		try {
			localStorage.removeItem(LS_KEY);
		} catch (_) {}
		clearBuses();
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

			const newFrom = tVal?.value || "";
			const newTo = fVal?.value || "";
			searchBuses(newFrom, newTo);
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

	const isPastTime = (timeStr) => {
		if (!timeStr) return false;
		const now = new Date();
		// Subtract 15 minutes buffer: only mark as past if it departed >15m ago
		const threshold = new Date(now.getTime() - 15 * 60000);
		const currentH = threshold.getHours();
		const currentM = threshold.getMinutes();

		let h, m;
		const timePart = timeStr.trim().toUpperCase();

		if (timePart.includes("AM") || timePart.includes("PM")) {
			const parts = timePart.split(/\s+/);
			const timeParts = parts[0].split(":");
			let hours = parseInt(timeParts[0]);
			const minutes = parseInt(timeParts[1]);
			const modifier = parts[1] || (timePart.includes("PM") ? "PM" : "AM");

			if (modifier === "PM" && hours < 12) hours += 12;
			if (modifier === "AM" && hours === 12) hours = 0;
			h = hours;
			m = minutes;
		} else {
			const parts = timePart.split(":");
			h = parseInt(parts[0]);
			m = parseInt(parts[1]);
		}

		if (isNaN(h) || isNaN(m)) return false;

		if (h < currentH) return true;
		if (h === currentH && m <= currentM) return true;
		return false;
	};

	return (
		<div id="section-home" className="app-section active">
			<div className="search-header text-center d-none d-md-block">
				<div className="container">
					<h1 className="fw-800 mb-1">YATHRA</h1>
					<p className="opacity-75">
						Instant access to city-wide bus schedules
					</p>
				</div>
			</div>

			<div className="home-mobile-header d-block d-md-none position-relative overflow-hidden mb-3">
				<div className="home-mobile-header-glow" />

				<div className="d-flex align-items-center justify-content-between h-100 px-3">
					<div>
						<div className="home-brand-title">YATHRA</div>
						<div className="home-brand-subtitle">Bus Finder</div>
					</div>

					<div className="home-bus-icon-badge">🚌</div>
				</div>
			</div>

			<div className="dashboard-container mt-n2 mt-md-0">
				<div className="search-section-wrapper px-md-3">
					<div className="card search-card-unique mb-2 rounded-4">
						<div className="search-card-bg-mesh"></div>
						<div className="card-body p-3 pe-2 p-md-4 home-search-card-body">
							{(busesError || stationsError || validationError) && (
								<div
									className={`alert py-2 small mb-3 d-flex align-items-center gap-2 ${validationError ? "alert-warning" : "alert-danger"}`}
								>
									<i
										className={`bi ${validationError ? "bi-exclamation-triangle" : "bi-x-circle"}`}
									/>
									{validationError || busesError || stationsError}
								</div>
							)}
							<div className="d-none d-md-flex row g-3 align-items-center">
								<div className="col">
									<label className="home-label-caps">FROM STATION</label>
									<select
										id="from-desktop"
										className="choice-select"
										ref={desktopFromRef}
									></select>
								</div>
								<div className="col-auto home-col-action">
									<button
										type="button"
										className="btn btn-swap-creative shadow-sm"
										data-view="desktop"
										onClick={() => handleSwap("desktop")}
									>
										<i className="bi bi-arrow-left-right"></i>
									</button>
								</div>
								<div className="col">
									<label className="home-label-caps">TO STATION</label>
									<select
										id="to-desktop"
										className="choice-select"
										ref={desktopToRef}
									></select>
								</div>
								<div className="col-auto home-col-action">
									<div className="d-flex gap-2">
										<button
											type="button"
											className="btn btn-liquid-indigo fw-bold rounded-3 px-3 text-white btn-search-bus"
											onClick={() => handleBusSearch("desktop")}
											disabled={busesLoading || stationsLoading}
										>
											{busesLoading ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" />
													Searching
												</>
											) : (
												<>
													<i className="bi bi-search me-2" />
													Search Bus
												</>
											)}
										</button>
										<button
											type="button"
											className="btn fw-semibold rounded-3 px-3 border-0 transition-all shadow-sm btn-clear-home"
											onClick={handleClear}
											title="Clear selections"
										>
											<i className="bi bi-x-lg me-1" />
											Clear
										</button>
									</div>
								</div>
							</div>

							<div className="d-block d-md-none" id="mobile-inputs">
								<div className="journey-inputs-container ps-3 pe-0 py-1">
									<div className="mobile-station-inputs">
										<div className="position-relative mb-2">
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
									>
										<i className="bi bi-arrow-down-up"></i>
									</button>
								</div>
								<div className="d-flex gap-2 mt-2 ps-3">
									<button
										type="button"
										className="btn btn-sm btn-primary flex-grow-1 py-2 fw-bold shadow-sm rounded-3 btn-find-bus-mobile"
										onClick={() => handleBusSearch("mobile")}
										disabled={busesLoading || stationsLoading}
									>
										{busesLoading ? (
											<>
												<span className="spinner-border spinner-border-sm me-1" />
												Searching…
											</>
										) : (
											<>
												<i className="bi bi-search me-1" />
												Find Bus
											</>
										)}
									</button>
									<button
										type="button"
										className="btn btn-sm py-2 fw-semibold rounded-3 btn-clear-mobile"
										onClick={handleClear}
										title="Clear selections"
									>
										<i className="bi bi-x-lg" />
									</button>
								</div>
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
									const isDeparted =
										isRunningToday && isPastTime(bus.departure_time);
									const items = [];

									items.push(
										<div
											key={`bus-${idx}`}
											className={`bus-card card bus-card-main border-0 shadow-sm mb-3 position-relative overflow-hidden ${!isRunningToday ? "opacity-75 grayscale" : ""} ${isDeparted ? "bus-card-departed" : ""}`}
											onClick={() =>
												isRunningToday && onBusClick && onBusClick(bus)
											}
											style={{
												background: !isRunningToday
													? "#f8f9fa"
													: isDeparted
														? "#fdfdfe"
														: "#ffffff",
												cursor: isRunningToday ? "pointer" : "default",
											}}
										>
											<div
												className={`bus-card-indicator ${!isRunningToday ? "bg-secondary" : isDeparted ? "bg-warning opacity-50" : "bg-primary"}`}
											></div>

											<div className="card-body p-3">
												<div className="row align-items-center g-0">
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
																	<h6 className="fw-bold text-dark mb-0 lh-1 bus-card-name">
																		{bus.bus_name}
																	</h6>
																	<small className="text-muted opacity-75 fw-medium bus-card-meta">
																		{bus.bus_number}
																	</small>
																</div>
															</div>

															<div className="text-end border-start ps-3 ms-2">
																{!isRunningToday ? (
																	<span className="badge bg-secondary-subtle text-black rounded-pill px-2 border badge-not-running">
																		NOT RUNNING TODAY
																	</span>
																) : isDeparted ? (
																	<span className="badge badge-departed rounded-pill px-2 border">
																		DEPARTED
																	</span>
																) : (
																	<div className="lh-1">
																		<span className="text-muted d-block text-uppercase fw-800 mb-1 bus-card-label-tiny">
																			AVG SPD
																		</span>
																		<span className="fw-900 text-dark bus-card-speed">
																			{bus.speed_kmh || "00"}
																			<small className="fw-normal text-muted ms-1 bus-card-speed-unit">
																				km/h
																			</small>
																		</span>
																	</div>
																)}
															</div>
														</div>
													</div>

													<div className="col-12 col-md-7 mt-3 mt-md-0 border-start-md">
														<div className="d-flex align-items-center justify-content-between px-2">
															<div className="text-center">
																<span className="d-block fw-bold text-primary fs-6">
																	{bus.departure_time}
																</span>
															</div>
															<div className="flex-grow-1 px-3 d-flex flex-column align-items-center">
																<div className="d-flex align-items-center w-100 justify-content-center mb-1">
																	<div className="rounded-circle border border-primary journey-dot-start"></div>
																	<div className="bg-primary journey-line"></div>
																	<i className="bi bi-chevron-right text-primary opacity-50 journey-arrow"></i>
																	<div className="bg-primary journey-line"></div>
																	<div className="rounded-circle bg-success journey-dot-end"></div>
																</div>
																<div className="d-flex gap-2 journey-meta">
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

									// if ((idx + 1) % 3 === 0) {
									// 	items.push(
									// 		<div
									// 			key={`ad-${idx}`}
									// 			className="bus-card card bus-card-main border-0 shadow-sm mb-3 position-relative overflow-hidden"
									// 			style={{ background: "#fffdf0" }}
									// 		>
									// 			<div className="bus-card-indicator bg-warning"></div>

									// 			<div className="card-body p-3">
									// 				<div className="row align-items-center g-0">
									// 					<div className="col-12 col-md-5">
									// 						<div className="d-flex align-items-center ps-2 pe-3">
									// 							<div className="d-flex align-items-center flex-grow-1">
									// 								<div
									// 									className="bg-warning bg-opacity-10 d-flex align-items-center justify-content-center rounded"
									// 									style={{ width: "35px", height: "35px" }}
									// 								>
									// 									<i className="bi bi-megaphone-fill text-warning"></i>
									// 								</div>
									// 								<div className="ms-3">
									// 									<h6 className="fw-bold text-dark mb-0 lh-1 bus-card-name">
									// 										Yathra Premium
									// 									</h6>
									// 									<small className="text-warning fw-bold text-uppercase bus-card-label-tiny">
									// 										Sponsored
									// 									</small>
									// 								</div>
									// 							</div>
									// 						</div>
									// 					</div>

									// 					<div className="col-12 col-md-7 mt-2 mt-md-0 border-start-md">
									// 						<div className="d-flex align-items-center justify-content-between px-2">
									// 							<div className="flex-grow-1">
									// 								<p className="mb-0 text-dark fw-medium small">
									// 									Enjoy ad-free search and schedules.
									// 								</p>
									// 							</div>
									// 							<div className="ms-2">
									// 								<button className="btn btn-warning btn-sm fw-bold px-3 rounded-pill shadow-sm small">
									// 									GET
									// 								</button>
									// 							</div>
									// 						</div>
									// 					</div>
									// 				</div>
									// 			</div>
									// 		</div>,
									// 	);
									// }

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
