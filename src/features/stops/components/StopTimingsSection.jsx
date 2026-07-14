import React, { useState, useEffect } from "react";
import { useStationSearch } from "../../buses/hooks/useStationSearch";
import "../styles/StopTimings.css";

// Pre-defined mock trip details matching Yathra routes
const allMockTrips = [
	{
		id: "T-201",
		bus_name: "Yathra Premium AC",
		bus_number: "KL-07-Y-1001",
		category: "AC Multi-Axle",
		bus_color: "#0d6efd",
		operator: { name: "KSRTC Swift", type: "State" },
		speed_kmh: 60,
		is_running_today: 1,
		time_taken: "5h 30m",
		trip_distance_km: "220",
		stops: [
			{ name: "Cochin (Vytila)", time: "07:30 AM", hour: 7.5 },
			{ name: "Cherthala Bypass", time: "08:20 AM", hour: 8.33 },
			{ name: "Alappuzha", time: "09:00 AM", hour: 9.0 },
			{ name: "Kayamkulam", time: "09:55 AM", hour: 9.92 },
			{ name: "Kollam", time: "11:15 AM", hour: 11.25 },
			{ name: "Trivandrum Central", time: "01:00 PM", hour: 13.0 },
		]
	},
	{
		id: "T-202",
		bus_name: "KSRTC Minnal Super Express",
		bus_number: "KL-15-A-4210",
		category: "Super Deluxe",
		bus_color: "#dc3545",
		operator: { name: "KSRTC Kerala", type: "State" },
		speed_kmh: 70,
		is_running_today: 1,
		time_taken: "8h 30m",
		trip_distance_km: "375",
		stops: [
			{ name: "Trivandrum Central", time: "02:15 PM", hour: 14.25 },
			{ name: "Kollam", time: "03:45 PM", hour: 15.75 },
			{ name: "Alappuzha", time: "05:50 PM", hour: 17.83 },
			{ name: "Ernakulam", time: "07:20 PM", hour: 19.33 },
			{ name: "Thrissur", time: "08:45 PM", hour: 20.75 },
			{ name: "Kozhikode (Calicut)", time: "10:45 PM", hour: 22.75 },
		]
	},
	{
		id: "T-203",
		bus_name: "Yathra Sleeper Connect",
		bus_number: "KL-07-Z-8889",
		category: "AC Sleeper",
		bus_color: "#198754",
		operator: { name: "Kallada Travels", type: "Private" },
		speed_kmh: 65,
		is_running_today: 1,
		time_taken: "9h 45m",
		trip_distance_km: "530",
		stops: [
			{ name: "Cochin (Vytila)", time: "08:30 PM", hour: 20.5 },
			{ name: "Aluva Bypass", time: "09:00 PM", hour: 21.0 },
			{ name: "Thrissur Bypass", time: "10:15 PM", hour: 22.25 },
			{ name: "Palakkad", time: "11:45 PM", hour: 23.75 },
			{ name: "Hosur", time: "05:15 AM", hour: 5.25 },
			{ name: "Bangalore (Kaladipal)", time: "06:15 AM", hour: 6.25 },
		]
	},
	{
		id: "T-204",
		bus_name: "Intercity Multi-Axle Gold",
		bus_number: "KA-01-M-5523",
		category: "Premium Sleeper",
		bus_color: "#ffc107",
		operator: { name: "SRS Travels", type: "Private" },
		speed_kmh: 68,
		is_running_today: 1,
		time_taken: "9h 45m",
		trip_distance_km: "530",
		stops: [
			{ name: "Bangalore (Kaladipal)", time: "09:45 PM", hour: 21.75 },
			{ name: "Hosur", time: "10:35 PM", hour: 22.58 },
			{ name: "Palakkad", time: "04:00 AM", hour: 4.0 },
			{ name: "Thrissur Bypass", time: "05:30 AM", hour: 5.5 },
			{ name: "Aluva Bypass", time: "06:45 AM", hour: 6.75 },
			{ name: "Cochin (Vytila)", time: "07:30 AM", hour: 7.5 },
		]
	}
];

