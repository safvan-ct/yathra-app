import React, { useEffect, useState } from "react";
import api from "../../../shared/api/api";
import SponsoredAdCard from "../../home/components/SponsoredAdCard";
import TrackingBurgerPosterCard from "./TrackingBurgerPosterCard";
import "../styles/Tracking.css";

// Helper to provide mock trip data and nodes if API fails or for mock trip IDs
const getMockTripAndNodes = (busObj) => {
	const tripId = busObj.trip_id || "T-201";

	const allMockTrips = {
		"T-201": {
			id: "T-201",
			departure_time: "07:30 AM",
			arrival_time: "01:00 PM",
			speed_kmh: 60,
			route_id: 101,
			bus: {
				bus_name: busObj.bus_name || "Yathra Premium",
				bus_number: busObj.bus_number || "KL-07-Y-1001",
				category: busObj.category || "AC Multi-Axle",
				bus_color: busObj.bus_color || "#0d6efd",
				operator: busObj.operator || { name: "KSRTC", type: "State" },
			},
			route: {
				origin: { name: "Cochin (Vytila)" },
				destination: { name: "Trivandrum Central" },
			},
			nodes: [
				{
					stop_sequence: 1,
					distance_from_origin: 0,
					station: { name: "Cochin (Vytila)" },
				},
				{
					stop_sequence: 2,
					distance_from_origin: 40,
					station: { name: "Cherthala Bypass" },
				},
				{
					stop_sequence: 3,
					distance_from_origin: 80,
					station: { name: "Alappuzha" },
				},
				{
					stop_sequence: 4,
					distance_from_origin: 130,
					station: { name: "Kayamkulam" },
				},
				{
					stop_sequence: 5,
					distance_from_origin: 170,
					station: { name: "Kollam" },
				},
				{
					stop_sequence: 6,
					distance_from_origin: 220,
					station: { name: "Trivandrum Central" },
				},
			],
		},
		"T-202": {
			id: "T-202",
			departure_time: "02:15 PM",
			arrival_time: "10:45 PM",
			speed_kmh: 55,
			route_id: 102,
			bus: {
				bus_name: busObj.bus_name || "Yathra Premium",
				bus_number: busObj.bus_number || "KL-07-Y-1002",
				category: busObj.category || "AC Multi-Axle",
				bus_color: busObj.bus_color || "#0d6efd",
				operator: busObj.operator || { name: "KSRTC", type: "State" },
			},
			route: {
				origin: { name: "Trivandrum Central" },
				destination: { name: "Kozhikode (Calicut)" },
			},
			nodes: [
				{
					stop_sequence: 1,
					distance_from_origin: 0,
					station: { name: "Trivandrum Central" },
				},
				{
					stop_sequence: 2,
					distance_from_origin: 70,
					station: { name: "Kollam" },
				},
				{
					stop_sequence: 3,
					distance_from_origin: 140,
					station: { name: "Alappuzha" },
				},
				{
					stop_sequence: 4,
					distance_from_origin: 210,
					station: { name: "Ernakulam" },
				},
				{
					stop_sequence: 5,
					distance_from_origin: 290,
					station: { name: "Thrissur" },
				},
				{
					stop_sequence: 6,
					distance_from_origin: 375,
					station: { name: "Kozhikode (Calicut)" },
				},
			],
		},
		"T-203": {
			id: "T-203",
			departure_time: "08:30 PM",
			arrival_time: "06:15 AM",
			speed_kmh: 65,
			route_id: 103,
			bus: {
				bus_name: busObj.bus_name || "Yathra Premium",
				bus_number: busObj.bus_number || "KL-07-Y-1003",
				category: busObj.category || "AC Multi-Axle",
				bus_color: busObj.bus_color || "#0d6efd",
				operator: busObj.operator || { name: "KSRTC", type: "State" },
			},
			route: {
				origin: { name: "Cochin (Vytila)" },
				destination: { name: "Bangalore (Kaladipal)" },
			},
			nodes: [
				{
					stop_sequence: 1,
					distance_from_origin: 0,
					station: { name: "Cochin (Vytila)" },
				},
				{
					stop_sequence: 2,
					distance_from_origin: 20,
					station: { name: "Aluva Bypass" },
				},
				{
					stop_sequence: 3,
					distance_from_origin: 75,
					station: { name: "Thrissur Bypass" },
				},
				{
					stop_sequence: 4,
					distance_from_origin: 145,
					station: { name: "Palakkad" },
				},
				{
					stop_sequence: 5,
					distance_from_origin: 470,
					station: { name: "Hosur" },
				},
				{
					stop_sequence: 6,
					distance_from_origin: 530,
					station: { name: "Bangalore (Kaladipal)" },
				},
			],
		},
		"T-204": {
			id: "T-204",
			departure_time: "09:45 PM",
			arrival_time: "07:30 AM",
			speed_kmh: 65,
			route_id: 104,
			bus: {
				bus_name: busObj.bus_name || "Yathra Premium",
				bus_number: busObj.bus_number || "KL-07-Y-1004",
				category: busObj.category || "AC Multi-Axle",
				bus_color: busObj.bus_color || "#0d6efd",
				operator: busObj.operator || { name: "KSRTC", type: "State" },
			},
			route: {
				origin: { name: "Bangalore (Kaladipal)" },
				destination: { name: "Cochin (Vytila)" },
			},
			nodes: [
				{
					stop_sequence: 1,
					distance_from_origin: 0,
					station: { name: "Bangalore (Kaladipal)" },
				},
				{
					stop_sequence: 2,
					distance_from_origin: 60,
					station: { name: "Hosur" },
				},
				{
					stop_sequence: 3,
					distance_from_origin: 385,
					station: { name: "Palakkad" },
				},
				{
					stop_sequence: 4,
					distance_from_origin: 455,
					station: { name: "Thrissur Bypass" },
				},
				{
					stop_sequence: 5,
					distance_from_origin: 510,
					station: { name: "Aluva Bypass" },
				},
				{
					stop_sequence: 6,
					distance_from_origin: 530,
					station: { name: "Cochin (Vytila)" },
				},
			],
		},
	};

	const matchedTrip = allMockTrips[tripId] || allMockTrips["T-201"];

	return {
		trip: {
			...matchedTrip,
			bus: {
				...matchedTrip.bus,
				bus_name: busObj.bus_name || matchedTrip.bus.bus_name,
				bus_number: busObj.bus_number || matchedTrip.bus.bus_number,
				bus_color: busObj.bus_color || matchedTrip.bus.bus_color,
				category: busObj.category || matchedTrip.bus.category,
				operator: busObj.operator || matchedTrip.bus.operator,
			},
		},
		nodes: matchedTrip.nodes,
	};
};

