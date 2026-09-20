import React, { useState, useEffect } from "react";
import { useStationSearch } from "../../buses/hooks/useStationSearch";
import SponsoredAdCard from "../../home/components/SponsoredAdCard";
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
		],
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
		],
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
		],
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
		],
	},
];

const generateBusesForStop = (stopName, stopId) => {
	const normalizedStop = (stopName || "").toLowerCase().trim();

	// Filter matching trips from pre-defined mock trips
	const matchedTrips = allMockTrips.filter((trip) =>
		trip.stops.some((s) => s.name.toLowerCase().includes(normalizedStop)),
	);

	// Map matched trips to bus timings at this stop
	const results = matchedTrips.map((trip) => {
		const stopDetail = trip.stops.find((s) =>
			s.name.toLowerCase().includes(normalizedStop),
		);
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
			destination_time: destination.time,
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
				destination_time: "01:30 PM",
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
				destination_time: "11:30 AM",
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
				destination_time: "06:30 AM",
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
				destination_time: "11:55 PM",
			},
		];
		return defaultBuses;
	}

	return results;
};

const StopTimingsSection = ({ stop, onBack, onBusClick }) => {
	const {
		searchStations,
		stationResults,
		isSearching: stationsLoading,
	} = useStationSearch();
	const [stopName, setStopName] = useState(stop?.name || "");
	const [stopDisplayName, setStopDisplayName] = useState(
		stop?.display_name || "",
	);
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
			const found = stationResults.find(
				(s) => String(s.id) === String(stop.id),
			);
			if (found) {
				setStopName(found.name);
				setStopDisplayName(found.display_name || "");
			}
		}
	}, [stationResults, stopName, stop]);

	// Retrieve buses for the stop
	const allBuses = generateBusesForStop(
		stopName || `Stop #${stop?.id || ""}`,
		stop?.id || 1,
	);

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
			<div className="stop-timings-header py-2 px-3 text-white">
				<div className="d-flex align-items-center gap-2">
					<button
						className="btn btn-back-light"
						onClick={onBack}
						aria-label="Go Back"
					>
						<i className="bi bi-arrow-left" style={{ fontSize: "14px" }}></i>
					</button>
					<div>
						<h6
							className="fw-bold mb-0 text-white"
							style={{ fontSize: "0.95rem" }}
						>
							{stopName || "Loading Stop..."}
						</h6>
						<span
							className="opacity-75 small fw-semibold"
							style={{ fontSize: "0.68rem", letterSpacing: "0.3px" }}
						>
							{stopDisplayName ? stopDisplayName : `Stop ID: ${stop?.id || ""}`}
						</span>
					</div>
				</div>
			</div>

			<div className="dashboard-container px-1 px-sm-3 mt-1">
				{/* Bus Timings List */}
				<div className="d-flex flex-column gap-0 mb-2">
					<div className="d-flex justify-content-between align-items-center px-1 mb-1">
						<h6
							className="fw-bold text-dark mb-0 pt-2"
							style={{ fontSize: "0.88rem" }}
						>
							Buses Passing Through ({filteredBuses.length})
						</h6>
						{stationsLoading && (
							<div
								className="spinner-border spinner-border-sm text-primary"
								role="status"
							>
								<span className="visually-hidden">Loading stop...</span>
							</div>
						)}
					</div>

					{filteredBuses.length > 0 ? (
						filteredBuses.map((bus, idx) => {
							const isRunningToday = bus.is_running_today === 1;
							const isDeparted =
								isRunningToday && isPastTime(bus.departure_time);
							const rawColor =
								bus.bus_color === "White" ? "#aeafb3" : bus.bus_color;

							const elements = [
								<div
									key={bus.id}
									className={`card border-0 rounded-3 shadow-sm yathra-bus-card bg-white position-relative mb-1 ${
										!isRunningToday ? "opacity-75 grayscale" : ""
									} ${isDeparted ? "" : ""}`}
								>
									<div className="card-body p-2 px-3">
										{/* Top Header: Brand/Bus icon + Name & Number + Status Badge */}
										<div className="card-top-row d-flex align-items-center justify-content-between mb-1">
											<div className="d-flex align-items-center gap-2">
												<div
													className="bus-brand-icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
													style={{
														backgroundColor: "rgba(13, 110, 253, 0.1)",
														color: rawColor || "#0d6efd",
													}}
												>
													<i className="bi bi-bus-front"></i>
												</div>
												<div>
													<h6 className="fw-bold mb-0 text-dark bus-title-text">
														{bus.bus_name}
													</h6>
													<div className="bus-reg-text text-muted">
														{bus.bus_number} • {bus.operator?.name || "KSRTC"}
													</div>
												</div>
											</div>

											{/* Status Badge */}
											<div className="d-flex align-items-center gap-1">
												{!isRunningToday ? (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-secondary border">
														● Not Running
													</span>
												) : isDeparted ? (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-secondary border">
														● Departed
													</span>
												) : (
													<span className="status-badge badge rounded-pill px-2 py-1 bg-success bg-opacity-10 text-success border border-success border-opacity-25">
														● At Stop: {bus.stop_arrival_time}
													</span>
												)}
											</div>
										</div>

										{/* Middle Timings & Journey Route Line */}
										<div className="journey-timings-row d-flex align-items-center justify-content-between my-2">
											{/* Departure */}
											<div className="timing-col start-col text-start">
												<span className="d-block fw-bold departure-time-text">
													{bus.origin_time || bus.departure_time}
												</span>
												<span className="station-sub-text d-block text-truncate">
													{bus.origin_station}
												</span>
											</div>

											{/* Connecting Journey Line with Center Bus Marker */}
											<div className="journey-track-col flex-grow-1 px-2 d-flex align-items-center justify-content-center">
												<div className="journey-dot origin-dot"></div>
												<div className="journey-track-line"></div>
												<div
													className="journey-bus-marker mx-1"
													style={{ color: rawColor || "#0d6efd" }}
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
													{bus.destination_time || bus.arrival_time}
												</span>
												<span className="station-sub-text d-block text-truncate">
													{bus.destination_station}
												</span>
											</div>
										</div>

										{/* Bottom Metadata & Action Buttons */}
										<div className="card-footer-meta d-flex align-items-center justify-content-between pt-2 border-top border-light-subtle">
											<div
												className="d-flex align-items-center gap-2 text-secondary flex-wrap"
												style={{ fontSize: "11px" }}
											>
												{bus.time_taken && (
													<span className="d-flex align-items-center gap-1">
														<i className="bi bi-clock"></i>
														{bus.time_taken}
													</span>
												)}
												{bus.time_taken && bus.trip_distance_km && (
													<span className="meta-divider text-muted opacity-50">
														|
													</span>
												)}
												{bus.trip_distance_km && (
													<span className="d-flex align-items-center gap-1">
														<i className="bi bi-signpost-2"></i>
														{parseInt(bus.trip_distance_km)} km
													</span>
												)}
												{bus.category && (
													<>
														<span className="meta-divider text-muted opacity-50">
															|
														</span>
														<span className="badge bg-light text-secondary border rounded-pill px-1.5 py-0.5">
															{bus.category}
														</span>
													</>
												)}
											</div>

											{/* Action Buttons */}
											<div className="d-flex align-items-center gap-1">
												{isRunningToday && (
													<button
														type="button"
														className="btn btn-outline-primary btn-sm rounded-pill px-2.5 py-0.5 fw-bold"
														style={{ fontSize: "11px", lineHeight: 1.2 }}
														onClick={(e) => {
															e.stopPropagation();
															onBusClick && onBusClick(bus);
														}}
														title="Track Live Bus Location"
													>
														<i className="bi bi-geo-alt-fill me-0.5"></i> Track
													</button>
												)}
											</div>
										</div>
									</div>
								</div>,
							];

							// Insert Sponsored Ad Banner after every 2 bus cards like home ad card
							if ((idx + 1) % 2 === 0) {
								const adIndex = Math.floor(idx / 2);
								elements.push(
									<SponsoredAdCard
										key={`sponsored-ad-${idx}`}
										index={adIndex}
									/>,
								);
							}

							return elements;
						})
					) : (
						<div className="text-center py-5 card border-0 rounded-4 shadow-sm bg-white p-4">
							<i className="bi bi-bus-front text-muted fs-1 mb-2"></i>
							<h6 className="fw-bold text-secondary">No Buses Found</h6>
							<p className="text-muted small mb-0">
								Try a different search query or shift filter.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StopTimingsSection;
