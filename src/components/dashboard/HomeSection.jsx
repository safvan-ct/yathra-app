import React, { useEffect, useRef, useState } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useBuses } from "../../../src/hooks/useBuses";
import { useStationSearch } from "../../../src/hooks/useStationSearch";

const LS_KEY = "yathra_stops"; // localStorage persistence key

const HomeSection = () => {
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

	/* boot Choices on each select, restore persisted selection */
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

			// restore saved choice
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

	/* validate → persist → search */
	const handleBusSearch = async (view) => {
		const fId = `from-${view}`;
		const tId = `to-${view}`;

		const fChoice = choicesInstances.current[fId]?.getValue();
		const tChoice = choicesInstances.current[tId]?.getValue();

		const from = fChoice?.value || "";
		const to = tChoice?.value || "";

		// validation
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

		// persist selections for next session
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

	/* clear both dropdowns + localStorage + results */
	const handleClear = () => {
		["from-desktop", "to-desktop", "from-mobile", "to-mobile"].forEach((id) => {
			try {
				choicesInstances.current[id]?.removeActiveItems();
			} catch (_) {}
		});
		try {
			localStorage.removeItem(LS_KEY);
		} catch (_) {}
		clearBuses(); // wipes results state + BUS_CACHE_KEY
	};

	/* swap values then immediately re-search */
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

			// reload results with swapped values
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

			{/* ── Compact Mobile Hero Strip ── */}
			<div
				className="d-block d-md-none position-relative overflow-hidden mb-3"
				style={{
					background: "linear-gradient(135deg, #0d6efd 0%, #001f6b 100%)",
					height: "64px",
					zIndex: 10,
				}}
			>
				{/* Background Mesh Glow */}
				<div
					style={{
						position: "absolute",
						top: "-20px",
						right: "-20px",
						width: "100px",
						height: "100px",
						background:
							"radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
						filter: "blur(15px)",
					}}
				/>

				<div className="d-flex align-items-center justify-content-between h-100 px-3">
					<div>
						<div
							style={{
								fontSize: "1.25rem",
								fontWeight: 900,
								color: "#fff",
								letterSpacing: "-0.5px",
								lineHeight: 1,
							}}
						>
							YATHRA
						</div>
						<div
							style={{
								fontSize: "0.55rem",
								color: "rgba(255,255,255,0.7)",
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "1px",
							}}
						>
							Bus Finder
						</div>
					</div>

					<div
						style={{
							width: "40px",
							height: "40px",
							borderRadius: "12px",
							background: "rgba(255,255,255,0.15)",
							backdropFilter: "blur(10px)",
							border: "1px solid rgba(255,255,255,0.2)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.2rem",
							animation: "busJolt 2s ease-in-out infinite",
						}}
					>
						🚌
					</div>
				</div>
			</div>

			<style>{`
				@keyframes busJolt {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-2px); }
					75% { transform: translateX(1px); }
				}
				.search-card-unique {
					background: #fff;
					border: 1.5px solid #fff !important;
					backdrop-filter: blur(10px);
					box-shadow: 0 20px 50px rgba(13, 110, 253, 0.05), 0 1px 3px rgba(0,0,0,0.02) !important;
					position: relative;
					z-index: 10;
				}
				.search-card-bg-mesh {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					overflow: hidden;
					border-radius: inherit;
					z-index: -1;
					background: linear-gradient(135deg, rgba(239, 246, 255, 0.5) 0%, rgba(255, 255, 255, 1) 100%);
				}
				.search-card-bg-mesh::after {
					content: '';
					position: absolute;
					top: -50%;
					left: -20%;
					width: 140%;
					height: 140%;
					background: radial-gradient(circle, rgba(13,110,253,0.05) 0%, transparent 60%);
					pointer-events: none;
				}
				/* Ensure root doesn't scroll horizontally */
				.app-section {
					overflow-x: hidden !important;
				}
				.stop-dot {
					width: 14px;
					height: 14px;
					border-radius: 50%;
					position: absolute;
					left: -24px;
					top: 50%;
					transform: translateY(-50%);
					z-index: 5;
					background: #fff;
					border: 2.5px solid #0d6efd;
					box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
				}
				.stop-dot.end { border-color: #198754; box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.1); }
				.mobile-connector {
					position: absolute;
					left: -18px;
					top: 28px;
					bottom: 28px;
					width: 2.5px;
					background: #e2e8f0;
					z-index: 1;
					overflow: hidden;
				}
				.mobile-connector::after {
					content: '';
					position: absolute;
					top: -50%;
					left: 0;
					width: 100%;
					height: 50%;
					background: linear-gradient(to bottom, transparent, #0d6efd, transparent);
					animation: flowPath 2s infinite linear;
				}
				@keyframes flowPath {
					from { top: -50%; }
					to { top: 100%; }
				}
				.btn-swap-floating {
					position: absolute;
					right: 12px;
					top: 50%;
					transform: translateY(-50%);
					background: #fff;
					border: 1px solid #e2e8f0;
					width: 42px;
					height: 42px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #0d6efd;
					box-shadow: 0 4px 15px rgba(13, 110, 253, 0.1);
					z-index: 10;
					transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				}
				.btn-swap-floating:active {
					transform: translateY(-50%) scale(0.85) rotate(180deg);
					background: #eff6ff;
					border-color: #bfdbfe;
				}
				.btn-liquid-indigo {
					background: linear-gradient(135deg, #0d6efd 0%, #0043a8 100%);
					border: none;
					box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
					transition: all 0.3s ease;
					letter-spacing: 0.5px;
				}
				.btn-liquid-indigo:hover {
					filter: brightness(1.1);
					box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
					transform: translateY(-1px);
				}
				.btn-liquid-indigo:active {
					transform: translateY(0);
				}
				/* Premium tint for choices selectors */
				.search-card-unique .choices__inner {
					border: 1.5px solid rgba(13, 110, 253, 0.2) !important;
					background-color: rgba(255, 255, 255, 0.8) !important;
					transition: all 0.3s ease !important;
				}
				.search-card-unique .choices.is-focused .choices__inner {
					border-color: rgba(13, 110, 253, 0.5) !important;
					box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.08) !important;
				}
			`}</style>

			<div className="dashboard-container mt-n2 mt-md-0">
				<div className="search-section-wrapper px-md-3">
					<div className="card search-card-unique mb-2 rounded-4">
						<div className="search-card-bg-mesh"></div>
						<div
							className="card-body p-3 p-md-4 position-relative"
							style={{ zIndex: 1 }}
						>
							{/* Fix stacking so open dropdowns are always on top */}
							<style>{`
								.search-card-unique .choices.is-open {
									z-index: 1000 !important;
								}
								.search-card-unique .choices {
									z-index: 5;
								}
							`}</style>
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
									<label
										className="text-muted small fw-bold mb-1 px-1"
										style={{ fontSize: "0.65rem", letterSpacing: "0.8px" }}
									>
										FROM STATION
									</label>
									<select
										id="from-desktop"
										className="choice-select"
										ref={desktopFromRef}
									></select>
								</div>
								<div className="col-auto" style={{ paddingTop: "28px" }}>
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
									<label
										className="text-muted small fw-bold mb-1 px-1"
										style={{ fontSize: "0.65rem", letterSpacing: "0.8px" }}
									>
										TO STATION
									</label>
									<select
										id="to-desktop"
										className="choice-select"
										ref={desktopToRef}
									></select>
								</div>
								<div className="col-auto" style={{ paddingTop: "28px" }}>
									<div className="d-flex gap-2">
										<button
											type="button"
											className="btn btn-liquid-indigo fw-bold rounded-3 px-3 text-white"
											style={{
												whiteSpace: "nowrap",
												display: "flex",
												alignItems: "center",
												height: "42px",
												fontSize: "0.85rem",
											}}
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
											className="btn fw-semibold rounded-3 px-3 border-0 transition-all shadow-sm"
											style={{
												whiteSpace: "nowrap",
												height: "42px",
												display: "flex",
												alignItems: "center",
												fontSize: "0.85rem",
												color: "#64748b",
												background: "#fff",
											}}
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
								<div className="journey-inputs-container ps-4 pe-2 py-1">
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
								<div className="d-flex gap-2 mt-2">
									<button
										type="button"
										className="btn btn-sm btn-primary flex-grow-1 py-2 fw-bold shadow-sm rounded-3"
										style={{ fontSize: "0.82rem" }}
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
										className="btn btn-sm py-2 fw-semibold rounded-3"
										style={{
											border: "1.5px solid #e2e8f0",
											color: "#64748b",
											background: "#f8fafc",
											minWidth: "52px",
											fontSize: "0.82rem",
										}}
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
