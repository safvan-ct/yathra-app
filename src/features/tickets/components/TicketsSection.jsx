import React, { useState } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import SponsoredAdCard from "../../home/components/SponsoredAdCard";
import "../styles/TicketsSection.css";

const initialTickets = [
	{
		id: "YTR-890214",
		pnr: "YTR-890214-KL",
		from: "Ernakulam (Vytila Hub)",
		fromCode: "ERS",
		to: "Trivandrum Central",
		toCode: "TVC",
		busName: "KSRTC Swift Premium AC",
		busNumber: "KL-15-A-4830",
		category: "AC Multi-Axle",
		operator: { name: "KSRTC Swift", type: "State" },
		busColor: "#0d6efd",
		date: "Today, 19 Sep 2026",
		departureTime: "06:30 PM",
		arrivalTime: "11:45 PM",
		duration: "5h 15m",
		platform: "Platform 4 • Bay B",
		seat: "14, 15 (Window)",
		passenger: "Safvan & Companion",
		fare: "₹480.00",
		status: "active",
		statusText: "Boarding in 45m",
		statusBadgeClass:
			"bg-success bg-opacity-10 text-success border-success border-opacity-25",
		amenities: ["AC", "Charging Point", "Water Bottle", "Live GPS"],
	},
	{
		id: "YTR-772190",
		pnr: "YTR-772190-KL",
		from: "Kozhikode (Mofussil)",
		fromCode: "CLT",
		to: "Thrissur Round",
		toCode: "TCR",
		busName: "Yathra Air Deluxe Express",
		busNumber: "KL-11-Q-9921",
		category: "Super Fast Deluxe",
		operator: { name: "Yathra Express", type: "State" },
		busColor: "#10b981",
		date: "Tomorrow, 20 Sep 2026",
		departureTime: "08:15 PM",
		arrivalTime: "11:30 PM",
		duration: "3h 15m",
		platform: "Platform 2 • Bay A",
		seat: "08 (Aisle)",
		passenger: "Safvan",
		fare: "₹260.00",
		status: "active",
		statusText: "Confirmed",
		statusBadgeClass:
			"bg-primary bg-opacity-10 text-primary border-primary border-opacity-25",
		amenities: ["Pushback Seats", "Live GPS", "Reading Light"],
	},
	{
		id: "YTR-562104",
		pnr: "YTR-562104-KL",
		from: "Kannur Old Bus Stand",
		fromCode: "CAN",
		to: "Kozhikode (New Stand)",
		toCode: "CLT",
		busName: "Minnal Super Express",
		busNumber: "KL-13-Y-3312",
		category: "Non-Stop Minnal",
		operator: { name: "KSRTC Minnal", type: "Express" },
		busColor: "#f59e0b",
		date: "12 Sep 2026",
		departureTime: "09:15 AM",
		arrivalTime: "11:40 AM",
		duration: "2h 25m",
		platform: "Platform 1",
		seat: "22 (Window)",
		passenger: "Safvan",
		fare: "₹180.00",
		status: "completed",
		statusText: "Trip Completed",
		statusBadgeClass:
			"bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25",
		amenities: ["Fast Express", "Live GPS"],
	},
	{
		id: "YTR-441092",
		pnr: "YTR-441092-KL",
		from: "Palakkad KSRTC Stand",
		fromCode: "PGT",
		to: "Coimbatore Gandhipuram",
		toCode: "CBE",
		busName: "Interstate AC Low Floor",
		busNumber: "KL-09-V-8841",
		category: "AC Low Floor",
		operator: { name: "KSRTC Swift", type: "Interstate" },
		busColor: "#0d6efd",
		date: "05 Sep 2026",
		departureTime: "02:00 PM",
		arrivalTime: "03:30 PM",
		duration: "1h 30m",
		platform: "Platform 3",
		seat: "04, 05",
		passenger: "Safvan",
		fare: "₹140.00",
		status: "completed",
		statusText: "Trip Completed",
		statusBadgeClass:
			"bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25",
		amenities: ["AC Low Floor", "Wide Legroom"],
	},
];

