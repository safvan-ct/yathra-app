import React, { useState, useEffect } from "react";
import { useStations } from "../../hooks/useStations";
import { useBuses } from "../../../src/hooks/useBuses";

// Import isolated contribution components
import BusContribution from "./contributions/BusContribution";
import StationContribution from "./contributions/StationContribution";
import RouteContribution from "./contributions/RouteContribution";
import StopContribution from "./contributions/StopContribution";
import TripContribution from "./contributions/TripContribution";

const ContributeSection = () => {
	const [type, setType] = useState(null); // 'bus', 'station', 'route', 'stop', 'trip'

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
		alert(
			"Thank you for your contribution! Your suggestion for " +
				contributionType +
				" has been submitted successfully.",
		);
		goBackToMenu();
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
						<h6 className="fw-bold mb-1">Suggest Station</h6>
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
						onClick={() => switchContribution("stop")}
					>
						<div className="icon-box accent-orange">
							<i className="bi bi-dot"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Stop</h6>
						<p className="text-muted small mb-0">Intermediate pick-ups</p>
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
				return (
					<TripContribution
						goBack={goBackToMenu}
						routes={routes}
						buses={buses}
						onSuccess={onSuccess}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div id="section-contribute" className="app-section active">
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
