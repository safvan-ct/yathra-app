import React, { useState } from "react";
import { useContributions } from "../../../hooks/useContributions";

const StopContribution = ({ goBack, routes, onSuccess }) => {
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
		const saved = await submitContribution("stop", form);
		if (saved) {
			setForm({});
			onSuccess("stop");
		}
	};

	return (
		<div id="form-stop" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-dot me-2 text-primary"></i>Intermediate Stop
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-3 form-floating">
						<select
							className="form-select"
							id="routeSelect"
							name="route_id"
							value={form.route_id || ""}
							onChange={handleChange}
							required
							disabled={loading || success}
						>
							<option value="">Choose existing route...</option>
							{routes?.map((r, i) => (
								<option key={r.id || i} value={r.id || r.name}>
									{r.name || r.label || `Route ${r.id}`}
								</option>
							))}
						</select>
						<label htmlFor="routeSelect" className="text-muted">
							Select Route
						</label>
					</div>
					<div className="row mb-3 g-2">
						<div className="col-12 col-md-6">
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="beforeStop"
									name="before_stop"
									value={form.before_stop || ""}
									onChange={handleChange}
									placeholder="Prev Stop"
									disabled={loading || success}
								/>
								<label htmlFor="beforeStop" className="text-muted">
									Before Stop
								</label>
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="afterStop"
									name="after_stop"
									value={form.after_stop || ""}
									onChange={handleChange}
									placeholder="Next Stop"
									disabled={loading || success}
								/>
								<label htmlFor="afterStop" className="text-muted">
									After Stop
								</label>
							</div>
						</div>
					</div>
					<div className="mb-4 form-floating">
						<input
							type="number"
							className="form-control"
							id="distOrigin"
							name="distance"
							value={form.distance || ""}
							onChange={handleChange}
							required
							placeholder="Distance"
							disabled={loading || success}
						/>
						<label htmlFor="distOrigin" className="text-muted">
							Distance from Origin (KM)
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
							"SUBMIT STOP"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default StopContribution;
