import React, { useState, useEffect } from "react";
import SponsoredAdCard from "../../home/components/SponsoredAdCard";
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
	const activeBus =
		bus && bus.bus_name
			? bus
			: {
					id: bus?.id || 1,
					bus_name: bus?.bus_name || `Yathra Premium ${bus?.id || ""}`,
					bus_number:
						bus?.bus_number || `KL-07-Y-${1000 + parseInt(bus?.id || 1)}`,
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
			sold_seats: [
				"A1",
				"A3",
				"A4",
				"B1",
				"B2",
				"B4",
				"C1",
				"C2",
				"C3",
				"D2",
				"D3",
				"E1",
				"E4",
				"F1",
				"F2",
			],
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
				"A1",
				"A2",
				"A3",
				"A4",
				"B1",
				"B2",
				"B3",
				"B4",
				"C1",
				"C2",
				"C3",
				"C4",
				"D1",
				"D2",
				"D3",
				"D4",
				"E1",
				"E2",
				"E3",
				"E4",
				"F1",
				"F2",
				"F3",
				"F4",
			],
		},
	];

	// Filter logic
	const filteredTrips = allTrips.filter((trip) => {
		// 1. Search Query filter (matches route name or stops name)
		const matchesSearch =
			trip.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			trip.stops.some((stop) =>
				stop.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
					: prev,
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
							{idx === 2 && (
								<div className="seat-aisle-spacer text-muted small"></div>
							)}
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
			<div className="trip-bus-header py-2 px-3 text-white">
				<div className="d-flex align-items-center justify-content-between">
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
								{activeBus.bus_name}
							</h6>
							<span
								className="opacity-75 small fw-semibold"
								style={{ fontSize: "0.68rem", letterSpacing: "0.3px" }}
							>
								{activeBus.bus_number} • {activeBus.operator?.name || "KSRTC"}
							</span>
						</div>
					</div>
					{activeBus.category && (
						<span
							className="badge rounded-pill bg-white bg-opacity-20 text-success border border-white border-opacity-25 px-2 py-1 fw-semibold"
							style={{ fontSize: "0.68rem" }}
						>
							{activeBus.category}
						</span>
					)}
				</div>
			</div>

			<div className="dashboard-container px-1 px-sm-3 mt-1">
				{/* 3. List of filtered trips */}
				<div className="d-flex flex-column gap-1 mb-1">
					<h6 className="fw-bold text-dark pt-2 px-1 mb-1">
						Scheduled Trips ({filteredTrips.length})
					</h6>

					{filteredTrips.map((trip, idx) => {
						const isExpanded = expandedTripId === trip.id;
						const isSoldOut = trip.available_seats === 0;
						const originStop = trip.stops?.[0]?.name || "Origin";
						const destStop =
							trip.stops?.[trip.stops.length - 1]?.name || "Destination";
						const elements = [];

						elements.push(
							<div
								key={trip.id}
								className="card border-0 rounded-5 shadow-sm yathra-bus-card bg-white position-relative mb-1"
							>
								<div className="card-body p-2 px-3">
									{/* Top Header: Brand/Bus icon + Route Name + Status Badge */}
									<div className="card-top-row d-flex align-items-center justify-content-between mb-1">
										<div className="d-flex align-items-center gap-2">
											<div
												className="bus-brand-icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
												style={{
													backgroundColor: "rgba(13, 110, 253, 0.1)",
													color: busRawColor || "#0d6efd",
												}}
											>
												<i className="bi bi-bus-front"></i>
											</div>
											<div>
												<h6 className="fw-bold mb-0 text-dark bus-title-text">
													{trip.route_name || activeBus.bus_name}
												</h6>
												<div className="bus-reg-text text-muted">
													{activeBus.bus_number} • ID: {trip.id}
												</div>
											</div>
										</div>

										{/* Status Badge */}
										<div className="d-flex align-items-center gap-1">
											{isSoldOut ? (
												<span className="status-badge badge rounded-pill px-2 py-1 bg-secondary bg-opacity-10 text-secondary border">
													● Sold Out
												</span>
											) : trip.available_seats < 10 ? (
												<span className="status-badge badge rounded-pill px-2 py-1 bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
													● {trip.available_seats} Seats Left
												</span>
											) : (
												<span className="status-badge badge rounded-pill px-2 py-1 bg-success bg-opacity-10 text-success border border-success border-opacity-25">
													● Available
												</span>
											)}
										</div>
									</div>

									{/* Middle Timings & Journey Route Line */}
									<div className="journey-timings-row d-flex align-items-center justify-content-between my-2">
										{/* Departure */}
										<div className="timing-col start-col text-start">
											<span className="d-block fw-bold departure-time-text">
												{trip.departure_time}
											</span>
											<span className="station-sub-text d-block text-truncate">
												{originStop}
											</span>
										</div>

										{/* Connecting Journey Line with Center Bus Marker */}
										<div className="journey-track-col flex-grow-1 px-2 d-flex align-items-center justify-content-center">
											<div className="journey-dot origin-dot"></div>
											<div className="journey-track-line"></div>
											<div
												className="journey-bus-marker mx-1"
												style={{ color: busRawColor || "#0d6efd" }}
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
												{trip.arrival_time}
											</span>
											<span className="station-sub-text d-block text-truncate">
												{destStop}
											</span>
										</div>
									</div>

									{/* Bottom Metadata & Action Buttons */}
									<div className="card-footer-meta d-flex align-items-center justify-content-between pt-2 border-top border-light-subtle">
										<div
											className="d-flex align-items-center gap-2 text-secondary flex-wrap"
											style={{ fontSize: "11px" }}
										>
											{trip.time_taken && (
												<span className="d-flex align-items-center gap-1">
													<i className="bi bi-clock"></i>
													{trip.time_taken}
												</span>
											)}
											{trip.time_taken && trip.trip_distance_km && (
												<span className="meta-divider text-muted opacity-50">
													|
												</span>
											)}
											{trip.trip_distance_km && (
												<span className="d-flex align-items-center gap-1">
													<i className="bi bi-signpost-2"></i>
													{trip.trip_distance_km} km
												</span>
											)}
											{(trip.trip_distance_km || trip.time_taken) &&
												trip.fare && (
													<span className="meta-divider text-muted opacity-50">
														|
													</span>
												)}
											{trip.fare && (
												<span
													className="d-flex align-items-center gap-1 fw-bold"
													style={{ color: "#0d6efd" }}
												>
													₹{trip.fare}
												</span>
											)}
										</div>

										{/* Action Buttons */}
										<div className="d-flex align-items-center gap-1">
											{trip.stops?.length > 0 && (
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
														onTrackBus && onTrackBus(activeBus, trip);
													}}
												>
													{trip.stops.length} Stops{" "}
													<i className={`bi bi-chevron-right`}></i>
												</button>
											)}
											<button
												type="button"
												className={`btn btn-sm rounded-pill px-2.5 py-0.5 fw-bold ${
													isSoldOut
														? "btn-light text-muted"
														: "btn-primary shadow-sm"
												}`}
												style={{ fontSize: "11px", lineHeight: 1.2 }}
												disabled={isSoldOut}
												onClick={(e) => {
													e.stopPropagation();
													handleOpenBooking(trip);
												}}
											>
												Book
											</button>
										</div>
									</div>
								</div>

								{/* Expanded stop schedules timeline */}
								{isExpanded && (
									<div className="trip-stops-collapse px-4 py-3 border-top border-light">
										<h6
											className="fw-bold text-dark d-block mb-3"
											style={{ fontSize: "0.78rem" }}
										>
											Stop Schedule Detail
										</h6>
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

											{trip.stops.map((stop, sIdx) => (
												<div
													key={sIdx}
													className="position-relative d-flex justify-content-between mb-3 last-mb-0"
												>
													<div
														className="rounded-circle position-absolute"
														style={{
															width: "8px",
															height: "8px",
															left: "2px",
															top: "5px",
															background:
																sIdx === 0
																	? "#0d6efd"
																	: sIdx === trip.stops.length - 1
																		? "#198754"
																		: "#cbd5e1",
															border: "1.5px solid white",
															boxShadow: "0 0 0 2px rgba(0,0,0,0.03)",
														}}
													></div>
													<div className="ps-4">
														<span
															className="fw-semibold text-dark d-block"
															style={{ fontSize: "0.75rem" }}
														>
															{stop.name}
														</span>
													</div>
													<div className="text-end">
														<span
															className="text-muted small fw-semibold"
															style={{ fontSize: "0.72rem" }}
														>
															{stop.time}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>,
						);

						// Insert Sponsored Ad Banner after every 2 trip cards like home ad card
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
											<small
												className="text-muted fw-bold uppercase"
												style={{ letterSpacing: "1px", fontSize: "0.65rem" }}
											>
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
											<span
												className="text-muted small"
												style={{ fontSize: "0.7rem" }}
											>
												Available
											</span>
										</div>
										<div className="d-flex align-items-center gap-1.5">
											<span className="legend-dot selected"></span>
											<span
												className="text-muted small"
												style={{ fontSize: "0.7rem" }}
											>
												Selected
											</span>
										</div>
										<div className="d-flex align-items-center gap-1.5">
											<span className="legend-dot sold"></span>
											<span
												className="text-muted small"
												style={{ fontSize: "0.7rem" }}
											>
												Reserved
											</span>
										</div>
									</div>

									{/* Summary & Proceed */}
									<div className="card border-0 bg-light p-3 rounded-4 mb-5">
										<div className="d-flex justify-content-between align-items-center mb-2">
											<span className="text-muted small">Selected Seats</span>
											<span className="fw-bold text-dark fs-7">
												{selectedSeats.length > 0
													? selectedSeats.join(", ")
													: "None"}
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
											Confirm Booking (₹
											{selectedSeats.length * bookingTrip.fare})
										</button>
									</div>
								</>
							) : (
								/* Confirmation Ticket Stub Display */
								<div className="ticket-wrapper mb-5">
									<div className="ticket-top">
										<div
											className="rounded-circle d-inline-flex align-items-center justify-content-center bg-white text-success mb-2"
											style={{ width: "36px", height: "36px" }}
										>
											<i className="bi bi-check-lg fs-5"></i>
										</div>
										<h5 className="fw-bolder mb-0 fs-6">Booking Successful!</h5>
										<span
											className="opacity-75 small text-white-50"
											style={{ fontSize: "0.68rem" }}
										>
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
												<span
													className="text-muted small d-block"
													style={{ fontSize: "0.65rem" }}
												>
													BUS SERVICE
												</span>
												<span className="fw-bold text-dark fs-7">
													{activeBus.bus_name}
												</span>
											</div>
											<div className="col-6">
												<span
													className="text-muted small d-block"
													style={{ fontSize: "0.65rem" }}
												>
													VEHICLE NO.
												</span>
												<span className="fw-bold text-dark fs-7">
													{activeBus.bus_number}
												</span>
											</div>
										</div>

										<div className="row g-2 mb-3">
											<div className="col-6">
												<span
													className="text-muted small d-block"
													style={{ fontSize: "0.65rem" }}
												>
													DEPARTURE
												</span>
												<span className="fw-bold text-dark fs-7">
													{bookingTrip.departure_time}
												</span>
											</div>
											<div className="col-6">
												<span
													className="text-muted small d-block"
													style={{ fontSize: "0.65rem" }}
												>
													SEATS BOOKED
												</span>
												<span className="fw-bold text-success fs-7">
													{selectedSeats.join(", ")}
												</span>
											</div>
										</div>

										<div className="bg-light p-2.5 rounded-3 d-flex justify-content-between align-items-center mb-4">
											<div>
												<span
													className="text-muted small d-block"
													style={{ fontSize: "0.62rem" }}
												>
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
											<span
												className="text-muted small font-monospace"
												style={{ fontSize: "0.6rem" }}
											>
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
