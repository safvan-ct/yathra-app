import React, { useState, useEffect } from "react";
import { useStations } from "../hooks/useStations";
import { useBuses } from "../../buses/hooks/useBuses";

import BusContribution from "./forms/BusContribution";
import StationContribution from "./forms/StationContribution";
import RouteContribution from "./forms/RouteContribution";
import StopContribution from "./forms/StopContribution";
import TripContribution from "./forms/TripContribution";
import SuccessPopup from "./forms/SuccessPopup";
import "../styles/ContributeSection.css";

const ContributeSection = () => {
	const [type, setType] = useState(null);
	const [popup, setPopup] = useState(null);

	const { stations } = useStations();
	const { buses, getAllBuses } = useBuses();

	useEffect(() => {
		if (type === "stop" || type === "trip") {
			getAllBuses();
		}
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

				<div className="col-6 col-md-4">
					<a
						href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "917560838394"}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-decoration-none"
					>
						<div className="card menu-item-card p-3 rounded-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center whatsapp-contact-card">
							<div className="icon-box mb-2 whatsapp-icon-box">
								<i className="bi bi-whatsapp"></i>
							</div>
							<h6 className="fw-bold mb-1 whatsapp-title">
								Other Suggestions?
							</h6>
							<p className="small mb-0 whatsapp-subtitle">
								Contact us on WhatsApp
							</p>
						</div>
					</a>
				</div>

				<div className="col-12">
					<div className="card rounded-4 border-0 shadow-sm overflow-hidden position-relative premium-ad-card">
						<div className="premium-accent-bar" />

						<div className="premium-bg-circle" />

						<div className="card-body ps-4 pe-3 py-3 d-flex align-items-center gap-3 position-relative">
							<div className="premium-icon-box">
								<i className="bi bi-megaphone-fill" />
							</div>

							<div className="flex-grow-1">
								<div className="d-flex align-items-center gap-2 mb-1">
									<h6
										className="fw-bold mb-0 text-dark"
										style={{ fontSize: "0.9rem" }}
									>
										Yathra Premium
									</h6>
									<span className="badge text-uppercase fw-bold sponsored-pill">
										Sponsored
									</span>
								</div>
								<p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>
									Go ad-free and unlock priority contributions. Upgrade now.
								</p>
							</div>

							<button
								className="btn btn-warning btn-sm fw-bold flex-shrink-0 rounded-pill shadow-sm px-3"
								style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
							>
								Get Now
							</button>
						</div>
					</div>
				</div>

				<div className="col-12">
					<div className="card rounded-4 border-0 shadow-sm overflow-hidden position-relative contribution-cta-banner">
						<div className="cta-banner-circle-lg" />
						<div className="cta-banner-circle-sm" />

						<div className="card-body p-4 d-flex align-items-center gap-3 position-relative h-100">
							<div className="d-flex gap-2 flex-shrink-0">
								{["bi-bus-front", "bi-signpost", "bi-geo-alt"].map((icon) => (
									<div key={icon} className="cta-banner-icon">
										<i className={`bi ${icon}`} />
									</div>
								))}
							</div>

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
				return <StopContribution goBack={goBackToMenu} onSuccess={onSuccess} />;
			case "trip":
				return <TripContribution goBack={goBackToMenu} onSuccess={onSuccess} />;
			default:
				return null;
		}
	};

	return (
		<div id="section-contribute" className="app-section active">
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
							className="btn btn-light rounded-pill border shadow-sm text-dark fw-bold mb-3 px-3"
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