const TicketsSection = ({ setActiveSection }) => {
	const { token } = useAuth();
	const [activeTab, setActiveTab] = useState("active");
	const [selectedTicketForModal, setSelectedTicketForModal] = useState(null);
	const [toastMessage, setToastMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => {
			setToastMessage("");
		}, 2800);
	};

	const filteredTickets = initialTickets
		.filter((t) => (activeTab === "all" ? true : t.status === activeTab))
		.filter((t) => {
			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase();
			return (
				t.id.toLowerCase().includes(q) ||
				t.pnr.toLowerCase().includes(q) ||
				t.from.toLowerCase().includes(q) ||
				t.to.toLowerCase().includes(q) ||
				t.busName.toLowerCase().includes(q) ||
				t.busNumber.toLowerCase().includes(q)
			);
		});

	const activeCount = initialTickets.filter(
		(t) => t.status === "active",
	).length;
	const completedCount = initialTickets.filter(
		(t) => t.status === "completed",
	).length;

	const handleBookNew = () => {
		if (setActiveSection) {
			setActiveSection("home");
		}
	};

	const handleTrackTicketBus = (ticket) => {
		if (setActiveSection) {
			const mockBus = {
				id: ticket.id,
				bus_name: ticket.busName,
				bus_number: ticket.busNumber,
				bus_color: ticket.busColor,
				category: ticket.category,
				origin_station: ticket.from,
				destination_station: ticket.to,
				departure_time: ticket.departureTime,
				arrival_time: ticket.arrivalTime,
				is_running_today: 1,
			};
			localStorage.setItem("yathra_tracked_bus", JSON.stringify(mockBus));
			setActiveSection("tracking");
		}
	};

	const handleCopyPNR = (pnr, e) => {
		e?.stopPropagation();
		navigator.clipboard?.writeText(pnr);
		showToast(`PNR ${pnr} copied to clipboard!`);
	};

	const handleDownloadTicket = (ticket, e) => {
		e?.stopPropagation();
		showToast(`Downloading Ticket ${ticket.pnr} as PDF...`);
	};

	return (
		<div id="section-tickets" className="app-section active tickets-container">
			{/* Toast Notification */}
			{toastMessage && (
				<div className="ticket-toast-alert d-flex align-items-center gap-2">
					<i className="bi bi-check-circle-fill text-success fs-6"></i>
					<span>{toastMessage}</span>
				</div>
			)}

			{/* Sticky Top Header */}
			<div className="tickets-header py-2 px-3 text-white">
				<div className="d-flex align-items-center justify-content-between">
					<div className="d-flex align-items-center gap-2">
						<div
							className="rounded-circle d-flex align-items-center justify-content-center bg-white bg-opacity-20"
							style={{ width: "32px", height: "32px" }}
						>
							<i className="bi bi-ticket-perforated-fill text-white fs-6"></i>
						</div>
						<div>
							<h6
								className="fw-bold mb-0 text-white"
								style={{ fontSize: "0.95rem" }}
							>
								My Tickets & Passes
							</h6>
							<span
								className="opacity-75 small fw-semibold"
								style={{ fontSize: "0.68rem", letterSpacing: "0.3px" }}
							>
								Digital Boarding Passes • Live Tracking
							</span>
						</div>
					</div>

					<div className="d-flex align-items-center gap-2">
						<button
							className="btn btn-light btn-sm rounded-pill px-2.5 py-1 fw-bold text-primary shadow-sm"
							style={{ fontSize: "11px" }}
							onClick={handleBookNew}
						>
							<i className="bi bi-plus-circle-fill me-1"></i> Book Bus
						</button>
					</div>
				</div>
			</div>

			<div className="dashboard-container px-1 px-sm-3 mt-2">
				{/* Search & Navigation Tabs */}
				<div className="d-flex flex-column gap-2 mb-2">
					{/* Search input if multiple tickets */}
					<div className="position-relative">
						<i
							className="bi bi-search position-absolute text-muted"
							style={{
								left: "12px",
								top: "50%",
								transform: "translateY(-50%)",
								fontSize: "0.8rem",
							}}
						></i>
						<input
							type="text"
							className="form-control form-control-sm rounded-3 ps-4 bg-white border"
							placeholder="Search by PNR, City, Bus Name or Number..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{ fontSize: "0.78rem" }}
						/>
						{searchQuery && (
							<button
								className="btn btn-link btn-sm position-absolute text-muted p-0"
								style={{
									right: "12px",
									top: "50%",
									transform: "translateY(-50%)",
								}}
								onClick={() => setSearchQuery("")}
							>
								<i className="bi bi-x-circle-fill"></i>
							</button>
						)}
					</div>

					{/* Navigation Tabs */}
					<div className="ticket-nav-tabs d-flex">
						<button
							className={`ticket-tab-btn flex-fill ${activeTab === "active" ? "active" : ""}`}
							onClick={() => setActiveTab("active")}
						>
							<i className="bi bi-clock-history"></i>
							Active
							<span className="ticket-tab-badge">{activeCount}</span>
						</button>
						<button
							className={`ticket-tab-btn flex-fill ${activeTab === "completed" ? "active" : ""}`}
							onClick={() => setActiveTab("completed")}
						>
							<i className="bi bi-check2-circle"></i>
							Completed
							<span className="ticket-tab-badge">{completedCount}</span>
						</button>
						<button
							className={`ticket-tab-btn flex-fill ${activeTab === "all" ? "active" : ""}`}
							onClick={() => setActiveTab("all")}
						>
							<i className="bi bi-collection"></i>
							All
							<span className="ticket-tab-badge">{initialTickets.length}</span>
						</button>
					</div>
				</div>

				{/* Ticket Cards List */}
				<div className="d-flex flex-column gap-1 mb-1">
					{filteredTickets.length > 0 ? (
						filteredTickets.map((t, idx) => {
							const elements = [];

							elements.push(
								<div
									key={t.id}
									className="card yathra-ticket-card"
									onClick={() => setSelectedTicketForModal(t)}
								>
									{/* Top Header: Bus Name, Number, PNR & Status */}
									<div className="ticket-card-header d-flex align-items-center justify-content-between">
										<div className="d-flex align-items-center gap-2">
											<div
												className="ticket-brand-icon-box"
												style={{
													backgroundColor: "rgba(13, 110, 253, 0.1)",
													color: t.busColor || "#0d6efd",
												}}
											>
												<i className="bi bi-bus-front"></i>
											</div>
											<div>
												<h6 className="ticket-title-text mb-0">{t.busName}</h6>
												<span className="ticket-sub-text">
													{t.busNumber} • {t.operator?.name || "KSRTC"}
												</span>
											</div>
										</div>

										<div className="d-flex align-items-center gap-1">
											<span
												className={`badge rounded-pill px-2 py-1 border fw-semibold ${t.statusBadgeClass}`}
												style={{ fontSize: "0.7rem" }}
											>
												● {t.statusText}
											</span>
										</div>
									</div>

									{/* Journey Route & Timings */}
									<div className="ticket-journey-row d-flex align-items-center justify-content-between">
										{/* Origin */}
										<div className="text-start">
											<span className="ticket-time-bold d-block">
												{t.departureTime}
											</span>
											<span className="ticket-station-name d-block text-truncate">
												{t.from}
											</span>
											<span className="ticket-station-sub d-block">
												{t.platform}
											</span>
										</div>

										{/* Connecting Journey Line */}
										<div className="flex-grow-1 px-3 d-flex flex-column align-items-center justify-content-center">
											<span className="ticket-duration-pill mb-1">
												{t.duration}
											</span>
											<div className="d-flex align-items-center w-100 position-relative justify-content-center">
												<div className="ticket-track-dot"></div>
												<div className="ticket-track-line"></div>
												<div
													className="ticket-track-bus-marker mx-1"
													style={{ color: t.busColor || "#0d6efd" }}
												>
													<i className="bi bi-bus-front"></i>
												</div>
												<div className="ticket-track-line"></div>
												<div className="ticket-track-dot"></div>
											</div>
											<small
												className="text-muted mt-1"
												style={{ fontSize: "0.65rem" }}
											>
												{t.date}
											</small>
										</div>

										{/* Destination */}
										<div className="text-end">
											<span className="ticket-time-bold d-block">
												{t.arrivalTime}
											</span>
											<span className="ticket-station-name d-block text-truncate">
												{t.to}
											</span>
											<span className="ticket-station-sub d-block">
												Arrival Station
											</span>
										</div>
									</div>

									{/* Perforated Divider with realistic cutouts */}
									<div className="ticket-perforation">
										<div className="ticket-cutout-left"></div>
										<div className="ticket-cutout-right"></div>
									</div>

									{/* Metadata: Passenger, Seats, Fare & PNR */}
									<div className="ticket-meta-grid">
										<div className="row g-2">
											<div className="col-4">
												<div className="ticket-meta-label">Passenger</div>
												<div className="ticket-meta-value text-truncate">
													{t.passenger}
												</div>
											</div>
											<div className="col-4 text-center">
												<div className="ticket-meta-label">Seat Assigned</div>
												<span className="ticket-seat-badge">{t.seat}</span>
											</div>
											<div className="col-4 text-end">
												<div className="ticket-meta-label">Fare Paid</div>
												<div className="ticket-meta-value text-primary">
													{t.fare}
												</div>
											</div>
										</div>

										{/* Amenities Pills */}
										<div className="d-flex align-items-center gap-1 flex-wrap mt-1 pt-1 border-top border-light-subtle">
											<span
												className="badge bg-light text-secondary border rounded-pill px-2 py-0.5"
												style={{ fontSize: "0.62rem" }}
											>
												PNR: {t.pnr}
											</span>
											{t.amenities?.map((amenity, aIdx) => (
												<span
													key={aIdx}
													className="badge bg-light text-muted border rounded-pill px-1 py-0.5"
													style={{ fontSize: "0.6rem" }}
												>
													<i className="bi bi-check2 text-success me-0.5"></i>
													{amenity}
												</span>
											))}
										</div>
									</div>

									{/* Action Buttons Row */}
									<div className="ticket-card-actions">
										<div className="d-flex align-items-center gap-1">
											<button
												type="button"
												className="btn-ticket-outline"
												onClick={(e) => handleCopyPNR(t.pnr, e)}
												title="Copy PNR Code"
											>
												<i className="bi bi-copy me-1"></i> PNR
											</button>
											<button
												type="button"
												className="btn-ticket-outline"
												onClick={(e) => handleDownloadTicket(t, e)}
												title="Download PDF"
											>
												<i className="bi bi-download me-1"></i> PDF
											</button>
										</div>

										<div className="d-flex align-items-center gap-1">
											{t.status === "active" && (
												<button
													type="button"
													className="btn btn-outline-primary btn-sm rounded-pill px-2.5 py-1 fw-bold"
													style={{ fontSize: "11px" }}
													onClick={(e) => {
														e.stopPropagation();
														handleTrackTicketBus(t);
													}}
												>
													<i className="bi bi-geo-alt-fill me-1"></i> Track
												</button>
											)}
											<button
												type="button"
												className="btn-ticket-primary"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedTicketForModal(t);
												}}
											>
												<i className="bi bi-qr-code-scan me-1"></i> Digital Pass
											</button>
										</div>
									</div>
								</div>,
							);

							// Insert Sponsored Ad Card after every 2 ticket cards
							if ((idx + 1) % 1 === 0) {
								const adIndex = Math.floor(idx / 1);
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
							<div
								className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
								style={{ width: "60px", height: "60px" }}
							>
								<i className="bi bi-ticket-perforated fs-2"></i>
							</div>
							<h6 className="fw-bold text-secondary mb-1">No Tickets Found</h6>
							<p className="text-muted small mb-3">
								{searchQuery
									? `No bookings match "${searchQuery}".`
									: `You don't have any ${activeTab} tickets right now.`}
							</p>
							<button
								className="btn btn-primary rounded-pill px-4 py-2 fw-bold small mx-auto shadow-sm"
								onClick={handleBookNew}
							>
								<i className="bi bi-search me-1"></i> Find & Book Bus
							</button>
						</div>
					)}
				</div>

				{/* Yathra Smart Commuter Pass Banner */}
				{/* <div className="card border-0 rounded-4 p-3 mb-3 shadow-sm text-white" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
					<div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
						<div className="d-flex align-items-center gap-2.5">
							<div
								className="rounded-3 bg-warning bg-opacity-20 text-warning d-flex align-items-center justify-content-center flex-shrink-0"
								style={{ width: "40px", height: "40px" }}
							>
								<i className="bi bi-stars fs-5"></i>
							</div>
							<div>
								<h6 className="fw-bold mb-0 text-white" style={{ fontSize: "0.88rem" }}>
									Yathra Commuter Pass
								</h6>
								<small className="text-white-50" style={{ fontSize: "0.72rem" }}>
									Save 30% with monthly travel passes on daily routes
								</small>
							</div>
						</div>
						<button
							className="btn btn-warning btn-sm rounded-pill px-3 py-1 fw-bold text-dark shadow-sm"
							style={{ fontSize: "0.75rem" }}
							onClick={() => showToast("Monthly Pass portal launching this week!")}
						>
							Explore Passes
						</button>
					</div>
				</div> */}
			</div>

			{/* ==========================================================================
			   Digital Boarding Pass Modal
			   ========================================================================== */}
			{selectedTicketForModal && (
				<div
					className="ticket-modal-overlay"
					onClick={() => setSelectedTicketForModal(null)}
				>
					<div
						className="ticket-pass-modal"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="modal-pass-header d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center gap-2">
								<div
									className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
									style={{ width: "36px", height: "36px" }}
								>
									<i className="bi bi-qr-code text-white fs-5"></i>
								</div>
								<div>
									<h6
										className="fw-bold mb-0 text-white"
										style={{ fontSize: "0.95rem" }}
									>
										Boarding Pass
									</h6>
									<span
										className="opacity-75 small"
										style={{ fontSize: "0.7rem" }}
									>
										PNR: {selectedTicketForModal.pnr}
									</span>
								</div>
							</div>
							<button
								type="button"
								className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
								style={{ width: "28px", height: "28px" }}
								onClick={() => setSelectedTicketForModal(null)}
								aria-label="Close"
							>
								<i
									className="bi bi-x-lg text-dark"
									style={{ fontSize: "11px" }}
								></i>
							</button>
						</div>

						{/* Modal Body */}
						<div className="p-3">
							{/* Bus & Route Summary */}
							<div className="bg-light p-3 rounded-3 border mb-3">
								<div className="d-flex justify-content-between align-items-center mb-2">
									<span className="fw-bold text-dark fs-7">
										{selectedTicketForModal.busName}
									</span>
									<span
										className="badge bg-primary rounded-pill px-2 py-0.5"
										style={{ fontSize: "0.68rem" }}
									>
										{selectedTicketForModal.busNumber}
									</span>
								</div>

								<div className="d-flex justify-content-between align-items-center my-2">
									<div>
										<span className="fw-bold text-dark d-block fs-6">
											{selectedTicketForModal.departureTime}
										</span>
										<small
											className="text-muted d-block text-truncate"
											style={{ maxWidth: "120px", fontSize: "0.72rem" }}
										>
											{selectedTicketForModal.from}
										</small>
										<span
											className="badge bg-light text-secondary border mt-1"
											style={{ fontSize: "0.62rem" }}
										>
											{selectedTicketForModal.platform}
										</span>
									</div>

									<div className="text-center px-2">
										<i className="bi bi-arrow-right text-primary fs-5"></i>
										<small
											className="text-muted d-block"
											style={{ fontSize: "0.65rem" }}
										>
											{selectedTicketForModal.duration}
										</small>
									</div>

									<div className="text-end">
										<span className="fw-bold text-dark d-block fs-6">
											{selectedTicketForModal.arrivalTime}
										</span>
										<small
											className="text-muted d-block text-truncate"
											style={{ maxWidth: "120px", fontSize: "0.72rem" }}
										>
											{selectedTicketForModal.to}
										</small>
										<span
											className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mt-1"
											style={{ fontSize: "0.62rem" }}
										>
											Destination
										</span>
									</div>
								</div>
							</div>

							{/* High Resolution Interactive QR Code Section */}
							<div className="text-center mb-3">
								<div className="ticket-qr-scanner-box">
									<svg
										width="130"
										height="130"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
										className="text-dark"
									>
										<rect x="2" y="2" width="6" height="6" rx="1" />
										<rect x="2" y="16" width="6" height="6" rx="1" />
										<rect x="16" y="2" width="6" height="6" rx="1" />
										<rect
											x="4"
											y="4"
											width="2"
											height="2"
											fill="currentColor"
										/>
										<rect
											x="4"
											y="18"
											width="2"
											height="2"
											fill="currentColor"
										/>
										<rect
											x="18"
											y="4"
											width="2"
											height="2"
											fill="currentColor"
										/>
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
									<span className="fw-bold text-dark small mt-2 d-block">
										Scan for Gate Boarding
									</span>
									<small className="text-muted" style={{ fontSize: "0.68rem" }}>
										Valid for entry at conductor validator machine
									</small>
								</div>
							</div>

							{/* Passenger & Fare breakdown table */}
							<div className="border rounded-3 p-2.5 mb-3 bg-white">
								<div className="row g-2 text-start">
									<div className="col-6">
										<small
											className="text-muted d-block"
											style={{ fontSize: "0.65rem" }}
										>
											PASSENGER NAME
										</small>
										<span className="fw-bold text-dark fs-7">
											{selectedTicketForModal.passenger}
										</span>
									</div>
									<div className="col-6 text-end">
										<small
											className="text-muted d-block"
											style={{ fontSize: "0.65rem" }}
										>
											SEAT NUMBER
										</small>
										<span className="badge bg-primary rounded-pill px-2.5 py-0.5">
											{selectedTicketForModal.seat}
										</span>
									</div>
									<div className="col-6">
										<small
											className="text-muted d-block"
											style={{ fontSize: "0.65rem" }}
										>
											JOURNEY DATE
										</small>
										<span className="fw-semibold text-dark fs-7">
											{selectedTicketForModal.date}
										</span>
									</div>
									<div className="col-6 text-end">
										<small
											className="text-muted d-block"
											style={{ fontSize: "0.65rem" }}
										>
											AMOUNT PAID
										</small>
										<span className="fw-bold text-success fs-7">
											{selectedTicketForModal.fare}
										</span>
									</div>
								</div>
							</div>

							{/* Barcode Strip */}
							<div className="mb-3 px-2 text-center">
								<div className="barcode-strip mb-1"></div>
								<small
									className="text-muted"
									style={{ fontSize: "0.65rem", letterSpacing: "2px" }}
								>
									{selectedTicketForModal.pnr}
								</small>
							</div>

							{/* Modal Actions */}
							<div className="d-flex gap-2">
								<button
									className="btn btn-outline-secondary btn-sm flex-fill rounded-pill fw-semibold py-2"
									style={{ fontSize: "0.78rem" }}
									onClick={(e) => handleCopyPNR(selectedTicketForModal.pnr, e)}
								>
									<i className="bi bi-share me-1"></i> Share
								</button>
								<button
									className="btn btn-primary btn-sm flex-fill rounded-pill fw-bold py-2 shadow-sm"
									style={{ fontSize: "0.78rem" }}
									onClick={(e) =>
										handleDownloadTicket(selectedTicketForModal, e)
									}
								>
									<i className="bi bi-download me-1"></i> Save PDF
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TicketsSection;
