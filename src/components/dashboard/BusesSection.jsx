import React, { useEffect } from "react";
import { useStations } from "../../hooks/useStations";

const BusesSection = () => {
	const { routes, loading, error, getRoutes } = useStations();

	useEffect(() => {
		getRoutes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="section-buses" className="app-section active">
			<div className="dashboard-container py-4 mb-5">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h3 className="fw-800 mb-0">Explore Routes</h3>
					<span className="badge bg-white text-primary shadow-sm px-3 py-2 rounded-pill">
						{loading ? "..." : `${routes.length} Active Routes`}
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

					{!loading && routes.length === 0 && !error && (
						<div className="col-12 text-center py-5">
							<i className="bi bi-map text-muted fs-1 mt-3"></i>
							<p className="text-muted mt-2 fw-bold">No routes available</p>
						</div>
					)}

					{!loading &&
						routes.map((route, idx) => (
							<div key={idx} className="col-md-6 col-lg-4">
								<div className="card border-0 shadow-sm rounded-4 h-100">
									<div className="card-body p-4">
										<div className="d-flex justify-content-between mb-3">
											<span className="badge bg-primary bg-opacity-10 text-primary px-3">
												{route.badge_name || `ROUTE ${route.id || idx + 101}`}
											</span>
											<i className="bi bi-star text-warning"></i>
										</div>
										<h5 className="fw-bold mb-1">
											{route.start_point || "City"}{" "}
											<i className="bi bi-arrow-right small mx-1 text-muted"></i>{" "}
											{route.end_point || route.name || "Destination"}
										</h5>
										<p className="text-muted small mb-3">
											{route.via || "Direct route"}
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
													{route.first_bus || "05:30 AM"}
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
													{route.last_bus || "10:15 PM"}
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
