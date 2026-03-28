import React, { useEffect } from "react";
import { useContributions } from "../../../src/hooks/useContributions";

const HistorySection = ({ setActiveSection }) => {
	const { history, loading, error, fetchHistory } = useContributions();

	useEffect(() => {
		fetchHistory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div id="section-history" className="app-section active">
			<div className="dashboard-container py-4 mb-5">
				<div className="row">
					<div className="col-lg-8 mx-auto">
						<div className="card border-0 shadow-sm rounded-4 overflow-hidden">
							<div className="card-header bg-white border-0 p-4 pb-0">
								<h4 className="fw-800 mb-0">My Contributions</h4>
								<p className="text-muted small">
									Timeline of bus timings you've shared
								</p>
							</div>

							{loading && (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							)}

							{!loading && error && (
								<div className="card-body p-4">
									<div className="alert alert-danger py-2 small mb-0">
										{error}
									</div>
								</div>
							)}

							{!loading && history.length === 0 && !error && (
								<div className="text-center py-5">
									<i className="bi bi-clock-history text-muted fs-1 mt-3"></i>
									<p className="text-muted mt-2 fw-bold">
										No contributions yet. Start sharing!
									</p>
								</div>
							)}

							{!loading && history.length > 0 && (
								<div className="card-body p-0">
									<div className="list-group list-group-flush">
										{history.map((item, idx) => (
											<div
												key={idx}
												className="list-group-item p-4 border-light"
											>
												<div className="d-flex justify-content-between align-items-start mb-2">
													<div>
														<h6 className="fw-bold mb-0">
															{item.bus_name || item.route_name || "Bus Timing"}
														</h6>
														<small className="text-muted">
															Route: {item.route || "Unknown"}
														</small>
													</div>
													<span
														className={`badge rounded-pill ${
															item.status === "Approved" ||
															item.status === "approved"
																? "bg-success-subtle text-success border-success-subtle"
																: "bg-warning-subtle text-warning border-warning-subtle"
														} border px-3`}
													>
														{item.status || "Pending"}
													</span>
												</div>
												<div className="d-flex align-items-center gap-3 mt-2">
													<div className="small">
														<i className="bi bi-clock me-1"></i>{" "}
														{item.time || item.created_at || "08:30 AM"}
													</div>
													{(item.status === "Approved" ||
														item.status === "approved") && (
														<div className="small text-primary fw-bold">
															+{item.points || 50} Points
														</div>
													)}
													<div className="small text-muted ms-auto">
														{item.time_ago || "recently"}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							<div className="card-footer bg-light border-0 text-center p-3">
								<button
									className="btn btn-link btn-sm text-decoration-none fw-bold"
									onClick={() => setActiveSection("contribute")}
								>
									ADD NEW ENTRY
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HistorySection;
