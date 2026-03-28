import React, { useState } from "react";
import api from "../../services/api";

const ContributeSection = () => {
	const [formData, setFormData] = useState({
		routeName: "",
		fromTime: "",
		toTime: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		// Basic validation
		if (!formData.routeName || !formData.fromTime || !formData.toTime) {
			setError("All fields are required.");
			return;
		}

		setLoading(true);

		try {
			await api.post("/contribute", {
				route_name: formData.routeName,
				from_time: formData.fromTime,
				to_time: formData.toTime,
			});
			setSuccess(true);
			setFormData({ routeName: "", fromTime: "", toTime: "" });
		} catch (err) {
			console.error("Failed to submit contribution", err);
			setError(err.message || "Failed to submit contribution.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div id="section-contribute" className="app-section active">
			<div className="dashboard-container py-5">
				<div className="row justify-content-center">
					<div className="col-md-8">
						<div className="card border-0 shadow-lg rounded-4 overflow-hidden">
							<div className="row g-0">
								<div className="col-md-5 bg-primary d-none d-md-flex align-items-center justify-content-center text-white p-5">
									<div className="text-center">
										<i
											className="bi bi-cloud-upload"
											style={{ fontSize: "5rem" }}
										></i>
										<h3 className="fw-bold mt-3">Be a Hero</h3>
										<p className="opacity-75">
											Help thousands of commuters by sharing bus times.
										</p>
									</div>
								</div>
								<div className="col-md-7 p-4 p-md-5 bg-white">
									<h3 className="fw-bold mb-4">Add Bus Timing</h3>

									{error && (
										<div className="alert alert-danger py-2 small mb-3">
											{error}
										</div>
									)}

									{success && (
										<div className="alert alert-success py-2 small mb-3">
											Contribution submitted successfully! Thank you.
										</div>
									)}

									<form onSubmit={handleSubmit}>
										<div className="mb-3">
											<label className="small fw-bold text-muted mb-1">
												Route / Bus Name
											</label>
											<input
												type="text"
												name="routeName"
												className="form-control form-control-lg bg-light border-0"
												placeholder="e.g. City Express"
												value={formData.routeName}
												onChange={handleChange}
												disabled={loading}
											/>
										</div>
										<div className="row g-3 mb-4">
											<div className="col-6">
												<label className="small fw-bold text-muted mb-1">
													From Time
												</label>
												<input
													type="time"
													name="fromTime"
													className="form-control form-control-lg bg-light border-0"
													value={formData.fromTime}
													onChange={handleChange}
													disabled={loading}
												/>
											</div>
											<div className="col-6">
												<label className="small fw-bold text-muted mb-1">
													To Time
												</label>
												<input
													type="time"
													name="toTime"
													className="form-control form-control-lg bg-light border-0"
													value={formData.toTime}
													onChange={handleChange}
													disabled={loading}
												/>
											</div>
										</div>
										<button
											type="submit"
											className="btn btn-primary w-100 py-3 fw-bold rounded-3"
											disabled={loading}
										>
											{loading ? (
												<>
													<span
														className="spinner-border spinner-border-sm me-2"
														role="status"
														aria-hidden="true"
													></span>
													SUBMITTING...
												</>
											) : (
												"SUBMIT CONTRIBUTION"
											)}
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContributeSection;