const generateBusesForStop = (stopName, stopId) => {
	const normalizedStop = (stopName || "").toLowerCase().trim();
	
	// Filter matching trips from pre-defined mock trips
	const matchedTrips = allMockTrips.filter(trip => 
		trip.stops.some(s => s.name.toLowerCase().includes(normalizedStop))
	);
	
	// Map matched trips to bus timings at this stop
	const results = matchedTrips.map(trip => {
		const stopDetail = trip.stops.find(s => s.name.toLowerCase().includes(normalizedStop));
		const origin = trip.stops[0];
		const destination = trip.stops[trip.stops.length - 1];
		
		return {
			id: trip.id.replace("T-", ""),
			trip_id: trip.id,
			bus_name: trip.bus_name,
			bus_number: trip.bus_number,
			category: trip.category,
			bus_color: trip.bus_color,
			operator: trip.operator,
			speed_kmh: trip.speed_kmh,
			is_running_today: trip.is_running_today,
			departure_time: stopDetail.time, 
			departure_hour: stopDetail.hour,
			arrival_time: destination.time,
			time_taken: trip.time_taken,
			trip_distance_km: trip.trip_distance_km,
			stop_arrival_time: stopDetail.time,
			origin_station: origin.name,
			origin_time: origin.time,
			destination_station: destination.name,
			destination_time: destination.time
		};
	});

	// If no pre-defined trips matched this stop name, dynamically generate 4 mock buses passing through this stop
	if (results.length === 0) {
		const defaultBuses = [
			{
				id: `10${stopId}1`,
				trip_id: `T-STOP-${stopId}-1`,
				bus_name: "Yathra Express Connect",
				bus_number: `KL-04-A-${1000 + parseInt(stopId || 1)}`,
				category: "Super Fast Seater",
				bus_color: "#0d6efd",
				operator: { name: "KSRTC Kerala", type: "State" },
				speed_kmh: 58,
				is_running_today: 1,
				departure_time: "08:15 AM",
				departure_hour: 8.25,
				arrival_time: "01:30 PM",
				time_taken: "5h 15m",
				trip_distance_km: "210",
				stop_arrival_time: "08:15 AM",
				origin_station: stopName || "Current Stop",
				origin_time: "08:15 AM",
				destination_station: "Trivandrum Central",
				destination_time: "01:30 PM"
			},
			{
				id: `10${stopId}2`,
				trip_id: `T-STOP-${stopId}-2`,
				bus_name: "Royal Intercity AC",
				bus_number: `KA-03-R-${2000 + parseInt(stopId || 1)}`,
				category: "AC Seater",
				bus_color: "#198754",
				operator: { name: "Greenline Travels", type: "Private" },
				speed_kmh: 62,
				is_running_today: 1,
				departure_time: "11:30 AM",
				departure_hour: 11.5,
				arrival_time: "08:45 PM",
				time_taken: "9h 15m",
				trip_distance_km: "480",
				stop_arrival_time: "11:30 AM",
				origin_station: "Kozhikode Bypass",
				origin_time: "08:00 AM",
				destination_station: stopName || "Current Stop",
				destination_time: "11:30 AM"
			},
			{
				id: `10${stopId}3`,
				trip_id: `T-STOP-${stopId}-3`,
				bus_name: "Yathra Premium Sleeper",
				bus_number: `KL-01-Z-${3000 + parseInt(stopId || 1)}`,
				category: "Volvo Multi-Axle AC Sleeper",
				bus_color: "#dc3545",
				operator: { name: "Kallada Connect", type: "Private" },
				speed_kmh: 66,
				is_running_today: 1,
				departure_time: "09:45 PM",
				departure_hour: 21.75,
				arrival_time: "06:30 AM",
				time_taken: "8h 45m",
				trip_distance_km: "450",
				stop_arrival_time: "10:15 PM",
				origin_station: "Cochin (Vytila)",
				origin_time: "09:00 PM",
				destination_station: "Bangalore Majestic",
				destination_time: "06:30 AM"
			},
			{
				id: `10${stopId}4`,
				trip_id: `T-STOP-${stopId}-4`,
				bus_name: "Malabar Express",
				bus_number: `KL-10-X-${4000 + parseInt(stopId || 1)}`,
				category: "Non-AC Sleeper",
				bus_color: "#ffc107",
				operator: { name: "KSRTC Kerala", type: "State" },
				speed_kmh: 52,
				is_running_today: 0,
				departure_time: "04:30 PM",
				departure_hour: 16.5,
				arrival_time: "11:55 PM",
				time_taken: "7h 25m",
				trip_distance_km: "340",
				stop_arrival_time: "04:30 PM",
				origin_station: stopName || "Current Stop",
				origin_time: "04:30 PM",
				destination_station: "Kozhikode Central",
				destination_time: "11:55 PM"
			}
		];
		return defaultBuses;
	}
	
	return results;
};

