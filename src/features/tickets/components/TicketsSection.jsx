import React, { useState } from "react";
import { useAuth } from "../../../shared/context/AuthContext";

const TicketsSection = ({ setActiveSection }) => {
	const { token } = useAuth();
	
	const [activeTab, setActiveTab] = useState("active");
	const [email, setEmail] = useState(() => {
		return localStorage.getItem("yathra_subscribed_email") || "";
	});
	const [subscribed, setSubscribed] = useState(() => {
		return !!localStorage.getItem("yathra_subscribed_email");
	});
	const [showPreview, setShowPreview] = useState(false);

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

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (email.trim() && email.includes("@")) {
			setSubscribed(true);
			localStorage.setItem("yathra_subscribed_email", email);
		}
	};

	// Show Coming Soon page if user is NOT logged in AND not explicitly previewing the interface
	if (!token && !showPreview) {
		return (
			<div id="section-tickets" className="app-section active section-fade">
				<div className="dashboard-container py-4 mb-5">
					<div className="card border-0 rounded-4 shadow-sm overflow-hidden bg-white p-4 p-md-5 text-center position-relative">
						{/* Background decorative glowing circles */}
						<div className="position-absolute" style={{
							top: "-20%", left: "-10%", width: "200px", height: "200px",
							background: "radial-gradient(circle, rgba(13,110,253,0.15) 0%, rgba(255,255,255,0) 70%)",
							zIndex: 0, pointerEvents: "none"
						}}></div>
						<div className="position-absolute" style={{
							bottom: "-20%", right: "-10%", width: "200px", height: "200px",
							background: "radial-gradient(circle, rgba(25,135,84,0.1) 0%, rgba(255,255,255,0) 70%)",
							zIndex: 0, pointerEvents: "none"
						}}></div>

						<div className="position-relative" style={{ zIndex: 1 }}>
							{/* Ticket Glowing Icon Container */}
							<div className="d-inline-flex align-items-center justify-content-center mb-4 position-relative" style={{
								width: "90px", height: "90px", borderRadius: "24px",
								background: "linear-gradient(135deg, rgba(13,110,253,0.1) 0%, rgba(13,110,253,0.2) 100%)",
								border: "1px solid rgba(13,110,253,0.2)",
								boxShadow: "0 10px 20px rgba(13,110,253,0.05)"
							}}>
								<i className="bi bi-ticket-perforated text-primary fs-1 animate-bounce"></i>
								<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: "0.75rem", padding: "0.4em 0.6em" }}>
									Coming Soon
								</span>
							</div>

							<h2 className="fw-bold text-dark mb-2">Online Ticket Booking</h2>
							<p className="text-muted mx-auto mb-4" style={{ maxWidth: "500px" }}>
								Skip the long queues at the bus station! Soon you'll be able to purchase, manage, and display all your tickets directly inside Yathra.
							</p>

							{/* Features Grid */}
							<div className="row g-3 justify-content-center text-start mb-5">
								<div className="col-12 col-md-5">
									<div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border border-light shadow-xs h-100">
										<div className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px", flexShrink: 0 }}>
											<i className="bi bi-lightning-charge-fill fs-5"></i>
										</div>
										<div>
											<h6 className="fw-bold mb-1">Instant Seat Booking</h6>
											<small className="text-muted">Choose your preferred seat from interactive layouts instantly.</small>
										</div>
									</div>
								</div>
								<div className="col-12 col-md-5">
									<div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border border-light shadow-xs h-100">
										<div className="bg-success-subtle text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px", flexShrink: 0 }}>
											<i className="bi bi-qr-code-scan fs-5"></i>
										</div>
										<div>
											<h6 className="fw-bold mb-1">Digital Boarding Passes</h6>
											<small className="text-muted">Generate secure QR codes for boarding, available even offline.</small>
										</div>
									</div>
								</div>
							</div>

							{/* Notify Me Form */}
							<div className="bg-light p-4 rounded-4 border border-light mx-auto mb-4 shadow-sm" style={{ maxWidth: "480px" }}>
								{subscribed ? (
									<div className="py-2 text-center">
										<div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3 animate-pulse" style={{ width: "50px", height: "50px" }}>
											<i className="bi bi-check-lg fs-3"></i>
										</div>
										<h5 className="fw-bold text-success mb-1">You're on the list!</h5>
										<p className="text-muted small mb-0">We will notify you at <strong className="text-dark">{email}</strong> as soon as ticket bookings go live.</p>
									</div>
								) : (
									<form onSubmit={handleSubscribe}>
										<h6 className="fw-bold text-dark mb-2 text-center text-md-start">Get Notified on Launch</h6>
										<p className="text-muted small mb-3 text-center text-md-start">Be the first to know when tickets become available in your area.</p>
										<div className="input-group">
											<input
												type="email"
												className="form-control border-end-0 bg-white"
												placeholder="Enter your email address"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
												style={{ borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}
											/>
											<button
												className="btn btn-primary px-3 fw-bold animate-pulse-btn"
												type="submit"
												style={{ borderTopRightRadius: "12px", borderBottomRightRadius: "12px" }}
											>
												Notify Me
											</button>
										</div>
									</form>
								)}
							</div>

							{/* Secondary Actions */}
							<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mt-4">
								<button
									className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold"
									onClick={() => setShowPreview(true)}
								>
									<i className="bi bi-eye me-2"></i>
									Preview Interface
								</button>
								<button
									className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
									onClick={() => setActiveSection("home")}
								>
									<i className="bi bi-search me-2"></i>
									Search Bus Routes
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div id="section-tickets" className="app-section active section-fade">
			<div className="dashboard-container py-3 mb-5">
				{/* Preview Mode Alert */}
				{showPreview && !token && (
					<div className="alert alert-info rounded-4 border-0 shadow-sm d-flex justify-content-between align-items-center mb-4 p-3 bg-primary-subtle text-primary-emphasis">
						<div className="d-flex align-items-center gap-2">
							<i className="bi bi-info-circle-fill fs-5"></i>
							<div>
								<h6 className="alert-heading fw-bold mb-0 small">Preview Mode</h6>
								<small className="d-block" style={{ fontSize: "0.75rem" }}>This is a mockup of the digital ticket manager interface.</small>
							</div>
						</div>
						<button
							className="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold"
							onClick={() => setShowPreview(false)}
						>
							<i className="bi bi-arrow-left me-1"></i> Back to Info
						</button>
					</div>
				)}

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
