import React, { useEffect, useState } from "react";
import { useStationSearch } from "../../buses/hooks/useStationSearch";

const StopsSection = () => {
	const { searchStations, stationResults, isSearching, error } = useStationSearch();
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		// Load default stations
		searchStations("");
	}, [searchStations]);

	const handleSearchChange = (e) => {
		const val = e.target.value;
		setSearchQuery(val);
		searchStations(val);
	};

	return (
		<div id="section-stops" className="app-section active section-fade">
			<div className="dashboard-container py-3 mb-5">
				{/* Header */}
				<div className="text-center mb-4">
					<h3 className="fw-bold text-dark">Bus Stops</h3>
					<p className="text-muted small">Search and explore available stops across the network</p>
				</div>

				{/* Search Bar */}
				<div className="card border-0 rounded-4 shadow-sm p-3 mb-4">
					<div className="input-group">
						<span className="input-group-text bg-light border-0 rounded-start-3">
							<i className="bi bi-search text-muted"></i>
						</span>
						<input
							type="text"
							className="form-control bg-light border-0 rounded-end-3 py-2 fs-6"
							placeholder="Type stop or station name..."
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</div>
					{error && <div className="text-danger small mt-2 px-2">{error}</div>}
				</div>

				{/* Stops List */}
				<div className="stops-list d-flex flex-column gap-3">
					{isSearching ? (
						<div className="text-center py-5">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : stationResults && stationResults.length > 0 ? (
						stationResults.map((stop) => (
							<div
								key={stop.id}
								className="card border-0 rounded-4 shadow-sm p-3 stop-card position-relative overflow-hidden"
								style={{
									transition: "transform 0.2s, box-shadow 0.2s",
									cursor: "pointer",
									background: "white"
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.02)";
								}}
							>
								<div className="d-flex align-items-center gap-3">
									<div
										className="stop-icon-wrapper rounded-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
										style={{ width: "48px", height: "48px", flexShrink: 0 }}
									>
										<i className="bi bi-geo-alt-fill fs-5"></i>
									</div>
									<div className="flex-grow-1">
										<h5 className="fw-bold mb-1 text-dark fs-6">{stop.name}</h5>
										{stop.display_name && (
											<p className="text-muted small mb-0">{stop.display_name}</p>
										)}
									</div>
									<div className="text-end">
										<span className="badge bg-light text-secondary rounded-pill border px-2 py-1">
											ID: {stop.id}
										</span>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-5 card border-0 rounded-4 shadow-sm bg-white p-4">
							<i className="bi bi-geo-alt text-muted fs-1 mb-2"></i>
							<h6 className="fw-bold text-secondary">No Stops Found</h6>
							<p className="text-muted small mb-0">Try searching for a different stop name</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StopsSection;
