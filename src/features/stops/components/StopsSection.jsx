import React, { useEffect, useState } from "react";
import { useStationSearch } from "../../buses/hooks/useStationSearch";

const StopsSection = ({ onStopClick }) => {
	const { searchStations, stationResults, isSearching, error } =
		useStationSearch();
	const [searchQuery, setSearchQuery] = useState("");
	const [recentStops, setRecentStops] = useState(() => {
		try {
			const saved = localStorage.getItem("yathra_recent_stops");
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		// Load default stations
		searchStations("");
	}, [searchStations]);

	const handleSearchChange = (e) => {
		const val = e.target.value;
		setSearchQuery(val);
		searchStations(val);
	};

	const handleStopSelection = (stop) => {
		try {
			const saved = localStorage.getItem("yathra_recent_stops");
			let recent = saved ? JSON.parse(saved) : [];

			// Filter out duplicates to bring clicked stop to the front
			recent = recent.filter((s) => String(s.id) !== String(stop.id));
			recent.unshift(stop);

			// Keep only the 10 most recent unique stops
			const updated = recent.slice(0, 10);
			localStorage.setItem("yathra_recent_stops", JSON.stringify(updated));
			setRecentStops(updated);
		} catch (err) {
			console.error("Failed to save recent stop:", err);
		}

		console.log("Navigating to stop timings for:", stop);
		if (onStopClick) {
			onStopClick(stop);
		} else {
			console.warn("onStopClick prop is undefined in StopsSection!");
		}
	};

	return (
		<div id="section-stops" className="app-section active section-fade">
			<div className="dashboard-container px-1 px-sm-3 mt-1">
				{/* Search Bar */}
				<div className="card border-0 rounded-4 shadow-sm p-2 mb-2 bg-white">
					<div className="input-group">
						<span className="input-group-text bg-light border-0 rounded-start-3 py-1 px-2">
							<i
								className="bi bi-search text-primary opacity-75"
								style={{ fontSize: "13px" }}
							></i>
						</span>
						<input
							type="text"
							className="form-control bg-light border-0 rounded-end-3 py-1 px-2"
							style={{ fontSize: "0.85rem", minHeight: "36px" }}
							placeholder="Type stop or station name..."
							value={searchQuery}
							onChange={handleSearchChange}
						/>
						{searchQuery && (
							<button
								className="btn bg-light border-0 text-muted p-1"
								onClick={() => {
									setSearchQuery("");
									searchStations("");
								}}
							>
								<i
									className="bi bi-x-circle-fill opacity-50"
									style={{ fontSize: "13px" }}
								></i>
							</button>
						)}
					</div>
					{error && (
						<div
							className="text-danger small mt-1 px-1"
							style={{ fontSize: "11px" }}
						>
							{error}
						</div>
					)}
				</div>

				{/* Header */}
				<div className="d-flex justify-content-between align-items-center mb-2 px-1">
					<div>
						<h6
							className="fw-bold text-dark mb-0"
							style={{ fontSize: "0.95rem" }}
						>
							Bus Stops
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>
							Search and explore transit network stops
						</p>
					</div>
					<span
						className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 rounded-pill"
						style={{ fontSize: "0.68rem" }}
					>
						{stationResults ? `${stationResults.length} Stops` : "Stops"}
					</span>
				</div>

				{/* Recent Stops Section */}
				{recentStops.length > 0 && !searchQuery && (
					<div className="mb-2">
						<div className="d-flex justify-content-between align-items-center mb-1 px-1">
							<span
								className="fw-bold text-dark d-flex align-items-center gap-1"
								style={{ fontSize: "0.78rem" }}
							>
								<i
									className="bi bi-clock-history text-primary"
									style={{ fontSize: "12px" }}
								></i>
								Recent Stops
							</span>
							<button
								className="btn btn-link btn-sm text-muted text-decoration-none p-0 fw-semibold"
								style={{ fontSize: "0.72rem" }}
								onClick={() => {
									try {
										localStorage.removeItem("yathra_recent_stops");
										setRecentStops([]);
									} catch (_) {}
								}}
							>
								Clear All
							</button>
						</div>

						{/* Horizontal scrolling recent stops */}
						<div
							className="d-flex gap-2 overflow-x-auto pb-1 px-1"
							style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
						>
							{recentStops.map((stop) => (
								<div
									key={`recent-${stop.id}`}
									className="card border-0 rounded-3 shadow-sm p-2 recent-stop-card d-flex align-items-center gap-2 flex-shrink-0"
									style={{
										minWidth: "140px",
										maxWidth: "180px",
										cursor: "pointer",
										background: "white",
										border: "1px solid #eef2f6",
										transition: "transform 0.2s, box-shadow 0.2s",
									}}
									onClick={() => handleStopSelection(stop)}
								>
									<div className="d-flex align-items-center gap-2 w-100">
										<div
											className="rounded-2 d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
											style={{
												width: "28px",
												height: "28px",
												flexShrink: 0,
												fontSize: "0.85rem",
											}}
										>
											<i className="bi bi-geo-alt-fill"></i>
										</div>
										<div className="flex-grow-1 min-w-0">
											<h6
												className="fw-bold mb-0 text-dark text-truncate"
												style={{ fontSize: "0.78rem" }}
											>
												{stop.name}
											</h6>
											{stop.display_name && (
												<small
													className="text-muted d-block text-truncate"
													style={{ fontSize: "0.65rem" }}
												>
													{stop.display_name}
												</small>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Available Stops Title */}
				{!searchQuery && recentStops.length > 0 && (
					<div
						className="fw-bold text-secondary mb-1 px-1"
						style={{ fontSize: "0.75rem" }}
					>
						All Stops
					</div>
				)}

				{/* Stops List */}
				<div className="stops-list d-flex flex-column gap-1">
					{isSearching ? (
						<div className="text-center py-4">
							<div
								className="spinner-border spinner-border-sm text-primary"
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : stationResults && stationResults.length > 0 ? (
						stationResults.map((stop) => (
							<div
								key={stop.id}
								className="card border-0 rounded-3 shadow-sm p-2 stop-card position-relative overflow-hidden mb-1"
								style={{
									transition: "transform 0.15s, box-shadow 0.15s",
									cursor: "pointer",
									background: "white",
									border: "1px solid #eef2f6",
								}}
								onClick={() => handleStopSelection(stop)}
							>
								<div className="d-flex align-items-center gap-2">
									<div
										className="stop-icon-wrapper rounded-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
										style={{
											width: "36px",
											height: "36px",
											flexShrink: 0,
											fontSize: "1.05rem",
										}}
									>
										<i className="bi bi-geo-alt-fill"></i>
									</div>
									<div className="flex-grow-1 min-w-0">
										<h6
											className="fw-bold mb-0 text-dark text-truncate"
											style={{ fontSize: "0.88rem" }}
										>
											{stop.name}
										</h6>
										{stop.display_name && (
											<p
												className="text-muted mb-0 text-truncate"
												style={{ fontSize: "0.7rem" }}
											>
												{stop.display_name}
											</p>
										)}
									</div>
									<div className="text-end flex-shrink-0">
										<span
											className="badge bg-light text-secondary rounded-pill border px-2 py-1"
											style={{ fontSize: "0.68rem" }}
										>
											ID: {stop.id}
										</span>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-4 card border-0 rounded-4 shadow-sm bg-white p-3">
							<i className="bi bi-geo-alt text-muted fs-1 mb-2"></i>
							<h6 className="fw-bold text-secondary">No Stops Found</h6>
							<p className="text-muted small mb-0">
								Try searching for a different stop name
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StopsSection;
