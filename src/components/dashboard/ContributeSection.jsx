import React, { useState, useEffect } from "react";
import { useStations } from "../../hooks/useStations";
import { useBuses } from "../../../src/hooks/useBuses";

// Import isolated contribution components
import BusContribution from "./contributions/BusContribution";
import StationContribution from "./contributions/StationContribution";
import RouteContribution from "./contributions/RouteContribution";
import StopContribution from "./contributions/StopContribution";
import TripContribution from "./contributions/TripContribution";
import SuccessPopup from "./contributions/SuccessPopup";

const ContributeSection = () => {
	const [type, setType] = useState(null);
	const [popup, setPopup] = useState(null); // null | 'bus' | 'station' | ...

	// We only fetch these dependencies once we need them, but currently
	// maintaining standard hooks instance for props
	const { routes, stations, loadAllDependencies } = useStations();
	const { buses, getAllBuses } = useBuses();

	useEffect(() => {
		// Only load heavy dependencies when specific forms demand them
		if (type === "stop" || type === "trip") {
			getAllBuses();
			// loadAllDependencies() if necessary
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type]);

	const switchContribution = (selectedType) => {
		setType(selectedType);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const goBackToMenu = () => {
		setType(null);
	};

	const onSuccess = (contributionType) => {
		setPopup(contributionType);
	};

	const renderMenu = () => (
		<div id="contribution-menu" className="section-fade active mt-3">
			<style>
				{`
					.menu-item-card {
						transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
						cursor: pointer;
						border: 1px solid rgba(0,0,0,0.05) !important;
						background-color: #fff;
					}
					.menu-item-card:hover {
						transform: translateY(-5px);
						box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1) !important;
					}
					.icon-box.accent-blue { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
					.icon-box.accent-green { background-color: rgba(25, 135, 84, 0.1); color: #198754; }
					.icon-box.accent-purple { background-color: rgba(111, 66, 193, 0.1); color: #6f42c1; }
					.icon-box.accent-orange { background-color: rgba(253, 126, 20, 0.1); color: #fd7e14; }
					.icon-box.accent-red { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
					.icon-box {
						width: 48px;
						height: 48px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						font-size: 1.25rem;
						margin-bottom: 1rem;
					}
				`}
			</style>
			<div className="row g-3">
				<div className="col-6 col-md-4">
					<div
						className="card menu-item-card p-3 rounded-4 shadow-sm h-100"
						onClick={() => switchContribution("bus")}
					>
						<div className="icon-box accent-blue">
							<i className="bi bi-bus-front"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Bus</h6>
						<p className="text-muted small mb-0">Add bus names or types</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card menu-item-card p-3 rounded-4 shadow-sm h-100"
						onClick={() => switchContribution("station")}
					>
						<div className="icon-box accent-green">
							<i className="bi bi-geo-alt"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Stop</h6>
						<p className="text-muted small mb-0">Main hubs or terminals</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card menu-item-card p-3 rounded-4 shadow-sm h-100"
						onClick={() => switchContribution("route")}
					>
						<div className="icon-box accent-purple">
							<i className="bi bi-signpost"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Route</h6>
						<p className="text-muted small mb-0">Path between cities</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card menu-item-card p-3 rounded-4 shadow-sm h-100"
						onClick={() => switchContribution("trip")}
					>
						<div className="icon-box accent-red">
							<i className="bi bi-calendar-event"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Trip</h6>
						<p className="text-muted small mb-0">Timing & schedules</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card menu-item-card p-3 rounded-4 shadow-sm h-100"
						onClick={() => switchContribution("stop")}
					>
						<div className="icon-box accent-orange">
							<i className="bi bi-dot"></i>
						</div>
						<h6 className="fw-bold mb-1">Route Stop</h6>
						<p className="text-muted small mb-0">Intermediate stops of route</p>
					</div>
				</div>
				{/* ── WhatsApp Contact Card ── */}
				<div className="col-6 col-md-4">
					<a
						href="https://wa.me/7560838394"
						target="_blank"
						rel="noopener noreferrer"
						style={{ textDecoration: "none" }}
					>
						<div
							className="card menu-item-card p-3 rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center"
							style={{
								background: "linear-gradient(135deg, #e8f5e9 0%, #f0fff4 100%)",
								border: "1.5px solid rgba(37,211,102,0.25) !important",
							}}
						>
							<div
								className="icon-box mb-2"
								style={{
									background: "rgba(37,211,102,0.12)",
									color: "#25d366",
									width: "52px",
									height: "52px",
									fontSize: "1.5rem",
								}}
							>
								<i className="bi bi-whatsapp"></i>
							</div>
							<h6 className="fw-bold mb-1" style={{ color: "#128c5e" }}>
								Other Suggestions?
							</h6>
							<p className="small mb-0" style={{ color: "#25d366" }}>
								Contact us on WhatsApp
							</p>
						</div>
					</a>
				</div>

				{/* ── AD Card ── */}
				<div className="col-12">
					<div
						className="card rounded-4 border-0 shadow-sm overflow-hidden position-relative"
						style={{
							background: "linear-gradient(135deg, #fffdf0 0%, #fff8e1 100%)",
							border: "1.5px solid rgba(255,193,7,0.2) !important",
						}}
					>
						{/* Decorative accent bar */}
						<div
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								bottom: 0,
								width: "4px",
								background: "linear-gradient(180deg, #ffc107 0%, #fd7e14 100%)",
								opacity: 0.85,
							}}
						/>

						{/* Decorative background circle */}
						<div
							style={{
								position: "absolute",
								top: "-40px",
								right: "-40px",
								width: "160px",
								height: "160px",
								borderRadius: "50%",
								background: "rgba(255,193,7,0.08)",
							}}
						/>

						<div className="card-body ps-4 pe-3 py-3 d-flex align-items-center gap-3 position-relative">
							{/* Megaphone icon */}
							<div
								style={{
									width: "46px",
									height: "46px",
									borderRadius: "50%",
									flexShrink: 0,
									background: "rgba(255,193,7,0.15)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#e67e00",
									fontSize: "1.3rem",
								}}
							>
								<i className="bi bi-megaphone-fill" />
							</div>

							{/* Text block */}
							<div className="flex-grow-1">
								<div className="d-flex align-items-center gap-2 mb-1">
									<h6
										className="fw-bold mb-0 text-dark"
										style={{ fontSize: "0.9rem" }}
									>
										Yathra Premium
									</h6>
									<span
										className="badge text-uppercase fw-bold"
										style={{
											fontSize: "0.5rem",
											letterSpacing: "0.8px",
											background: "rgba(255,193,7,0.2)",
											color: "#b8860b",
											padding: "3px 7px",
										}}
									>
										Sponsored
									</span>
								</div>
								<p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>
									Go ad-free and unlock priority contributions. Upgrade now.
								</p>
							</div>

							{/* CTA Button */}
							<button
								className="btn btn-warning btn-sm fw-bold flex-shrink-0 rounded-pill shadow-sm px-3"
								style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
							>
								Get Now
							</button>
						</div>
					</div>
				</div>

				{/* ── Full-width Creative CTA Banner ── */}
				<div className="col-12">
					<div
						className="card rounded-4 border-0 shadow-sm overflow-hidden"
						style={{
							background: "linear-gradient(135deg, #0d6efd 0%, #6f42c1 100%)",
							minHeight: "110px",
						}}
					>
						{/* Decorative blurred circles */}
						<div
							style={{
								position: "absolute",
								top: "-30px",
								right: "-30px",
								width: "140px",
								height: "140px",
								borderRadius: "50%",
								background: "rgba(255,255,255,0.08)",
							}}
						/>
						<div
							style={{
								position: "absolute",
								bottom: "-20px",
								left: "60px",
								width: "90px",
								height: "90px",
								borderRadius: "50%",
								background: "rgba(255,255,255,0.06)",
							}}
						/>

						<div className="card-body p-4 d-flex align-items-center gap-3 position-relative">
							{/* Icon cluster */}
							<div className="d-flex gap-2 flex-shrink-0">
								{["bi-bus-front", "bi-signpost", "bi-geo-alt"].map((icon) => (
									<div
										key={icon}
										style={{
											width: "38px",
											height: "38px",
											borderRadius: "50%",
											background: "rgba(255,255,255,0.15)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#fff",
											fontSize: "1rem",
										}}
									>
										<i className={`bi ${icon}`} />
									</div>
								))}
							</div>

							{/* Text */}
							<div className="flex-grow-1">
								<h6
									className="fw-bold text-white mb-1"
									style={{ fontSize: "0.95rem" }}
								>
									Every contribution matters 🚌
								</h6>
								<p
									className="text-white mb-0 opacity-75"
									style={{ fontSize: "0.78rem" }}
								>
									Help make Yathra better for everyone — add buses, stops,
									routes &amp; more.
								</p>
							</div>

							{/* Decorative chevron */}
							{/* <i
								className="bi bi-chevron-right text-white opacity-50 flex-shrink-0"
								style={{ fontSize: "1.4rem" }}
							/> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderForm = () => {
		switch (type) {
			case "bus":
				return <BusContribution goBack={goBackToMenu} onSuccess={onSuccess} />;
			case "station":
				return (
					<StationContribution goBack={goBackToMenu} onSuccess={onSuccess} />
				);
			case "route":
				return (
					<RouteContribution goBack={goBackToMenu} onSuccess={onSuccess} />
				);
			case "stop":
				return (
					<StopContribution
						goBack={goBackToMenu}
						routes={routes}
						onSuccess={onSuccess}
					/>
				);
			case "trip":
				return <TripContribution goBack={goBackToMenu} onSuccess={onSuccess} />;
			default:
				return null;
		}
	};

	return (
		<div id="section-contribute" className="app-section active">
			{/* Creative Success Popup */}
			{popup && (
				<SuccessPopup
					type={popup}
					onClose={() => {
						setPopup(null);
						goBackToMenu();
					}}
				/>
			)}

			<div className="dashboard-container py-3 pb-5 mb-5">
				<div className="text-center mb-4">
					<h3 className="fw-800 mb-1 text-dark">Contribute Hub</h3>
					<p className="text-muted mb-1 small">
						Select a category to share information
					</p>
				</div>

				{!type ? (
					renderMenu()
				) : (
					<div id="form-container" className="section-fade active">
						<button
							className="btn btn-light rounded-pill border shadow-sm text-dark fw-bold mb-4 px-3"
							onClick={goBackToMenu}
						>
							<i className="bi bi-arrow-left me-2"></i>Back to options
						</button>
						{renderForm()}
					</div>
				)}
			</div>
		</div>
	);
};

export default ContributeSection;
