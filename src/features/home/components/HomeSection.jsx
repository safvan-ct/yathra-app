import React, { useEffect, useRef, useState, useMemo } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import { useBuses } from "../../buses/hooks/useBuses";
import { useStationSearch } from "../../buses/hooks/useStationSearch";
import HeaderIllustration from "./HeaderIllustration";
import SponsoredAdCard from "./SponsoredAdCard";
import ViewStopsModal from "./ViewStopsModal";
import "../styles/HomeSection.css";

const LS_KEY = "yathra_stops";

const HomeSection = ({ onBusClick }) => {
	const desktopFromRef = useRef(null);
	const desktopToRef = useRef(null);
	const mobileFromRef = useRef(null);
	const mobileToRef = useRef(null);

	const choicesInstances = useRef({});
	const [validationError, setValidationError] = useState("");
	const [sortBy, setSortBy] = useState("departure_time");
	const [selectedDate, setSelectedDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	});
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedBusForStops, setSelectedBusForStops] = useState(null);
	const [notificationMessage, setNotificationMessage] = useState("");

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
	}, [searchStations]);

	// Initialize choices.js instances from localStorage if available
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
				removeItemButton: false,
				placeholderValue: "Select station...",
				allowHTML: true,
				itemSelectText: "",
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

	// Populate station choices when stationResults update from API
	useEffect(() => {
		if (!stationResults || stationResults.length === 0) return;

		const formattedOptions = stationResults.map((r) => ({
			value: String(r.id),
			label: `${r.name}${r.display_name ? ` <small class="choice-secondary-label">${r.display_name}</small>` : ""}`,
		}));

		Object.values(choicesInstances.current).forEach((instance) => {
			if (!instance || !instance.passedElement || !instance.containerOuter)
				return;

			try {
				const currentVal = instance.getValue();
				instance.clearChoices();
				if (currentVal && currentVal.value) {
					instance.setChoices(
						[
							currentVal,
							...formattedOptions.filter(
								(o) => o.value !== String(currentVal.value),
							),
						],
						"value",
						"label",
						true,
					);
				} else {
					instance.setChoices(formattedOptions, "value", "label", true);
				}
			} catch (err) {
				console.warn("Skipped choices injection due to invalid state.", err);
			}
		});
	}, [stationResults]);

	// Format current display date (e.g. "Today, 19 Sep 2026")
	const formattedDateDisplay = useMemo(() => {
		if (!selectedDate) return "Today";
		const dateObj = new Date(selectedDate);
		const todayObj = new Date();
		const isToday =
			dateObj.getDate() === todayObj.getDate() &&
			dateObj.getMonth() === todayObj.getMonth() &&
			dateObj.getFullYear() === todayObj.getFullYear();

		const day = dateObj.getDate();
		const month = dateObj.toLocaleString("default", { month: "short" });
		const year = dateObj.getFullYear();

		return isToday
			? `Today, ${day} ${month} ${year}`
			: `${day} ${month} ${year}`;
	}, [selectedDate]);

	// Station Names from choices
	const getStationNames = () => {
		const fromChoice =
			choicesInstances.current["from-mobile"]?.getValue() ||
			choicesInstances.current["from-desktop"]?.getValue();
		const toChoice =
			choicesInstances.current["to-mobile"]?.getValue() ||
			choicesInstances.current["to-desktop"]?.getValue();

		const stripHtml = (html) => {
			if (!html) return "";
			const tmp = document.createElement("DIV");
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || "";
		};

		return {
			from: stripHtml(fromChoice?.label) || "",
			to: stripHtml(toChoice?.label) || "",
		};
	};

	const handleBusSearch = async () => {
		const fromChoice =
			choicesInstances.current["from-mobile"]?.getValue() ||
			choicesInstances.current["from-desktop"]?.getValue();
		const toChoice =
			choicesInstances.current["to-mobile"]?.getValue() ||
			choicesInstances.current["to-desktop"]?.getValue();

		let from = fromChoice?.value || "";
		let to = toChoice?.value || "";

		// If value is non-numeric string, try resolving ID from stationResults
		if (from && isNaN(from) && stationResults?.length > 0) {
			const found = stationResults.find((s) =>
				s.name?.toLowerCase().includes(from.toLowerCase()),
			);
			if (found) from = String(found.id);
		}
		if (to && isNaN(to) && stationResults?.length > 0) {
			const found = stationResults.find((s) =>
				s.name?.toLowerCase().includes(to.toLowerCase()),
			);
			if (found) to = String(found.id);
		}

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
					from: fromChoice ? { value: from, label: fromChoice.label } : null,
					to: toChoice ? { value: to, label: toChoice.label } : null,
				}),
			);
		} catch (_) {}

		await searchBuses(from, to);
	};

	const handleClear = (role) => {
		if (role === "from") {
			["from-desktop", "from-mobile"].forEach((id) => {
				try {
					choicesInstances.current[id]?.removeActiveItems();
				} catch (_) {}
			});
		} else if (role === "to") {
			["to-desktop", "to-mobile"].forEach((id) => {
				try {
					choicesInstances.current[id]?.removeActiveItems();
				} catch (_) {}
			});
		} else {
			["from-desktop", "to-desktop", "from-mobile", "to-mobile"].forEach(
				(id) => {
					try {
						choicesInstances.current[id]?.removeActiveItems();
					} catch (_) {}
				},
			);
			try {
				localStorage.removeItem(LS_KEY);
			} catch (_) {}
			clearBuses();
		}
	};

	const handleSwap = () => {
		const fInstDesktop = choicesInstances.current["from-desktop"];
		const tInstDesktop = choicesInstances.current["to-desktop"];
		const fInstMobile = choicesInstances.current["from-mobile"];
		const tInstMobile = choicesInstances.current["to-mobile"];

		const fChoice = fInstMobile?.getValue() || fInstDesktop?.getValue();
		const tChoice = tInstMobile?.getValue() || tInstDesktop?.getValue();

		if (!fChoice && !tChoice) return;

		// Clear active items
		[fInstDesktop, tInstDesktop, fInstMobile, tInstMobile].forEach((inst) => {
			try {
				inst?.removeActiveItems();
			} catch (_) {}
		});

		// Swap To into From
		if (tChoice && tChoice.value) {
			[fInstDesktop, fInstMobile].forEach((inst) => {
				if (inst) {
					try {
						inst.setChoices(
							[
								{
									value: String(tChoice.value),
									label: tChoice.label,
									selected: true,
								},
							],
							"value",
							"label",
							true,
						);
					} catch (_) {}
				}
			});
		}

		// Swap From into To
		if (fChoice && fChoice.value) {
			[tInstDesktop, tInstMobile].forEach((inst) => {
				if (inst) {
					try {
						inst.setChoices(
							[
								{
									value: String(fChoice.value),
									label: fChoice.label,
									selected: true,
								},
							],
							"value",
							"label",
							true,
						);
					} catch (_) {}
				}
			});
		}

		const newFrom = tChoice?.value ? String(tChoice.value) : "";
		const newTo = fChoice?.value ? String(fChoice.value) : "";

		try {
			localStorage.setItem(
				LS_KEY,
				JSON.stringify({
					from: tChoice ? { value: newFrom, label: tChoice.label } : null,
					to: fChoice ? { value: newTo, label: fChoice.label } : null,
				}),
			);
		} catch (_) {}

		if (newFrom && newTo) {
			searchBuses(newFrom, newTo);
		}
	};

	const isPastTime = (timeStr) => {
		if (!timeStr) return false;
		const now = new Date();
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

	// Parse minutes from time string for sorting
	const parseTimeToMinutes = (timeStr) => {
		if (!timeStr) return 9999;
		const timePart = timeStr.trim().toUpperCase();
		let hours = 0,
			minutes = 0;
		if (timePart.includes("AM") || timePart.includes("PM")) {
			const parts = timePart.split(/\s+/);
			const timeParts = (parts[0] || "").split(":");
			hours = parseInt(timeParts[0]) || 0;
			minutes = parseInt(timeParts[1]) || 0;
			const modifier = parts[1] || (timePart.includes("PM") ? "PM" : "AM");
			if (modifier === "PM" && hours < 12) hours += 12;
			if (modifier === "AM" && hours === 12) hours = 0;
		} else {
			const parts = timePart.split(":");
			hours = parseInt(parts[0]) || 0;
			minutes = parseInt(parts[1]) || 0;
		}
		return hours * 60 + minutes;
	};

	// Sort buses from API response
	const sortedBuses = useMemo(() => {
		if (!buses || !Array.isArray(buses)) return buses;
		const copy = [...buses];

		copy.sort((a, b) => {
			if (sortBy === "departure_time") {
				return (
					parseTimeToMinutes(a.departure_time) -
					parseTimeToMinutes(b.departure_time)
				);
			}
			if (sortBy === "arrival_time") {
				return (
					parseTimeToMinutes(a.arrival_time) -
					parseTimeToMinutes(b.arrival_time)
				);
			}
			if (sortBy === "duration") {
				const parseDur = (d) => parseInt(d) || 0;
				return parseDur(a.time_taken) - parseDur(b.time_taken);
			}
			if (sortBy === "fare") {
				const fareA = a.fare || 0;
				const fareB = b.fare || 0;
				return fareA - fareB;
			}
			if (sortBy === "name") {
				return (a.bus_name || "").localeCompare(b.bus_name || "");
			}
			return 0;
		});

		return copy;
	}, [buses, sortBy]);

	// Color themes for card accents
	const getCardColorTheme = (bus, index) => {
		const themes = [
			{ primary: "#1d72fe", lightBg: "#eef4ff", border: "#3b82f6" },
			{ primary: "#16a34a", lightBg: "#ecfdf5", border: "#22c55e" },
			{ primary: "#7c3aed", lightBg: "#f5f3ff", border: "#8b5cf6" },
			{ primary: "#ea580c", lightBg: "#fff7ed", border: "#f97316" },
		];

		if (bus.bus_color && bus.bus_color.toLowerCase() !== "white") {
			return {
				primary: bus.bus_color,
				lightBg: `${bus.bus_color}15`,
				border: bus.bus_color,
			};
		}

		return themes[index % themes.length];
	};

	const stations = getStationNames();

	return (
		<div id="section-home" className="app-section active">
			{/* Top Header Section with Illustration */}
			<div className="yathra-top-header position-relative overflow-hidden">
				<HeaderIllustration />

				<div className="dashboard-container position-relative z-2">
					<div className="d-flex align-items-center pt-2 pb-1 px-1">
						{/* Brand Logo & Subtitle */}
						<div className="d-flex flex-column me-5">
							<h1 className="yathra-header-brand mb-0">YATHRA</h1>
							<span className="yathra-header-sub">Bus Finder</span>
						</div>

						{/* Tagline */}
						<div className="text-center header-tagline-text">
							<span>Simple Routes</span>
							<span>Brighter Journeys</span>
						</div>
					</div>
				</div>
			</div>

			{/* Notification Toast */}
			{notificationMessage && (
				<div className="dashboard-container mt-1">
					<div className="alert alert-info py-1 px-3 small rounded-3 shadow-sm d-flex align-items-center justify-content-between mb-0">
						<span style={{ fontSize: "12px" }}>
							<i className="bi bi-info-circle-fill me-2"></i>
							{notificationMessage}
						</span>
						<button
							type="button"
							className="btn-close btn-close-sm"
							onClick={() => setNotificationMessage("")}
						></button>
					</div>
				</div>
			)}

			{/* Main Content Area */}
			<div className="dashboard-container px-1 px-sm-3 mt-1">
				{/* Search & Filter Card */}
				<div className="search-card-wrapper mb-1">
					<div className="card border-0 rounded-4 shadow-sm yathra-search-card bg-white p-1">
						{/* Validation error if any */}
						{(busesError || stationsError || validationError) && (
							<div
								className={`alert py-1 px-2 small mb-1 rounded-2 d-flex align-items-center gap-1 ${
									validationError ? "alert-warning" : "alert-danger"
								}`}
								style={{ fontSize: "11px" }}
							>
								<i
									className={`bi ${
										validationError
											? "bi-exclamation-triangle-fill"
											: "bi-x-circle-fill"
									}`}
								/>
								{validationError || busesError || stationsError}
							</div>
						)}

						{/* Origin & Destination Inputs Full Width with Overlaid Floating Swap Button */}
						<div className="search-inputs-container position-relative mb-2 w-100">
							{/* Origin Input (Full Width) */}
							<div className="station-input-box from-station-box d-flex align-items-center rounded-3 px-2 py-0 bg-light w-100 mb-2">
								<div className="station-icon-dot blue-pin flex-shrink-0 me-2 d-flex align-items-center justify-content-center">
									<i
										className="bi bi-geo-alt-fill text-primary"
										style={{ fontSize: "15px" }}
									></i>
								</div>
								<div className="flex-grow-1 choices-wrapper">
									<div className="d-none d-md-block">
										<select
											id="from-desktop"
											className="choice-select"
											ref={desktopFromRef}
										></select>
									</div>
									<div className="d-block d-md-none">
										<select
											id="from-mobile"
											className="choice-select"
											ref={mobileFromRef}
										></select>
									</div>
								</div>
								<button
									type="button"
									className="btn btn-link text-muted p-0 ms-1 border-0 shadow-none clear-input-btn"
									onClick={() => handleClear("from")}
									title="Clear origin"
								>
									<i className="bi bi-x" style={{ fontSize: "15px" }}></i>
								</button>
							</div>

							{/* Destination Input (Full Width) */}
							<div className="station-input-box to-station-box d-flex align-items-center rounded-3 px-2 py-0 bg-light w-100">
								<div className="station-icon-dot green-pin flex-shrink-0 me-2 d-flex align-items-center justify-content-center">
									<i
										className="bi bi-geo-alt-fill text-success"
										style={{ fontSize: "15px" }}
									></i>
								</div>
								<div className="flex-grow-1 choices-wrapper">
									<div className="d-none d-md-block">
										<select
											id="to-desktop"
											className="choice-select"
											ref={desktopToRef}
										></select>
									</div>
									<div className="d-block d-md-none">
										<select
											id="to-mobile"
											className="choice-select"
											ref={mobileToRef}
										></select>
									</div>
								</div>
								<button
									type="button"
									className="btn btn-link text-muted p-0 ms-1 border-0 shadow-none clear-input-btn"
									onClick={() => handleClear("to")}
									title="Clear destination"
								>
									<i className="bi bi-x" style={{ fontSize: "15px" }}></i>
								</button>
							</div>

							{/* Vertical Swap Button Overlaid over the search boxes on the right */}
							<button
								type="button"
								className="btn yathra-swap-btn shadow-sm"
								onClick={handleSwap}
								title="Swap Origin and Destination"
							>
								<i
									className="bi bi-arrow-down-up text-primary"
									style={{ fontSize: "14px" }}
								></i>
							</button>
						</div>

						{/* Single Row: Date Picker Pill + Find Buses Button */}
						<div className="d-flex align-items-center gap-2 pt-1">
							{/* Date Selector Pill */}
							<div
								className="position-relative flex-grow-1"
								style={{ flex: "1.2" }}
							>
								<button
									type="button"
									className="btn btn-light rounded-3 px-2 py-2 border date-selector-btn d-flex align-items-center justify-content-between w-100"
									onClick={() => setShowDatePicker(!showDatePicker)}
								>
									<span
										className="d-flex align-items-center gap-2 text-dark fw-semibold"
										style={{ fontSize: "12.5px" }}
									>
										<i
											className="bi bi-calendar-event text-dark opacity-75"
											style={{ fontSize: "13px" }}
										></i>
										<span className="text-truncate">
											{formattedDateDisplay}
										</span>
									</span>
									<i
										className="bi bi-chevron-down text-muted"
										style={{ fontSize: "11px" }}
									></i>
								</button>

								{/* Popover Date Picker */}
								{showDatePicker && (
									<div className="date-picker-dropdown position-absolute bg-white shadow-lg rounded-3 p-3 mt-1 z-3 border">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<span
												className="fw-bold small text-dark"
												style={{ fontSize: "12px" }}
											>
												Select Journey Date
											</span>
											<button
												type="button"
												className="btn-close btn-close-sm"
												onClick={() => setShowDatePicker(false)}
											></button>
										</div>
										<input
											type="date"
											className="form-control form-control-sm mb-2"
											value={selectedDate}
											onChange={(e) => {
												setSelectedDate(e.target.value);
												setShowDatePicker(false);
											}}
										/>
										<div className="d-flex gap-2">
											<button
												type="button"
												className="btn btn-sm btn-outline-primary flex-grow-1 py-1"
												style={{ fontSize: "11px" }}
												onClick={() => {
													setSelectedDate(
														new Date().toISOString().split("T")[0],
													);
													setShowDatePicker(false);
												}}
											>
												Today
											</button>
											<button
												type="button"
												className="btn btn-sm btn-outline-secondary flex-grow-1 py-1"
												style={{ fontSize: "11px" }}
												onClick={() => {
													const tmrw = new Date();
													tmrw.setDate(tmrw.getDate() + 1);
													setSelectedDate(tmrw.toISOString().split("T")[0]);
													setShowDatePicker(false);
												}}
											>
												Tomorrow
											</button>
										</div>
									</div>
								)}
							</div>

							{/* Find Buses Button */}
							<div className="flex-grow-1" style={{ flex: "1" }}>
								<button
									type="button"
									className="btn btn-primary rounded-3 px-3 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100 btn-find-buses"
									onClick={handleBusSearch}
									disabled={busesLoading || stationsLoading}
								>
									{busesLoading ? (
										<>
											<span className="spinner-border spinner-border-sm" />
											<span style={{ fontSize: "13px" }}>Finding...</span>
										</>
									) : (
										<>
											<i
												className="bi bi-search"
												style={{ fontSize: "13px" }}
											></i>
											<span style={{ fontSize: "13px" }}>Find Buses</span>
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Results Section */}
				<div className="results-list-container pb-0 mb-0">
					{/* Results Header (Count + Sort) when API returns buses */}
					{sortedBuses && sortedBuses.length > 0 && !busesLoading && (
						<div className="d-flex align-items-center justify-content-between mb-1 px-1">
							<h6 className="fw-bold mb-0 text-dark results-count-title">
								{sortedBuses.length}{" "}
								{sortedBuses.length === 1 ? "Bus" : "Buses"} Found
							</h6>

							{/* Sort By Dropdown */}
							<div className="d-flex align-items-center gap-1">
								<span
									className="text-secondary fw-medium"
									style={{ fontSize: "12px" }}
								>
									Sort by
								</span>
								<div className="position-relative">
									<select
										className="form-select form-select-sm rounded-pill sort-dropdown py-1 ps-2 pe-4 fw-semibold text-dark border"
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
									>
										<option value="departure_time">Departure Time</option>
										<option value="arrival_time">Arrival Time</option>
										<option value="duration">Fastest Duration</option>
										<option value="fare">Lowest Fare</option>
										<option value="name">Bus Name</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{/* Loading State */}
					{busesLoading && (
						<div className="text-center py-5">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
							<p className="text-muted small mt-2 fw-semibold">
								Searching live bus schedules...
							</p>
						</div>
					)}

					{/* Empty State (API returned 0 buses) */}
					{!busesLoading && buses !== null && buses.length === 0 && (
						<div className="card border-0 rounded-4 shadow-sm p-4 text-center bg-white my-3">
							<div
								className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-2"
								style={{ width: "54px", height: "54px", background: "#f1f5f9" }}
							>
								<i className="bi bi-bus-front text-muted fs-3"></i>
							</div>
							<h6 className="fw-bold text-dark mb-1">No Buses Found</h6>
							<p className="text-muted small mb-0" style={{ fontSize: "12px" }}>
								We couldn't find any direct buses between the selected stops.
							</p>
						</div>
					)}

					{/* Initial Prompt (Before Searching) */}
					{!busesLoading && buses === null && (
						<div className="card border-0 rounded-4 shadow-sm p-4 text-center bg-white my-3">
							<div
								className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-2"
								style={{
									width: "54px",
									height: "54px",
									background: "#eff6ff",
									color: "#0d6efd",
								}}
							>
								<i className="bi bi-geo-alt fs-3"></i>
							</div>
							<h6 className="fw-bold text-dark mb-1">Search Bus Routes</h6>
							<p className="text-muted small mb-0" style={{ fontSize: "12px" }}>
								Select origin and destination stations above and tap{" "}
								<strong>Find Buses</strong> to view live schedules.
							</p>
						</div>
					)}

					{/* Real Bus Listing Cards from API */}
					{!busesLoading &&
						sortedBuses?.map((bus, idx) => {
							const colorTheme = getCardColorTheme(bus, idx);
							const isRunningToday =
								bus.is_running_today == 1 || bus.is_running_today === undefined;
							const isDeparted =
								isRunningToday && isPastTime(bus.departure_time);

							const formatDuration = (timeStr, durationMinutes) => {
								if (
									durationMinutes !== undefined &&
									durationMinutes !== null &&
									!isNaN(durationMinutes) &&
									durationMinutes !== ""
								) {
									const totalMins = parseInt(durationMinutes, 10);
									if (totalMins < 60) return `${totalMins} min`;
									const hours = Math.floor(totalMins / 60);
									const mins = totalMins % 60;
									return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
								}

								if (!timeStr) return "";
								const str = String(timeStr).trim().toLowerCase();

								let hours = 0;
								let mins = 0;
								let hasHours = false;
								let hasMins = false;

								const hMatch = str.match(/(\d+)\s*h/);
								const mMatch = str.match(/(\d+)\s*(?:m|min)/);

								if (hMatch) {
									hours = parseInt(hMatch[1], 10);
									hasHours = true;
								}
								if (mMatch) {
									mins = parseInt(mMatch[1], 10);
									hasMins = true;
								}

								if (!hasHours && !hasMins && str.includes(":")) {
									const parts = str.split(":");
									if (parts.length >= 2) {
										hours = parseInt(parts[0], 10) || 0;
										mins = parseInt(parts[1], 10) || 0;
										hasHours = true;
										hasMins = true;
									}
								}

								if (!hasHours && !hasMins) {
									const numMatch = str.match(/(\d+)/);
									if (numMatch) {
										mins = parseInt(numMatch[1], 10);
										hasMins = true;
									}
								}

								const totalMinutes = hours * 60 + mins;
								if (totalMinutes < 60) {
									return `${totalMinutes} min`;
								} else {
									const h = Math.floor(totalMinutes / 60);
									const m = totalMinutes % 60;
									return m > 0 ? `${h}h ${m}m` : `${h}h`;
								}
							};

							const formatDistance = (val) => {
								if (
									val === undefined ||
									val === null ||
									val === "" ||
									isNaN(val)
								)
									return "";
								const num = parseFloat(val);
								if (isNaN(num)) return "";
								if (Number.isInteger(num) || num % 1 === 0) {
									return `${Math.round(num)} km`;
								}
								const formatted = parseFloat(num.toFixed(2));
								return `${formatted} km`;
							};

							const getFareString = (val) => {
								const raw = val ?? 25;
								const num = parseFloat(raw);
								if (!isNaN(num)) {
									const displayFare =
										Number.isInteger(num) || num % 1 === 0
											? Math.round(num)
											: parseFloat(num.toFixed(2));
									return `₹ ${displayFare}`;
								}
								return `₹ ${raw}`;
							};

							const durationStr = formatDuration(
								bus.time_taken,
								bus.duration_minutes,
							);
							const distanceStr = formatDistance(bus.trip_distance_km);
							const fareValue =
								bus.fare ??
								bus.ticket_price ??
								bus.price ??
								bus.ticketPrice ??
								25;
							const fareStr = getFareString(fareValue);

							const cleanStationName = (name) => {
								if (!name) return "";
								return name.replace(/\s*\([^)]*\)/g, "").trim();
							};

							const originName = cleanStationName(
								stations.from || bus.from_station || "Origin",
							);
							const destName = cleanStationName(
								stations.to || bus.to_station || "Destination",
							);

							const elements = [];

							elements.push(
								<div
									key={bus.id || idx}
									className={`card border-0 shadow-sm rounded-3 yathra-bus-card mb-1 bg-white position-relative overflow-hidden ${
										isDeparted ? "yathra-card-departed" : ""
									}`}
									onClick={() => onBusClick && onBusClick(bus)}
								>
									{/* Left vertical color stripe */}
									<div
										className="card-left-accent"
										style={{ backgroundColor: colorTheme.primary }}
									></div>

									<div className="card-body p-2">
										{/* Top Header Row of Card */}
										<div className="d-flex align-items-center justify-content-between mb-2">
											<div className="d-flex align-items-center gap-2">
												{/* Bus icon badge */}
												<div
													className="bus-brand-icon-box rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
													style={{
														backgroundColor: colorTheme.lightBg,
														color: colorTheme.primary,
													}}
												>
													<i className="bi bi-bus-front"></i>
												</div>

												<div>
													<h6 className="fw-bold mb-0 text-dark bus-title-text">
														{bus.bus_name || "Bus"}
													</h6>
													<div className="bus-reg-text text-muted">
														{bus.bus_number || ""}
													</div>
												</div>
											</div>

											{/* Status Badge + Chevron */}
											<div className="d-flex align-items-center gap-1">
												{!isRunningToday ? (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-secondary border">
														● Not Running
													</span>
												) : isDeparted ? (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-secondary border">
														● Departed
													</span>
												) : bus.status === "Slight Delay" ? (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">
														● Slight Delay
													</span>
												) : (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-success bg-opacity-10 text-success border border-success border-opacity-25">
														● On Time
													</span>
												)}
												<i
													className="bi bi-chevron-right text-muted"
													style={{ fontSize: "12px" }}
												></i>
											</div>
										</div>

										{/* Middle Timings & Journey Route Line */}
										<div className="journey-timings-row d-flex align-items-center justify-content-between my-2">
											{/* Departure */}
											<div className="timing-col start-col">
												<span className="d-block fw-bold departure-time-text">
													{bus.departure_time || "--:--"}
												</span>
												<span className="station-sub-text d-block text-truncate">
													{originName}
												</span>
											</div>

											{/* Connecting Journey Line with Center Bus Marker */}
											<div className="journey-track-col flex-grow-1 px-2 d-flex align-items-center justify-content-center">
												<div className="journey-dot origin-dot"></div>
												<div className="journey-track-line"></div>
												<div
													className="journey-bus-marker mx-1"
													style={{ color: colorTheme.primary }}
												>
													<i className="bi bi-bus-front"></i>
												</div>
												<div className="journey-track-line"></div>
												<i className="bi bi-chevron-right journey-track-arrow"></i>
												<div className="journey-dot dest-dot ms-1"></div>
											</div>

											{/* Arrival */}
											<div className="timing-col end-col text-end">
												<span className="d-block fw-bold arrival-time-text">
													{bus.arrival_time || "--:--"}
												</span>
												<span className="station-sub-text d-block text-truncate">
													{destName}
												</span>
											</div>
										</div>

										{/* Bottom Metadata & View Stops Action */}
										<div className="card-footer-meta d-flex align-items-center justify-content-between pt-2 border-top border-light-subtle">
											<div
												className="d-flex align-items-center gap-2 text-secondary flex-wrap"
												style={{ fontSize: "11px" }}
											>
												{durationStr && (
													<span className="d-flex align-items-center gap-1">
														<i className="bi bi-clock"></i>
														{durationStr}
													</span>
												)}
												{durationStr && distanceStr && (
													<span className="meta-divider text-muted opacity-50">
														|
													</span>
												)}
												{distanceStr && (
													<span className="d-flex align-items-center gap-1">
														<i className="bi bi-signpost-2"></i>
														{distanceStr}
													</span>
												)}
												{(distanceStr || durationStr) && fareStr && (
													<span className="meta-divider text-muted opacity-50">
														|
													</span>
												)}
												{fareStr && (
													<span
														className="d-flex align-items-center gap-1 fw-bold"
														style={{ color: "#0d6efd" }}
													>
														{/* <i className="bi bi-ticket-perforated"></i> */}
														{fareStr}
													</span>
												)}
											</div>

											{/* View Stops Button */}
											<button
												type="button"
												className="btn text-primary text-decoration-none fw-bold d-flex align-items-center gap-1 view-stops-btn"
												style={{
													fontSize: "11px",
													backgroundColor: "#eff6ff",
													padding: "3px 9px",
													borderRadius: "20px",
													border: "none",
													lineHeight: 1.2,
												}}
												onClick={(e) => {
													e.stopPropagation();
													setSelectedBusForStops(bus);
												}}
											>
												Stops <i className="bi bi-chevron-right"></i>
											</button>
										</div>
									</div>
								</div>,
							);

							// Insert Sponsored Ad Banner after the 2nd bus card
							if (idx === 1) {
								elements.push(<SponsoredAdCard key="sponsored-ad" />);
							}

							return elements;
						})}
				</div>
			</div>

			{/* View Stops Modal */}
			<ViewStopsModal
				bus={selectedBusForStops}
				isOpen={!!selectedBusForStops}
				onClose={() => setSelectedBusForStops(null)}
				onTrackBus={(bus) => onBusClick && onBusClick(bus)}
				fromStationName={stations.from}
				toStationName={stations.to}
			/>
		</div>
	);
};

export default HomeSection;
