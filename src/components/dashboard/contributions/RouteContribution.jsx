import React, { useState } from "react";
import { useContributions } from "../../../hooks/useContributions";

const RouteContribution = ({ goBack, onSuccess }) => {
	const [form, setForm] = useState({});
	const {
		submitLoading: loading,
		error,
		success,
		submitContribution,
	} = useContributions();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const saved = await submitContribution("route", form);
		if (saved) {
			setForm({});
			onSuccess("route");
		}
	};

	return (
		<div id="form-route" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-signpost me-2 text-primary"></i>Suggest Route
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="row mb-3 g-2">
						<div className="col-12 col-md-6">
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="originInput"
									name="origin"
									value={form.origin || ""}
									onChange={handleChange}
									placeholder="e.g. Kochi"
									required
									disabled={loading || success}
								/>
								<label htmlFor="originInput" className="text-muted">
									Origin
								</label>
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="destInput"
									name="destination"
									value={form.destination || ""}
									onChange={handleChange}
									placeholder="e.g. Trivandrum"
									required
									disabled={loading || success}
								/>
								<label htmlFor="destInput" className="text-muted">
									Destination
								</label>
							</div>
						</div>
					</div>
					<div className="mb-3 form-floating">
						<textarea
							className="form-control"
							id="viaInput"
							name="via"
							value={form.via || ""}
							onChange={handleChange}
							placeholder="e.g. Via NH66, Alappuzha, Kollam"
							style={{ height: "80px" }}
							disabled={loading || success}
						></textarea>
						<label htmlFor="viaInput" className="text-muted">
							Path Signature (via)
						</label>
					</div>
					<div className="mb-4 form-floating">
						<input
							type="number"
							className="form-control"
							id="distInput"
							name="distance"
							value={form.distance || ""}
							onChange={handleChange}
							placeholder="200"
							disabled={loading || success}
						/>
						<label htmlFor="distInput" className="text-muted">
							Distance (KM)
						</label>
					</div>
					<button
						type="submit"
						className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center"
						disabled={loading || success}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>{" "}
								Submitting...
							</>
						) : (
							"SUBMIT ROUTE"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default RouteContribution;