const StopTimingsSection = ({ stop, onBack, onBusClick }) => {
	const { searchStations, stationResults, isSearching: stationsLoading } = useStationSearch();
	const [stopName, setStopName] = useState(stop?.name || "");
	const [stopDisplayName, setStopDisplayName] = useState(stop?.display_name || "");
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTimeFilter, setActiveTimeFilter] = useState("all");

	// Direct URL load fallback logic
	useEffect(() => {
		if (!stopName && stop?.id) {
			searchStations("");
		}
	}, [stop, stopName, searchStations]);

	useEffect(() => {
		if (!stopName && stationResults.length > 0 && stop?.id) {
			const found = stationResults.find(s => String(s.id) === String(stop.id));
			if (found) {
				setStopName(found.name);
				setStopDisplayName(found.display_name || "");
			}
		}
	}, [stationResults, stopName, stop]);

	// Retrieve buses for the stop
	const allBuses = generateBusesForStop(stopName || `Stop #${stop?.id || ""}`, stop?.id || 1);

	// Time formatting utilities
	const isPastTime = (timeStr) => {
		if (!timeStr) return false;
		const now = new Date();
		// Subtract 15 minutes buffer
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

	// Filter buses
	const filteredBuses = allBuses.filter((bus) => {
		// 1. Search Query filter (matches name, number or final destination)
		const matchesSearch =
			bus.bus_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			bus.bus_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
			bus.destination_station.toLowerCase().includes(searchQuery.toLowerCase());

		// 2. Shift time filter
		let matchesTime = true;
		if (activeTimeFilter === "morning") {
			matchesTime = bus.departure_hour >= 6 && bus.departure_hour < 12;
		} else if (activeTimeFilter === "afternoon") {
			matchesTime = bus.departure_hour >= 12 && bus.departure_hour < 18;
		} else if (activeTimeFilter === "evening") {
			matchesTime = bus.departure_hour >= 18 || bus.departure_hour < 6;
		}

		return matchesSearch && matchesTime;
	});

	return (
		<div className="stop-timings-container section-fade">
			{/* Header component styled similarly to other inner sub-pages */}
			<div className="stop-timings-header py-4 px-3 text-white rounded-bottom-4 shadow">
				<div className="stop-timings-header-glow"></div>
				<div className="d-flex align-items-center gap-3">
					<button
						className="btn btn-back-light"
						onClick={onBack}
						aria-label="Go Back"
					>
						<i className="bi bi-arrow-left fs-5"></i>
					</button>
					<div>
						<h5 className="fw-bolder mb-0 fs-5">{stopName || "Loading Stop..."}</h5>
						<span className="opacity-75 small fw-semibold" style={{ letterSpacing: "0.5px" }}>
							{stopDisplayName ? stopDisplayName : `Stop ID: ${stop?.id || ""}`}
						</span>
					</div>
				</div>
			</div>

			<div className="dashboard-container px-3 mt-4">
				{/* Search & Shift Filters Card */}
				<div className="card glass-filter-card border-0 rounded-4 p-3 mb-4 shadow-sm">
					<div className="position-relative mb-3">
						<i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-75"></i>
						<input
							type="text"
							className="form-control bg-light border-0 rounded-pill ps-5 shadow-none py-2"
							placeholder="Search by bus name or destination..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="d-flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
						<button
							className={`filter-chip-button text-nowrap ${
								activeTimeFilter === "all" ? "active" : ""
							}`}
							onClick={() => setActiveTimeFilter("all")}
						>
							All Shifts
						</button>
						<button
							className={`filter-chip-button text-nowrap ${
								activeTimeFilter === "morning" ? "active" : ""
							}`}
							onClick={() => setActiveTimeFilter("morning")}
						>
							☀️ Morning (6 AM - 12 PM)
						</button>
						<button
							className={`filter-chip-button text-nowrap ${
								activeTimeFilter === "afternoon" ? "active" : ""
							}`}
							onClick={() => setActiveTimeFilter("afternoon")}
						>
							🌤️ Afternoon (12 PM - 6 PM)
						</button>
						<button
							className={`filter-chip-button text-nowrap ${
								activeTimeFilter === "evening" ? "active" : ""
							}`}
							onClick={() => setActiveTimeFilter("evening")}
						>
							🌙 Evening (6 PM - 6 AM)
						</button>
					</div>
				</div>

				{/* Bus Timings List */}
				<div className="d-flex flex-column gap-3 mb-4">
					<div className="d-flex justify-content-between align-items-center px-1 mb-1">
						<h6 className="fw-bold text-dark mb-0">
							Buses Passing Through ({filteredBuses.length})
						</h6>
						{stationsLoading && (
							<div className="spinner-border spinner-border-sm text-primary" role="status">
								<span className="visually-hidden">Loading stop...</span>
							</div>
						)}
					</div>

					{filteredBuses.length > 0 ? (
						filteredBuses.map((bus) => {
							const isRunningToday = bus.is_running_today === 1;
							const isDeparted = isRunningToday && isPastTime(bus.departure_time);
							const rawColor = bus.bus_color === "White" ? "#aeafb3" : bus.bus_color;

							return (
								<div
									key={bus.id}
									className={`card bus-card border-0 shadow-sm position-relative overflow-hidden bg-white ${
										!isRunningToday ? "opacity-75 grayscale" : ""
									} ${isDeparted ? "bus-card-departed" : ""}`}
									style={{
										background: !isRunningToday
											? "#f8f9fa"
											: isDeparted
											? "#fdfdfe"
											: "#ffffff"
									}}
								>
									{/* Vertical colored theme line */}
									<div
										className="bus-card-indicator"
										style={{
											background: !isRunningToday
												? "#6c757d"
												: isDeparted
												? "#ffc107"
												: rawColor || "#0d6efd",
										}}
									></div>

									<div className="card-body p-3">
										<div className="row align-items-center g-0">
											{/* Column 1: Bus Name and Number */}
											<div className="col-12 col-md-5">
												<div className="d-flex align-items-center ps-2 pe-3">
													<div className="d-flex align-items-center flex-grow-1">
														<div
															className="d-flex align-items-center justify-content-center animate-bus-icon"
															style={{ color: rawColor || "#0d6efd" }}
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
																	AVG SPEED
																</span>
																<span className="fw-900 text-dark bus-card-speed">
																	{bus.speed_kmh || "50"}
																	<small className="fw-normal text-muted ms-1 bus-card-speed-unit">
																		km/h
																	</small>
																</span>
															</div>
														)}
													</div>
												</div>
											</div>

											{/* Column 2: Journey visual timeline (Origin -> This Stop -> Destination) */}
											<div className="col-12 col-md-7 mt-3 mt-md-0 border-start-md">
												<div className="d-flex align-items-center justify-content-between px-2">
													{/* Origin */}
													<div className="text-start" style={{ width: "30%", minWidth: "70px" }}>
														<span className="d-block fw-bold text-dark fs-7 text-truncate">
															{bus.origin_station.split(" ")[0]}
														</span>
														<small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.68rem" }}>
															{bus.origin_time}
														</small>
													</div>

													{/* Central visual line showing scheduled pass-through */}
													<div className="flex-grow-1 px-2 d-flex flex-column align-items-center">
														<div className="text-center mb-1">
															<span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-2 py-0.5 fw-bold" style={{ fontSize: "0.68rem" }}>
																At Stop: {bus.stop_arrival_time}
															</span>
														</div>
														<div className="d-flex align-items-center w-100 justify-content-center mb-1">
															<div className="rounded-circle border border-primary journey-dot-start"></div>
															<div className="bg-primary journey-line flex-grow-1"></div>
															<div className="rounded-circle bg-primary journey-dot-mid shadow-sm" title={`Arrives here at ${bus.stop_arrival_time}`}></div>
															<div className="bg-primary journey-line flex-grow-1"></div>
															<div className="rounded-circle bg-success journey-dot-end"></div>
														</div>
														<div className="d-flex gap-2 journey-meta justify-content-center">
															<span className="text-muted fw-bold">
																<i className="bi bi-clock me-1"></i>
																{bus.time_taken}
															</span>
															<span className="text-muted opacity-50">|</span>
															<span className="text-muted fw-bold">
																<i className="bi bi-signpost-split me-1"></i>
																{parseInt(bus.trip_distance_km)} Km
															</span>
														</div>
													</div>

													{/* Destination */}
													<div className="text-end" style={{ width: "30%", minWidth: "70px" }}>
														<span className="d-block fw-bold text-success fs-7 text-truncate">
															{bus.destination_station.split(" ")[0]}
														</span>
														<small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.68rem" }}>
															{bus.destination_time}
														</small>
													</div>
												</div>

												{/* Action Buttons row inside Card */}
												<div className="d-flex justify-content-end gap-2 mt-3 pt-2.5 border-top border-light px-2">
													<span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill custom-badge d-flex align-items-center me-auto pb-1">
														<i className="bi bi-building me-1 opacity-75"></i>
														{bus.operator.name}
													</span>
													{isRunningToday && (
														<button
															className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold py-1.5"
															onClick={() => onBusClick && onBusClick(bus)}
															title="Track Live Bus Location"
														>
															<i className="bi bi-geo-alt-fill me-1"></i> Track
														</button>
													)}
													<button
														className={`btn btn-primary btn-sm rounded-pill px-3 fw-bold py-1.5 ${
															!isRunningToday ? "btn-light text-muted" : "shadow-sm"
														}`}
														disabled={!isRunningToday}
														onClick={() => alert(`Seat Booking feature is only active from the search results tab.`)}
													>
														Book
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="text-center py-5 card border-0 rounded-4 shadow-sm bg-white p-4">
							<i className="bi bi-bus-front text-muted fs-1 mb-2"></i>
							<h6 className="fw-bold text-secondary">No Buses Found</h6>
							<p className="text-muted small mb-0">Try a different search query or shift filter.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StopTimingsSection;