const TrackingSection = ({ bus, onBack }) => {
	const [activeTrip, setActiveTrip] = useState(null);
	const [nodes, setNodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Parse HH:MM:SS to minutes from midnight
	const parseTimeToMinutes = (timeStr) => {
		if (!timeStr) return 0;
		if (timeStr.includes("AM") || timeStr.includes("PM")) {
			const [time, modifier] = timeStr.split(" ");
			let [hours, minutes] = time.split(":");
			hours = parseInt(hours, 10);
			minutes = parseInt(minutes, 10);
			if (hours === 12) {
				hours = 0;
			}
			if (modifier === "PM") {
				hours += 12;
			}
			return hours * 60 + minutes;
		}

		const parts = timeStr.split(":");
		const hours = parseInt(parts[0], 10);
		const minutes = parseInt(parts[1], 10);
		return hours * 60 + minutes;
	};

	// Format minutes from midnight to 12-hour AM/PM format
	const formatMinutesToTime = (minutes) => {
		const hours = Math.floor(minutes / 60) % 24;
		const mins = Math.floor(minutes % 60);
		const ampm = hours >= 12 ? "PM" : "AM";
		const displayHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${displayHours}:${mins.toString().padStart(2, "0")} ${ampm}`;
	};

	// Fetch Trip & Route nodes
	useEffect(() => {
		const fetchTrackingData = async () => {
			setLoading(true);
			setError(null);

			// Intercept mock trip IDs first to load instant mock tracking
			if (bus && bus.trip_id && String(bus.trip_id).startsWith("T-")) {
				try {
					await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated loading
					const mockResult = getMockTripAndNodes(bus);
					setActiveTrip(mockResult.trip);
					setNodes(mockResult.nodes);
					setLoading(false);
					return;
				} catch (mockErr) {
					console.error("Failed to load mock tracking info:", mockErr);
				}
			}

			try {
				let trip = null;
				if (bus.trip_id) {
					const res = await api.get(`/trips/${bus.trip_id}`);
					trip = res.data || res;
				} else if (bus.id) {
					const res = await api.get(`/trips`, { params: { bus_id: bus.id } });
					const tripsList = res.data || res || [];
					if (tripsList.length > 0) {
						trip = tripsList[0];
					} else {
						throw new Error(
							`No active trips found for bus ${bus.bus_name || bus.bus_number}`,
						);
					}
				} else {
					throw new Error("Invalid bus details passed.");
				}

				setActiveTrip(trip);

				const nodesRes = await api.get(`/routes/${trip.route_id}/nodes`);
				const rawNodes = nodesRes.data || nodesRes || [];
				const sortedNodes = rawNodes.sort(
					(a, b) => a.stop_sequence - b.stop_sequence,
				);
				setNodes(sortedNodes);
			} catch (err) {
				console.error("Failed to load tracking info:", err);
				// Check for mock fallback in case of API failure
				if (bus && (bus.trip_id || bus.id)) {
					console.log("API failed, attempting mock tracking fallback...");
					try {
						const mockResult = getMockTripAndNodes(bus);
						setActiveTrip(mockResult.trip);
						setNodes(mockResult.nodes);
						return;
					} catch (_) {}
				}
				setError(err.message || "Failed to load bus tracking page.");
			} finally {
				setLoading(false);
			}
		};

		fetchTrackingData();
	}, [bus, refreshTrigger]);

	// Perform Time Calculations & Position Bus
	let processedNodes = [];
	let busPositionPercent = 0;
	let activeNodeIndex = 0;
	let lastUpdatedTime = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	let bottomStatusMessage = "Bus is at origin station";
	let delayStatus = "On Time";
	let isDelayed = false;
	let currentSpeed = 0;
	let distanceCovered = 0;
	let totalDistance = 0;
	let currentSegmentProgress = 0;
	let currentSegmentMessage = "";

	if (activeTrip && nodes.length > 0) {
		const depMin = parseTimeToMinutes(activeTrip.departure_time);
		const arrMin = parseTimeToMinutes(activeTrip.arrival_time);
		totalDistance = nodes[nodes.length - 1].distance_from_origin || 1;
		let totalDuration = arrMin - depMin;
		if (totalDuration <= 0) {
			totalDuration += 1440;
		}

		// Read speed directly from trip / bus object (mock default if 0)
		currentSpeed = parseInt(activeTrip.speed_kmh || bus.speed_kmh || "45", 10);

		const now = new Date();
		const currentMinutes = now.getHours() * 60 + now.getMinutes();

		// Delay calculation
		const mockDelayMin = 12; // Standard delay mock
		isDelayed = currentMinutes > depMin + 15; // Assume delayed if trip has progressed
		delayStatus = isDelayed ? `${mockDelayMin}m Late` : "On Time";

		processedNodes = nodes.map((node, i) => {
			const ratio = (node.distance_from_origin || 0) / totalDistance;
			const arrivalMin = depMin + totalDuration * ratio;
			const departureMin =
				arrivalMin + (i === 0 || i === nodes.length - 1 ? 0 : 2);

			const delay = isDelayed ? mockDelayMin : 0;
			const actualArrivalMin = arrivalMin + delay;
			const actualDepartureMin = departureMin + delay;

			return {
				...node,
				planArrivalStr: formatMinutesToTime(arrivalMin),
				planDepartureStr: formatMinutesToTime(departureMin),
				actualArrivalStr: formatMinutesToTime(actualArrivalMin),
				actualDepartureStr: formatMinutesToTime(actualDepartureMin),
				arrivalMinutes: arrivalMin,
				departureMinutes: departureMin,
				actualArrivalMinutes: actualArrivalMin,
				actualDepartureMinutes: actualDepartureMin,
				delayMins: delay,
				platform: (node.stop_sequence % 3) + 1,
			};
		});

		const tripStart = depMin;
		const tripEnd =
			processedNodes[processedNodes.length - 1].actualArrivalMinutes;

		if (currentMinutes <= tripStart) {
			busPositionPercent = 0;
			activeNodeIndex = 0;
			distanceCovered = 0;
			bottomStatusMessage = `Departing from ${processedNodes[0].station.name} at ${processedNodes[0].planDepartureStr}`;
			currentSegmentMessage = `At Origin: ${processedNodes[0].station.name}`;
			currentSegmentProgress = 0;
			currentSpeed = 0;
		} else if (currentMinutes >= tripEnd) {
			busPositionPercent = 100;
			activeNodeIndex = processedNodes.length - 1;
			distanceCovered = totalDistance;
			bottomStatusMessage = `Arrived at ${processedNodes[processedNodes.length - 1].station.name}`;
			currentSegmentMessage = `Trip completed at ${processedNodes[processedNodes.length - 1].station.name}`;
			currentSegmentProgress = 100;
			currentSpeed = 0;
		} else {
			// Find active index
			activeNodeIndex = 0;
			for (let i = 0; i < processedNodes.length; i++) {
				if (
					currentMinutes >= processedNodes[i].arrivalMinutes &&
					currentMinutes <= processedNodes[i].actualDepartureMinutes
				) {
					activeNodeIndex = i;
					break;
				}
				if (
					i < processedNodes.length - 1 &&
					currentMinutes > processedNodes[i].actualDepartureMinutes &&
					currentMinutes < processedNodes[i + 1].actualArrivalMinutes
				) {
					activeNodeIndex = i;
					break;
				}
			}

			const ratio = (currentMinutes - tripStart) / (tripEnd - tripStart);
			busPositionPercent = Math.min(Math.max(ratio * 100, 0), 100);
			distanceCovered = Math.round(totalDistance * (busPositionPercent / 100));

			const nextStop =
				processedNodes[activeNodeIndex + 1] || processedNodes[activeNodeIndex];
			bottomStatusMessage = `Approaching ${nextStop.station.name} • Est. ${nextStop.actualArrivalStr}`;

			const currentStop = processedNodes[activeNodeIndex];
			if (currentStop === nextStop) {
				currentSegmentMessage = `Stopped at ${currentStop.station.name}`;
				currentSegmentProgress = 100;
			} else {
				currentSegmentMessage = `Between ${currentStop.station.name} and ${nextStop.station.name}`;
				const segmentDist =
					nextStop.distance_from_origin - currentStop.distance_from_origin;
				const currentSegmentCovered =
					distanceCovered - currentStop.distance_from_origin;
				currentSegmentProgress = Math.min(
					Math.max(Math.round((currentSegmentCovered / segmentDist) * 100), 0),
					100,
				);
			}
		}
	}

	const handleRefresh = () => {
		setRefreshTrigger((prev) => prev + 1);
	};

	if (loading) {
		return (
			<div className="tracking-container d-flex justify-content-center align-items-center vh-100">
				<div className="text-center">
					<div className="spinner-border text-primary mb-3" role="status" />
					<div className="small text-muted fw-semibold">
						Locating bus live position...
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="tracking-container d-flex justify-content-center align-items-center vh-100 p-4">
				<div className="text-center card border-0 p-4 rounded-4 shadow-sm w-100 max-width-400 bg-white premium-shadow">
					<i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-2"></i>
					<h5 className="fw-bold text-dark mb-2">Tracking Offline</h5>
					<p className="text-muted small mb-4">{error}</p>
					<button
						className="btn btn-primary rounded-pill w-100 py-2 fw-semibold shadow-sm"
						onClick={onBack}
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	const busName = activeTrip?.bus?.bus_name || bus.bus_name || "Yathra Bus";
	const busNumber =
		activeTrip?.bus?.bus_number || bus.bus_number || "KL-XX-0000";
	const busCategory = activeTrip?.bus?.category || bus.category || "Ordinary";
	const busColor = activeTrip?.bus?.bus_color || bus.bus_color || "Blue";
	const operatorName =
		activeTrip?.bus?.operator?.name || bus.operator?.name || "KSRTC";
	const originName = activeTrip?.route?.origin?.name || "Origin";
	const destName = activeTrip?.route?.destination?.name || "Destination";

	return (
		<div className="tracking-container section-fade">
			{/* Top sticky header bar */}
			<div className="tracking-header py-2 px-3">
				<div className="d-flex align-items-center gap-2">
					<button
						className="btn btn-back-tracking text-white p-0 border-0"
						style={{ fontSize: "1.1rem" }}
						onClick={onBack}
						aria-label="Go Back"
					>
						<i className="bi bi-arrow-left"></i>
					</button>
					<div>
						<h6
							className="fw-bold text-white mb-0"
							style={{ fontSize: "0.95rem" }}
						>
							{busNumber} • {busName}
						</h6>
						<span
							className="tracking-title-meta"
							style={{ fontSize: "0.72rem" }}
						>
							{originName} &rarr; {destName}
						</span>
					</div>
				</div>
			</div>

			<div className="dashboard-container px-1 px-sm-3 mt-1">
				{/* 1. Active Segment Info Banner */}
				<div className="card segment-progress-banner border-0 p-2 mb-1">
					<div className="d-flex justify-content-between align-items-center mb-1">
						<span className="segment-title">Current Location</span>
						{currentSpeed > 0 && (
							<span
								className="badge bg-primary text-white rounded-pill px-2 py-0"
								style={{ fontSize: "0.65rem" }}
							>
								MOVING
							</span>
						)}
					</div>
					<div className="segment-stations mb-1">{currentSegmentMessage}</div>
					{currentSpeed > 0 && (
						<div className="segment-progress-bar-container">
							<div
								className="segment-progress-bar-fill"
								style={{ width: `${currentSegmentProgress}%` }}
							></div>
						</div>
					)}
				</div>

				{/* 3. Creative Simple Timeline Card */}
				<div className="card tracking-timeline-card p-3 rounded-3 shadow-sm border-0 bg-white mb-1">
					<div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
						<div className="d-flex align-items-center gap-2">
							<span
								className="fw-bold text-dark"
								style={{ fontSize: "0.88rem" }}
							>
								Live Route Timeline
							</span>
							<span
								className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-0.5"
								style={{ fontSize: "0.62rem" }}
							>
								{processedNodes.length} Stops
							</span>
						</div>
						<span
							className="text-muted fw-semibold"
							style={{ fontSize: "0.68rem" }}
						>
							Est. {totalDistance} km
						</span>
					</div>

					<div className="tracking-timeline-list">
						{processedNodes.map((node, index) => {
							const isFirst = index === 0;
							const isLast = index === processedNodes.length - 1;
							const isPassed =
								index < activeNodeIndex ||
								(index === activeNodeIndex && busPositionPercent >= 100);
							const isActiveStop =
								index === activeNodeIndex &&
								busPositionPercent > 0 &&
								busPositionPercent < 100;

							return (
								<div
									key={node.id || index}
									className={`timeline-row d-flex align-items-stretch position-relative ${
										isPassed ? "row-passed" : ""
									} ${isActiveStop ? "row-active" : ""}`}
								>
									{/* 1. Left Time Column */}
									<div className="timeline-time-col flex-shrink-0 text-end pe-2">
										<span className="fw-bold d-block text-dark time-text">
											{node.planArrivalStr}
										</span>
										{node.delayMins > 0 ? (
											<span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-1.5 py-0.5 rounded-pill delay-badge">
												+{node.delayMins}m
											</span>
										) : (
											<span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-1.5 py-0.5 rounded-pill on-time-badge">
												On Time
											</span>
										)}
									</div>

									{/* 2. Center Creative Timeline Track & Node */}
									<div className="timeline-node-track d-flex flex-column align-items-center position-relative flex-shrink-0">
										{/* Upper connecting line */}
										{!isFirst && (
											<div
												className={`track-segment track-upper ${
													isPassed || isActiveStop
														? "track-passed"
														: "track-pending"
												}`}
											></div>
										)}

										{/* Node Icon Indicator */}
										<div className="node-icon-bubble d-flex align-items-center justify-content-center">
											{isActiveStop ? (
												<div className="active-bus-bubble shadow-sm">
													<i className="bi bi-bus-front-fill text-white"></i>
												</div>
											) : isPassed ? (
												<div className="passed-dot-bubble">
													<i className="bi bi-check-lg text-white"></i>
												</div>
											) : isFirst ? (
												<div className="origin-dot-bubble"></div>
											) : isLast ? (
												<div className="dest-dot-bubble">
													<i className="bi bi-geo-alt-fill text-danger"></i>
												</div>
											) : (
												<div className="pending-dot-bubble"></div>
											)}
										</div>

										{/* Lower connecting line */}
										{!isLast && (
											<div
												className={`track-segment track-lower ${
													isPassed ? "track-passed" : "track-pending"
												}`}
											></div>
										)}
									</div>

									{/* 3. Right Station Details Card */}
									<div className="timeline-details-col flex-grow-1 ps-2 pb-2">
										<div
											className={`station-detail-card p-2 rounded-3 ${
												isActiveStop
													? "active-card bg-primary-subtle border border-primary border-opacity-25"
													: "bg-light bg-opacity-50 border border-light-subtle"
											}`}
										>
											<div className="d-flex align-items-center justify-content-between mb-1">
												<span
													className={`station-title-text fw-bold text-truncate ${
														isActiveStop ? "text-primary" : "text-dark"
													}`}
												>
													{node.station.name}
												</span>
												{isActiveStop && (
													<span className="badge bg-primary text-white rounded-pill px-2 py-0.5 pulse-badge">
														ARRIVING
													</span>
												)}
												{isFirst && !isActiveStop && (
													<span
														className="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill px-1.5 py-0.5"
														style={{ fontSize: "0.6rem" }}
													>
														Origin
													</span>
												)}
												{isLast && !isActiveStop && (
													<span
														className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-1.5 py-0.5"
														style={{ fontSize: "0.6rem" }}
													>
														Destination
													</span>
												)}
											</div>

											<div
												className="d-flex align-items-center gap-2 text-muted"
												style={{ fontSize: "0.68rem" }}
											>
												<span>
													<i className="bi bi-signpost-split me-1 opacity-75"></i>
													{node.distance_from_origin} km
												</span>
												<span className="opacity-50">|</span>
												<span>
													<i className="bi bi-clock me-1 opacity-75"></i>
													Dep: {node.planDepartureStr}
												</span>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Creative Burger Ad Poster Card */}
				<div className="">
					<TrackingBurgerPosterCard />
				</div>
			</div>

			{/* Footer bar */}
			<div className="tracking-footer-bar">
				<div>
					<div className="footer-status-text">{bottomStatusMessage}</div>
					<div className="footer-update-text">Updated {lastUpdatedTime}</div>
				</div>
				<button
					className="btn-refresh-circle shadow-sm"
					onClick={handleRefresh}
					title="Refresh Live Location"
				>
					<i className="bi bi-arrow-clockwise"></i>
				</button>
			</div>
		</div>
	);
};

export default TrackingSection;
