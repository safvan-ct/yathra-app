import React, { useState, useEffect } from "react";
import "../styles/BusTrips.css";

const BusTripsSection = ({ bus, onBack, onTrackBus }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTimeFilter, setActiveTimeFilter] = useState("all");
	const [expandedTripId, setExpandedTripId] = useState(null);

	// Seat Booking Modal State
	const [bookingTrip, setBookingTrip] = useState(null);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [bookingConfirmed, setBookingConfirmed] = useState(false);
	const [bookingRef, setBookingRef] = useState("");

	// Fallback to a mock bus if none passed or incomplete
	const activeBus = (bus && bus.bus_name) ? bus : {
		id: bus?.id || 1,
		bus_name: bus?.bus_name || `Yathra Premium ${bus?.id || ""}`,
		bus_number: bus?.bus_number || `KL-07-Y-${1000 + parseInt(bus?.id || 1)}`,
		category: bus?.category || "AC Multi-Axle",
		bus_color: bus?.bus_color || "#0d6efd",
		operator: bus?.operator || { name: "KSRTC", type: "State" },
		speed_kmh: bus?.speed_kmh || 60,
	};

	// Generate some realistic trips for this specific bus
	const allTrips = [
		{
			id: "T-201",
			route_name: "Cochin to Trivandrum",
			departure_time: "07:30 AM",
			departure_hour: 7.5,
			arrival_time: "01:00 PM",
			time_taken: "5h 30m",
			trip_distance_km: "220",
			fare: 420,
			available_seats: 14,
			is_active: true,
			stops: [
				{ name: "Cochin (Vytila)", time: "07:30 AM" },
				{ name: "Cherthala Bypass", time: "08:20 AM" },
				{ name: "Alappuzha", time: "09:00 AM" },
				{ name: "Kayamkulam", time: "09:55 AM" },
				{ name: "Kollam", time: "11:15 AM" },
				{ name: "Trivandrum Central", time: "01:00 PM" },
			],
			sold_seats: ["A1", "A2", "B3", "C2", "C3", "D1", "E2", "F3", "F4"],
		},
		{
			id: "T-202",
			route_name: "Trivandrum to Kozhikode",
			departure_time: "02:15 PM",
			departure_hour: 14.25,
			arrival_time: "10:45 PM",
			time_taken: "8h 30m",
			trip_distance_km: "375",
			fare: 680,
			available_seats: 8,
			is_active: true,
			stops: [
				{ name: "Trivandrum Central", time: "02:15 PM" },
				{ name: "Kollam", time: "03:45 PM" },
				{ name: "Alappuzha", time: "05:50 PM" },
				{ name: "Ernakulam", time: "07:20 PM" },
				{ name: "Thrissur", time: "08:45 PM" },
				{ name: "Kozhikode (Calicut)", time: "10:45 PM" },
			],
			sold_seats: ["A1", "A3", "A4", "B1", "B2", "B4", "C1", "C2", "C3", "D2", "D3", "E1", "E4", "F1", "F2"],
		},
		{
			id: "T-203",
			route_name: "Cochin to Bangalore",
			departure_time: "08:30 PM",
			departure_hour: 20.5,
			arrival_time: "06:15 AM",
			time_taken: "9h 45m",
			trip_distance_km: "530",
			fare: 1100,
			available_seats: 26,
			is_active: false,
			stops: [
				{ name: "Cochin (Vytila)", time: "08:30 PM" },
				{ name: "Aluva Bypass", time: "09:00 PM" },
				{ name: "Thrissur Bypass", time: "10:15 PM" },
				{ name: "Palakkad", time: "11:45 PM" },
				{ name: "Hosur", time: "05:15 AM" },
				{ name: "Bangalore (Kaladipal)", time: "06:15 AM" },
			],
			sold_seats: ["A1", "B3", "C4", "E1"],
		},
		{
			id: "T-204",
			route_name: "Bangalore to Cochin",
			departure_time: "09:45 PM",
			departure_hour: 21.75,
			arrival_time: "07:30 AM",
			time_taken: "9h 45m",
			trip_distance_km: "530",
			fare: 1150,
			available_seats: 0,
			is_active: false,
			stops: [
				{ name: "Bangalore (Kaladipal)", time: "09:45 PM" },
				{ name: "Hosur", time: "10:35 PM" },
				{ name: "Palakkad", time: "04:00 AM" },
				{ name: "Thrissur Bypass", time: "05:30 AM" },
				{ name: "Aluva Bypass", time: "06:45 AM" },
				{ name: "Cochin (Vytila)", time: "07:30 AM" },
			],
			sold_seats: [
				"A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4",
				"C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4",
				"E1", "E2", "E3", "E4", "F1", "F2", "F3", "F4"
			],
		},
	];

	// Filter logic
	const filteredTrips = allTrips.filter((trip) => {
		// 1. Search Query filter (matches route name or stops name)
		const matchesSearch =
			trip.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			trip.stops.some((stop) =>
				stop.name.toLowerCase().includes(searchQuery.toLowerCase())
			);

		// 2. Time-of-day filter
		let matchesTime = true;
		if (activeTimeFilter === "morning") {
			// Morning: 6 AM to 12 PM
			matchesTime = trip.departure_hour >= 6 && trip.departure_hour < 12;
		} else if (activeTimeFilter === "afternoon") {
			// Afternoon: 12 PM to 6 PM
			matchesTime = trip.departure_hour >= 12 && trip.departure_hour < 18;
		} else if (activeTimeFilter === "evening") {
			// Evening: 6 PM to 6 AM (next day)
			matchesTime = trip.departure_hour >= 18 || trip.departure_hour < 6;
		}

		return matchesSearch && matchesTime;
	});

	const handleOpenBooking = (trip) => {
		if (trip.available_seats === 0) return;
		setBookingTrip(trip);
		setSelectedSeats([]);
		setBookingConfirmed(false);
	};

	const handleSelectSeat = (seatId) => {
		setSelectedSeats((prev) =>
			prev.includes(seatId)
				? prev.filter((s) => s !== seatId)
				: prev.length < 4
				? [...prev, seatId]
				: prev
		);
	};

	const handleConfirmBooking = () => {
		if (selectedSeats.length === 0) return;
		// Generate standard confirmation ref
		const code = Math.floor(100000 + Math.random() * 900000);
		setBookingRef(`YTR-${code}-${bookingTrip.id}`);
		setBookingConfirmed(true);
	};

	const renderSeatsGrid = () => {
		if (!bookingTrip) return null;
		const rows = ["A", "B", "C", "D", "E", "F"];
		const seatNumbers = [1, 2, 3, 4];

		return rows.map((row) => (
			<React.Fragment key={row}>
				{seatNumbers.map((num, idx) => {
					const seatId = `${row}${num}`;
					const isSold = bookingTrip.sold_seats.includes(seatId);
					const isSelected = selectedSeats.includes(seatId);

					return (
						<React.Fragment key={seatId}>
							{/* Insert spacer at index 2 to represent aisle between seats 2 and 3 */}
							{idx === 2 && <div className="seat-aisle-spacer text-muted small"></div>}
							<div className="bus-seat-wrapper">
								<button
									className={`bus-seat-btn ${isSelected ? "selected" : ""}`}
									disabled={isSold}
									onClick={() => handleSelectSeat(seatId)}
									title={isSold ? "Reserved" : `Seat ${seatId}`}
								>
									{seatId}
								</button>
							</div>
						</React.Fragment>
					);
				})}
			</React.Fragment>
		));
	};

	const busRawColor =
		activeBus.bus_color === "White" ? "#aeafb3" : activeBus.bus_color;

	return (
		<div className="trips-container section-fade">
			{/* 1. Header component displaying selected Bus Card Info */}
			<div className="trip-bus-header py-4 px-3 text-white rounded-bottom-4 shadow">
				<div className="trip-bus-header-glow"></div>
				<div className="d-flex align-items-center gap-3 mb-3">
					<button
						className="btn btn-back-light"
						onClick={onBack}
						aria-label="Go Back"
					>
						<i className="bi bi-arrow-left fs-5"></i>
					</button>
					<div>
						<h5 className="fw-bolder mb-0 fs-5">{activeBus.bus_name}</h5>
						<span className="opacity-75 small fw-semibold" style={{ letterSpacing: "0.5px" }}>
							{activeBus.bus_number}
						</span>
					</div>
				</div>

				{/* Bus summary specifications card */}
				<div className="d-flex align-items-center justify-content-between bg-white bg-opacity-10 rounded-4 p-3 border border-white border-opacity-10 backdrop-blur">
					<div className="d-flex align-items-center gap-3">
						<div
							className="rounded-3 d-flex align-items-center justify-content-center"
							style={{
								width: "48px",
								height: "48px",
								background: "rgba(255, 255, 255, 0.15)",
								border: "1px solid rgba(255, 255, 255, 0.2)",
							}}
						>
							<i className="bi bi-bus-front fs-4 text-white"></i>
						</div>
						<div>
							<h6 className="fw-bold text-white mb-0 fs-7">
								{activeBus.operator?.name || "KSRTC"}
							</h6>
							<small className="opacity-75 text-white-50 fw-semibold" style={{ fontSize: "0.68rem" }}>
								{activeBus.category} • {activeBus.operator?.type || "State"}
							</small>
						</div>
					</div>
					<div className="text-end">
						<span
							className="badge rounded-pill text-white border border-white border-opacity-20 px-3 py-1.5 fw-bold"
							style={{
								fontSize: "0.7rem",
								background: busRawColor || "#0d6efd",
							}}
						>
							{activeBus.category}
						</span>
					</div>
				</div>
			</div>

			<div className="dashboard-container px-3 mt-4">
				{/* 2. Interactive Search & Time Filters */}
				<div className="card glass-filter-card border-0 rounded-4 p-3 mb-4 shadow-sm">
					<div className="position-relative mb-3">
						<i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-75"></i>
						<input
							type="text"
							className="form-control form-control bg-light border-0 rounded-pill ps-5 shadow-none"
							placeholder="Search by destination or stops..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Time filter chips */}
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

				{/* 3. List of filtered trips */}
				<div className="d-flex flex-column gap-3 mb-4">
					<h6 className="fw-bold text-dark px-1 mb-1">
						Scheduled Trips ({filteredTrips.length})
					</h6>

					{filteredTrips.map((trip) => {
						const isExpanded = expandedTripId === trip.id;
						const isSoldOut = trip.available_seats === 0;

						return (
							<div
								key={trip.id}
								className="card trip-card border-0 shadow-sm position-relative bg-white"
							>
								{/* Left vertical theme band */}
								<div
									className="trip-card-indicator"
									style={{ background: isSoldOut ? "#6c757d" : busRawColor || "#0d6efd" }}
								></div>

								<div className="card-body p-3">
									{/* Top route metadata & badge */}
									<div className="d-flex justify-content-between align-items-center mb-3">
										<span className="badge bg-light text-secondary rounded-pill border px-2.5 py-1 text-uppercase fw-semibold" style={{ fontSize: "0.65rem" }}>
											ID: {trip.id}
										</span>
										<span
											className={`badge rounded-pill px-2.5 py-1 fw-bold ${
												isSoldOut
													? "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10"
													: trip.available_seats < 10
													? "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10"
													: "bg-success bg-opacity-10 text-success border border-success border-opacity-10"
											}`}
											style={{ fontSize: "0.68rem" }}
										>
											{isSoldOut ? "Sold Out" : `${trip.available_seats} Seats Left`}
										</span>
									</div>

									{/* Route timeline details */}
									<div className="row align-items-center mb-3">
										<div className="col-4 text-center">
											<span className="d-block fw-bold text-dark fs-6">
												{trip.departure_time}
											</span>
											<small className="text-muted d-block text-truncate fw-medium" style={{ fontSize: "0.72rem" }}>
												{trip.stops[0].name.split(" ")[0]}
											</small>
										</div>

										<div className="col-4">
											<div className="trip-duration-line-wrapper">
												<span className="text-muted small fw-bold mb-1" style={{ fontSize: "0.65rem" }}>
													{trip.time_taken}
												</span>
												<div className="trip-duration-line">
													<div className="trip-duration-dot start"></div>
													<div className="trip-duration-dot end"></div>
												</div>
												<span
													className="text-primary fw-semibold mt-1"
													style={{ fontSize: "0.68rem", cursor: "pointer" }}
													onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
												>
													{trip.stops.length} Stops <i className={`bi bi-chevron-${isExpanded ? "up" : "down"} ms-0.5`}></i>
												</span>
											</div>
										</div>

										<div className="col-4 text-center">
											<span className="d-block fw-bold text-dark fs-6">
												{trip.arrival_time}
											</span>
											<small className="text-muted d-block text-truncate fw-medium" style={{ fontSize: "0.72rem" }}>
												{trip.stops[trip.stops.length - 1].name.split(" ")[0]}
											</small>
										</div>
									</div>

									{/* Bottom metrics row */}
									<div className="d-flex align-items-center justify-content-between pt-2.5 border-top border-light mt-2">
										<div>
											<span className="text-muted small d-block" style={{ fontSize: "0.68rem" }}>
												Distance
											</span>
											<span className="fw-bold text-dark fs-7">
												{trip.trip_distance_km} Km
											</span>
										</div>

										<div>
											<span className="text-muted small d-block" style={{ fontSize: "0.68rem" }}>
												Ticket Fare
											</span>
											<span className="fw-extrabold text-primary fs-6">
												₹{trip.fare}
											</span>
										</div>

										{/* Interactive Actions */}
										<div className="d-flex gap-2">
											{trip.is_active && (
												<button
													className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold"
													onClick={() => onTrackBus && onTrackBus(activeBus, trip)}
													title="Track Live Bus Location"
												>
													<i className="bi bi-geo-alt-fill me-1"></i> Track
												</button>
											)}
											<button
												className={`btn btn-sm rounded-pill px-3 fw-bold ${
													isSoldOut ? "btn-light text-muted" : "btn-primary shadow-sm"
												}`}
												disabled={isSoldOut}
												onClick={() => handleOpenBooking(trip)}
											>
												Book
											</button>
										</div>
									</div>
								</div>

								{/* Expanded stop schedules timeline */}
								{isExpanded && (
									<div className="trip-stops-collapse px-4 py-3 border-top border-light">
										<h7 className="fw-bold text-dark d-block mb-3 fs-7">
											Stop Schedule Detail
										</h7>
										<div className="position-relative ps-2">
											{/* Timeline vertical line */}
											<div
												className="position-absolute bg-light-subtle"
												style={{
													width: "2px",
													top: "4px",
													bottom: "4px",
													left: "5px",
													background: "#e2e8f0",
												}}
											></div>

											{trip.stops.map((stop, idx) => (
												<div key={idx} className="position-relative d-flex justify-content-between mb-3 last-mb-0">
													<div
														className="rounded-circle position-absolute"
														style={{
															width: "8px",
															height: "8px",
															left: "2px",
															top: "5px",
															background:
																idx === 0
																	? "#0d6efd"
																	: idx === trip.stops.length - 1
																	? "#198754"
																	: "#cbd5e1",
															border: "1.5px solid white",
															boxShadow: "0 0 0 2px rgba(0,0,0,0.03)",
														}}
													></div>
													<div className="ps-4">
														<span className="fw-semibold text-dark fs-7 d-block">
															{stop.name}
														</span>
													</div>
													<div className="text-end">
														<span className="text-muted small fw-semibold">
															{stop.time}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						);
					})}

					{filteredTrips.length === 0 && (
						<div className="text-center py-5 card border-0 rounded-4 shadow-sm bg-white p-4">
							<i className="bi bi-calendar-x text-muted fs-1 mb-2"></i>
							<h6 className="fw-bold text-secondary">No Schedule Found</h6>
							<p className="text-muted small mb-0">
								Try refining your search terms or selecting another shift
							</p>
						</div>
					)}
				</div>
			</div>

			{/* 4. Interactive Seat Booking & Ticket Modal overlay */}
			{bookingTrip && (
				<div className="seat-booking-modal-overlay">
					<div className="seat-booking-modal-content">
						<div className="modal-header-section d-flex align-items-center justify-content-between">
							<div>
								<h6 className="fw-bold text-dark mb-0">
									{bookingConfirmed ? "Ticket Confirmed" : "Choose Your Seats"}
								</h6>
								<small className="text-muted" style={{ fontSize: "0.72rem" }}>
									{bookingTrip.route_name}
								</small>
							</div>
							<button
								className="btn border-0 p-1.5 rounded-circle bg-light"
								onClick={() => setBookingTrip(null)}
								aria-label="Close modal"
							>
								<i className="bi bi-x-lg text-dark small"></i>
							</button>
						</div>

						<div className="modal-body-scrollable">
							{!bookingConfirmed ? (
								<>
									{/* Cabin Layout */}
									<div className="bus-cabin-layout mb-4">
										{/* Cabin Front Wheel & Dashboard */}
										<div className="bus-cabin-front d-flex align-items-center justify-content-between px-2">
											<small className="text-muted fw-bold uppercase" style={{ letterSpacing: "1px", fontSize: "0.65rem" }}>
												Driver Cabin
											</small>
											<div className="steering-wheel-icon">
												<i className="bi bi-compass"></i>
											</div>
										</div>

										{/* Cabin Seats Grid */}
										<div className="seat-grid">{renderSeatsGrid()}</div>
									</div>

									{/* Legend */}
									<div className="d-flex align-items-center justify-content-around bg-light py-2 px-3 rounded-3 mb-4">
										<div className="d-flex align-items-center gap-1.5">
											<span className="legend-dot available"></span>
											<span className="text-muted small" style={{ fontSize: "0.7rem" }}>
												Available
											</span>
										</div>
										<div className="d-flex align-items-center gap-1.5">
											<span className="legend-dot selected"></span>
											<span className="text-muted small" style={{ fontSize: "0.7rem" }}>
												Selected
											</span>
										</div>
										<div className="d-flex align-items-center gap-1.5">
											<span className="legend-dot sold"></span>
											<span className="text-muted small" style={{ fontSize: "0.7rem" }}>
												Reserved
											</span>
										</div>
									</div>

									{/* Summary & Proceed */}
									<div className="card border-0 bg-light p-3 rounded-4 mb-2">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<span className="text-muted small">Selected Seats</span>
											<span className="fw-bold text-dark fs-7">
												{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
											</span>
										</div>
										<div className="d-flex justify-content-between align-items-center mb-3">
											<span className="text-muted small">Total Fare</span>
											<span className="fw-extrabold text-primary fs-5">
												₹{selectedSeats.length * bookingTrip.fare}
											</span>
										</div>
										<button
											className="btn btn-primary rounded-pill w-100 py-2.5 fw-bold shadow-sm"
											disabled={selectedSeats.length === 0}
											onClick={handleConfirmBooking}
										>
											Confirm Booking (₹{selectedSeats.length * bookingTrip.fare})
										</button>
									</div>
								</>
							) : (
								/* Confirmation Ticket Stub Display */
								<div className="ticket-wrapper my-2">
									<div className="ticket-top">
										<div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-white text-success mb-2" style={{ width: "36px", height: "36px" }}>
											<i className="bi bi-check-lg fs-5"></i>
										</div>
										<h5 className="fw-bolder mb-0 fs-6">Booking Successful!</h5>
										<span className="opacity-75 small text-white-50" style={{ fontSize: "0.68rem" }}>
											Ref: {bookingRef}
										</span>
									</div>

									<div className="ticket-divider">
										<div className="ticket-notch left"></div>
										<div className="ticket-divider-line"></div>
										<div className="ticket-notch right"></div>
									</div>

									<div className="ticket-body">
										<div className="row g-2 mb-3">
											<div className="col-6">
												<span className="text-muted small d-block" style={{ fontSize: "0.65rem" }}>
													BUS SERVICE
												</span>
												<span className="fw-bold text-dark fs-7">
													{activeBus.bus_name}
												</span>
											</div>
											<div className="col-6">
												<span className="text-muted small d-block" style={{ fontSize: "0.65rem" }}>
													VEHICLE NO.
												</span>
												<span className="fw-bold text-dark fs-7">
													{activeBus.bus_number}
												</span>
											</div>
										</div>

										<div className="row g-2 mb-3">
											<div className="col-6">
												<span className="text-muted small d-block" style={{ fontSize: "0.65rem" }}>
													DEPARTURE
												</span>
												<span className="fw-bold text-dark fs-7">
													{bookingTrip.departure_time}
												</span>
											</div>
											<div className="col-6">
												<span className="text-muted small d-block" style={{ fontSize: "0.65rem" }}>
													SEATS BOOKED
												</span>
												<span className="fw-bold text-success fs-7">
													{selectedSeats.join(", ")}
												</span>
											</div>
										</div>

										<div className="bg-light p-2.5 rounded-3 d-flex justify-content-between align-items-center mb-4">
											<div>
												<span className="text-muted small d-block" style={{ fontSize: "0.62rem" }}>
													TRANSACTION TOTAL
												</span>
												<span className="fw-extrabold text-dark fs-6">
													₹{selectedSeats.length * bookingTrip.fare}
												</span>
											</div>
											<span className="badge bg-success-subtle text-success rounded-pill px-2.5 border">
												PAID
											</span>
										</div>

										{/* Barcode representation */}
										<div className="d-flex flex-column align-items-center gap-1.5">
											<div className="barcode-mock"></div>
											<span className="text-muted small font-monospace" style={{ fontSize: "0.6rem" }}>
												*{bookingRef.replaceAll("-", "")}*
											</span>
										</div>

										<button
											className="btn btn-outline-secondary rounded-pill w-100 mt-4 py-2 fw-semibold"
											onClick={() => setBookingTrip(null)}
										>
											Close window
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BusTripsSection;
