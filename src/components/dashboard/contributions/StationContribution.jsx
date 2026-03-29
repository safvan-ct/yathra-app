import React, { useState } from "react";
import { useContributions } from "../../../hooks/useContributions";

const StationContribution = ({ goBack, onSuccess }) => {
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
		const saved = await submitContribution("station", form);
		if (saved) {
			setForm({});
			onSuccess("station");
		}
	};

	return (
		<div id="form-station" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-geo-alt me-2 text-primary"></i>Suggest Station
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="row mb-3 g-2">
						<div className="col-6">
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="stateInput"
									name="state"
									value={form.state || "Kerala"}
									onChange={handleChange}
									required
									disabled={loading || success}
									placeholder="State"
								/>
								<label htmlFor="stateInput" className="text-muted">
									State
								</label>
							</div>
						</div>
						<div className="col-6">
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="districtInput"
									name="district"
									value={form.district || ""}
									onChange={handleChange}
									placeholder="e.g. Ernakulam"
									required
									disabled={loading || success}
								/>
								<label htmlFor="districtInput" className="text-muted">
									District
								</label>
							</div>
						</div>
					</div>
					<div className="mb-3 form-floating">
						<input
							type="text"
							className="form-control"
							id="cityInput"
							name="city"
							value={form.city || ""}
							onChange={handleChange}
							placeholder="e.g. Aluva"
							required
							disabled={loading || success}
						/>
						<label htmlFor="cityInput" className="text-muted">
							City
						</label>
					</div>
					<div className="mb-4 form-floating">
						<input
							type="text"
							className="form-control"
							id="stationName"
							name="name"
							value={form.name || ""}
							onChange={handleChange}
							placeholder="e.g. KSRTC Bus Terminal"
							required
							disabled={loading || success}
						/>
						<label htmlFor="stationName" className="text-muted">
							Station Name
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
							"SUBMIT STATION"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default StationContribution;
