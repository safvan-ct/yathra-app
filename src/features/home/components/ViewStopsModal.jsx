import React from "react";

const ViewStopsModal = ({
	bus,
	isOpen,
	onClose,
	onTrackBus,
	fromStationName,
	toStationName,
}) => {
	if (!isOpen || !bus) return null;

	const busName = bus.bus_name || "Bus Details";
	const busNumber = bus.bus_number || "XX-0000";
	const formatDuration = (timeStr, durationMinutes) => {
		if (durationMinutes !== undefined && durationMinutes !== null && !isNaN(durationMinutes) && durationMinutes !== "") {
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
		if (val === undefined || val === null || val === "" || isNaN(val)) return "";
		const num = parseFloat(val);
		if (isNaN(num)) return "";
		if (Number.isInteger(num) || num % 1 === 0) {
			return `${Math.round(num)} km`;
		}
		const formatted = parseFloat(num.toFixed(2));
		return `${formatted} km`;
	};

	const duration = formatDuration(bus.time_taken, bus.duration_minutes);
	const distance = formatDistance(bus.trip_distance_km);
	const departure = bus.departure_time || "01:35 PM";
	const arrival = bus.arrival_time || "02:21 PM";
	const fare = bus.fare ?? bus.ticket_price ?? bus.price ?? bus.ticketPrice ?? "25";

	const cleanStationName = (name) => {
		if (!name) return "";
		return name.replace(/\s*\([^)]*\)/g, "").trim();
	};

	const origin = cleanStationName(fromStationName || bus.from_station || "Origin");
	const destination = cleanStationName(toStationName || bus.to_station || "Destination");

	const stopsList =
		bus.stops && bus.stops.length > 0
			? bus.stops
			: [
					{
						name: origin,
						time: departure,
						distance: "0 km",
						fare: fare ? `₹${fare}` : "",
						isOrigin: true,
					},
					{
						name: destination,
						time: arrival,
						distance: distance || "",
						fare: fare ? `₹${fare}` : "",
						isDest: true,
					},
				];

	return (
		<div
			className="modal-backdrop-custom d-flex align-items-end align-items-md-center justify-content-center"
			onClick={onClose}
		>
			<div
				className="stops-modal-sheet bg-white rounded-top-4 rounded-md-4 shadow-lg p-4 w-100"
				style={{ maxWidth: "520px", maxHeight: "88vh", overflowY: "auto" }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal Header */}
				<div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
					<div className="d-flex align-items-center gap-3">
						<div
							className="rounded-3 d-flex align-items-center justify-content-center text-primary"
							style={{
								width: "42px",
								height: "42px",
								background: "rgba(13, 110, 253, 0.1)",
							}}
						>
							<i className="bi bi-bus-front fs-4"></i>
						</div>
						<div>
							<h5 className="fw-bold mb-0 text-dark">{busName}</h5>
							<small className="text-muted fw-semibold">
								{busNumber} {duration ? `• ${duration}` : ""} {distance ? `(${distance})` : ""}
							</small>
						</div>
					</div>
					<button
						type="button"
						className="btn-close shadow-none p-2"
						onClick={onClose}
						aria-label="Close"
					></button>
				</div>

				{/* Trip Summary Pill */}
				<div className="bg-light rounded-3 p-3 mb-4 d-flex justify-content-between align-items-center">
					<div>
						<span className="text-muted small d-block">Departure</span>
						<strong className="text-primary fs-6">{departure}</strong>
						<div
							className="small text-secondary text-truncate"
							style={{ maxWidth: "130px" }}
						>
							{origin}
						</div>
					</div>
					<div className="text-center px-2">
						<i className="bi bi-arrow-right fs-4 text-muted opacity-50"></i>
						<span className="badge bg-white text-dark border px-2 py-1 shadow-sm d-block mt-1">
							₹{fare}
						</span>
					</div>
					<div className="text-end">
						<span className="text-muted small d-block">Arrival</span>
						<strong className="text-success fs-6">{arrival}</strong>
						<div
							className="small text-secondary text-truncate"
							style={{ maxWidth: "130px" }}
						>
							{destination}
						</div>
					</div>
				</div>

				{/* Timeline of Stops */}
				<h6 className="fw-bold text-dark mb-3">
					<i className="bi bi-geo-alt-fill text-primary me-2"></i>
					Route Stops & Scheduled Timings
				</h6>

				<div className="stops-timeline position-relative ps-4 mb-4">
					<div
						className="position-absolute bg-primary bg-opacity-25"
						style={{ left: "11px", top: "12px", bottom: "12px", width: "2px" }}
					></div>

					{stopsList.map((st, i) => {
						const isFirst = i === 0;
						const isLast = i === stopsList.length - 1;
						return (
							<div
								key={i}
								className="position-relative mb-3 d-flex justify-content-between align-items-center"
							>
								{/* Dot indicator */}
								<div
									className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
									style={{
										left: "-28px",
										top: "50%",
										transform: "translateY(-50%)",
										width: isFirst || isLast ? "16px" : "12px",
										height: isFirst || isLast ? "16px" : "12px",
										backgroundColor: isFirst
											? "#0d6efd"
											: isLast
												? "#198754"
												: st.passed
													? "#0d6efd"
													: "#cbd5e1",
										border: "2px solid #fff",
										boxShadow: "0 0 0 2px rgba(0,0,0,0.05)",
									}}
								></div>

								<div>
									<span
										className={`d-block ${isFirst || isLast ? "fw-bold text-dark" : "text-secondary fw-medium"}`}
									>
										{st.name}
									</span>
									<small className="text-muted">{st.distance}</small>
								</div>

								<div className="text-end">
									<span className="badge bg-light text-dark border px-2 py-1 fw-bold">
										{st.time}
									</span>
								</div>
							</div>
						);
					})}
				</div>

				{/* Actions */}
				<div className="d-flex gap-2 pt-2">
					<button
						className="btn btn-primary flex-grow-1 fw-bold py-2 rounded-3 shadow-sm"
						onClick={() => {
							onClose();
							if (onTrackBus) onTrackBus(bus);
						}}
					>
						<i className="bi bi-broadcast me-2"></i>
						Live Track Bus
					</button>
					<button
						className="btn btn-outline-secondary px-3 py-2 rounded-3 fw-semibold"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ViewStopsModal;
