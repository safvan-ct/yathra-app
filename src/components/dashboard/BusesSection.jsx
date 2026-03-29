import React, { useEffect } from "react";
import { useBuses } from "../../hooks/useBuses";

const BusesSection = () => {
	const { buses = [], loading, error, searchBuses, getAllBuses } = useBuses();
	
	useEffect(() => {
		getAllBuses();
	}, []);

	return (
		<div id="section-buses" className="app-section active">
			<div className="dashboard-container py-4 mb-5">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h3 className="fw-800 mb-0">Explore Routes</h3>
					<span className="badge bg-white text-primary shadow-sm px-3 py-2 rounded-pill">
						{loading ? "..." : `${buses?.length} Active Routes`}
					</span>
				</div>

				{error && (
					<div className="alert alert-danger py-2 small mb-4">{error}</div>
				)}

				<div className="row g-3">
					{loading && (
						<div className="col-12 text-center py-5">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					)}

					{!loading && buses?.length === 0 && !error && (
						<div className="col-12 text-center py-5">
							<i className="bi bi-map text-muted fs-1 mt-3"></i>
							<p className="text-muted mt-2 fw-bold">No buses available</p>
						</div>
					)}

					{!loading &&
						buses?.map((bus, idx) => (
							<div key={idx} className="col-md-6 col-lg-4">
								<div className="card border-0 shadow-sm rounded-4 h-100">
									<div className="card-body p-4">
										<div className="d-flex justify-content-between mb-3">
											<span className="badge bg-primary bg-opacity-10 text-primary px-3">
												{bus.category || `ROUTE ${bus.id || idx + 101}`}
											</span>
											<i className="bi bi-star text-warning"></i>
										</div>
										<h5 className="fw-bold mb-1">
											{bus.bus_number || "City"}{" "}
											<i className="bi bi-arrow-right small mx-1 text-muted"></i>{" "}
											{bus.bus_number || bus.bus_name || "Destination"}
										</h5>
										<p className="text-muted small mb-3">
											{bus.bus_number || "Direct route"}
										</p>
										<div className="d-flex gap-2">
											<div className="flex-grow-1 bg-light rounded-3 p-2 text-center">
												<small
													className="text-muted d-block"
													style={{ fontSize: "0.65rem" }}
												>
													FIRST BUS
												</small>
												<span className="fw-bold">
													{bus.bus_number || "05:30 AM"}
												</span>
											</div>
											<div className="flex-grow-1 bg-light rounded-3 p-2 text-center">
												<small
													className="text-muted d-block"
													style={{ fontSize: "0.65rem" }}
												>
													LAST BUS
												</small>
												<span className="fw-bold">
													{bus.bus_number || "10:15 PM"}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default BusesSection;
