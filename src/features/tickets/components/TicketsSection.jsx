import React, { useState } from "react";

const TicketsSection = ({ setActiveSection }) => {
	const [activeTab, setActiveTab] = useState("active");

	const mockTickets = [
		{
			id: "TKT-890214",
			from: "Ernakulam (Kochi)",
			to: "Trivandrum (Tampanoor)",
			busName: "KSRTC Swift Super Fast",
			busNumber: "KL-15-A-4830",
			date: "Today, 13 Jul 2026",
			departureTime: "18:30",
			seat: "14, 15",
			passenger: "Safvan & Companion",
			fare: "₹380.00",
			status: "active",
		},
		{
			id: "TKT-562104",
			from: "Kozhikode",
			to: "Ernakulam (Kochi)",
			busName: "Yathra Air Deluxe",
			busNumber: "KL-11-Q-9921",
			date: "08 Jul 2026",
			departureTime: "09:15",
			seat: "08",
			passenger: "Safvan",
			fare: "₹240.00",
			status: "completed",
		},
	];

	const filteredTickets = mockTickets.filter((t) => t.status === activeTab);

	const handleBookNew = () => {
		if (setActiveSection) {
			setActiveSection("home");
		}
	};

	return (
		<div id="section-tickets" className="app-section active section-fade">
			<div className="dashboard-container py-3 mb-5">
				{/* Header */}
				<div className="text-center mb-4">
					<h3 className="fw-bold text-dark">My Tickets</h3>
					<p className="text-muted small">
						Manage your active and completed trip bookings
					</p>
				</div>

				{/* Navigation Tabs */}
				<div className="d-flex bg-white p-1 rounded-4 shadow-sm mb-4">
					<button
						className={`btn flex-fill rounded-3 py-2 fw-semibold border-0 ${
							activeTab === "active" ? "bg-primary text-white" : "text-muted"
						}`}
						onClick={() => setActiveTab("active")}
						style={{ transition: "all 0.2s" }}
					>
						Active
					</button>
					<button
						className={`btn flex-fill rounded-3 py-2 fw-semibold border-0 ${
							activeTab === "completed" ? "bg-primary text-white" : "text-muted"
						}`}
						onClick={() => setActiveTab("completed")}
						style={{ transition: "all 0.2s" }}
					>
						Completed
					</button>
				</div>

				{/* Ticket List */}
				<div className="d-flex flex-column gap-4">
					{filteredTickets.length > 0 ? (
						filteredTickets.map((t) => (
							<div
								key={t.id}
								className="ticket-card-container position-relative"
							>
								{/* Premium Perforated CSS Ticket Card */}
								<div
									className="card border-0 rounded-4 shadow-sm overflow-hidden"
									style={{
										background: "white",
										borderLeft:
											activeTab === "active"
												? "5px solid #0d6efd"
												: "5px solid #198754",
									}}
								>
									{/* Top section */}
									<div className="p-4 border-bottom border-dashed position-relative">
										{/* Side circular notches for classic ticket feel */}
										<div
											style={{
												position: "absolute",
												bottom: "-10px",
												left: "-10px",
												width: "20px",
												height: "20px",
												borderRadius: "50%",
												background: "#f0f2f5",
											}}
										></div>
										<div
											style={{
												position: "absolute",
												bottom: "-10px",
												right: "-10px",
												width: "20px",
												height: "20px",
												borderRadius: "50%",
												background: "#f0f2f5",
											}}
										></div>

										<div className="d-flex justify-content-between align-items-center mb-3">
											<div>
												<span className="badge bg-light text-primary border rounded-pill px-2.5 py-1 text-uppercase fw-bold small">
													{t.id}
												</span>
											</div>
											<div className="text-end">
												<span
													className={`badge rounded-pill px-3 py-1 fw-semibold text-capitalize ${
														t.status === "active"
															? "bg-primary-subtle text-primary"
															: "bg-success-subtle text-success"
													}`}
												>
													{t.status}
												</span>
											</div>
										</div>

										<div className="d-flex justify-content-between align-items-center mb-2">
											<h5 className="fw-bold text-dark mb-0 fs-6">{t.from}</h5>
											<div className="d-flex align-items-center gap-1 flex-grow-1 mx-3">
												<div
													className="border-bottom border-secondary border-dashed w-100"
													style={{ height: "1px" }}
												></div>
												<i className="bi bi-bus-front text-primary"></i>
												<div
													className="border-bottom border-secondary border-dashed w-100"
													style={{ height: "1px" }}
												></div>
											</div>
											<h5 className="fw-bold text-dark mb-0 fs-6 text-end">
												{t.to}
											</h5>
										</div>

										<div className="d-flex justify-content-between text-muted small">
											<span>Origin</span>
											<span>Destination</span>
										</div>
									</div>

									{/* Bottom section */}
									<div className="p-4 bg-light bg-opacity-50">
										<div className="row g-3 mb-3">
											<div className="col-6">
												<small
													className="text-muted d-block uppercase fw-bold"
													style={{
														fontSize: "0.65rem",
														letterSpacing: "0.5px",
													}}
												>
													Bus
												</small>
												<span className="fw-semibold text-dark fs-7">
													{t.busName}
												</span>
												<small
													className="text-muted d-block"
													style={{ fontSize: "0.7rem" }}
												>
													{t.busNumber}
												</small>
											</div>
											<div className="col-6">
												<small
													className="text-muted d-block uppercase fw-bold"
													style={{
														fontSize: "0.65rem",
														letterSpacing: "0.5px",
													}}
												>
													Date & Time
												</small>
												<span className="fw-semibold text-dark fs-7">
													{t.date}
												</span>
												<small
													className="text-primary d-block fw-bold"
													style={{ fontSize: "0.7rem" }}
												>
													Dep: {t.departureTime}
												</small>
											</div>
											<div className="col-6">
												<small
													className="text-muted d-block uppercase fw-bold"
													style={{
														fontSize: "0.65rem",
														letterSpacing: "0.5px",
													}}
												>
													Passenger
												</small>
												<span className="fw-semibold text-dark fs-7">
													{t.passenger}
												</span>
												<small
													className="text-muted d-block"
													style={{ fontSize: "0.7rem" }}
												>
													Seats: {t.seat}
												</small>
											</div>
											<div className="col-6">
												<small
													className="text-muted d-block uppercase fw-bold"
													style={{
														fontSize: "0.65rem",
														letterSpacing: "0.5px",
													}}
												>
													Fare Paid
												</small>
												<span className="fw-bold text-dark fs-6">{t.fare}</span>
											</div>
										</div>

										{/* Interactive Premium QR Code area */}
										{t.status === "active" && (
											<div className="bg-white rounded-3 p-3 border d-flex align-items-center gap-3">
												{/* SVG Mock QR Code */}
												<svg
													width="60"
													height="60"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													className="text-dark"
												>
													<rect x="2" y="2" width="6" height="6" />
													<rect x="2" y="16" width="6" height="6" />
													<rect x="16" y="2" width="6" height="6" />
													<rect
														x="18"
														y="18"
														width="4"
														height="4"
														fill="currentColor"
													/>
													<rect
														x="14"
														y="14"
														width="2"
														height="2"
														fill="currentColor"
													/>
													<path d="M10 2h4M14 6h2M10 10h4M14 14h2M18 10h4M10 14h4M10 18h4M2 10h4M16 10h2M16 16h2" />
												</svg>
												<div>
													<span className="d-block fw-bold text-dark small">
														Digital Boarding Pass
													</span>
													<small
														className="text-muted d-block"
														style={{ fontSize: "0.75rem" }}
													>
														Scan QR code at the bus entry gate
													</small>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-5 card border-0 rounded-4 shadow-sm bg-white p-4">
							<i className="bi bi-ticket-perforated text-muted fs-1 mb-2"></i>
							<h6 className="fw-bold text-secondary">No Tickets Found</h6>
							<p className="text-muted small mb-3">
								You don't have any {activeTab} tickets right now.
							</p>
							<button
								className="btn btn-primary rounded-pill px-4 py-2 small"
								onClick={handleBookNew}
							>
								Book Ticket Now
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TicketsSection;
