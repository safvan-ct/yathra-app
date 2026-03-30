import React, { useState } from "react";
import { useContributions } from "../../../hooks/useContributions";

const BusContribution = ({ goBack, onSuccess }) => {
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
		const saved = await submitContribution("bus", form);
		if (saved) {
			setForm({});
			onSuccess("bus");
		}
	};

	return (
		<div id="form-bus" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-bus-front me-2 text-primary"></i>Suggest Bus
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							id="busName"
							name="bus_name"
							value={form.bus_name || ""}
							onChange={handleChange}
							placeholder="e.g. Yathra, KSRTC, etc."
							required
							disabled={loading || success}
						/>
						{/* <label htmlFor="busName" className="text-muted">
							Bus Name
						</label> */}
					</div>
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							id="busNumber"
							name="bus_number"
							value={form.bus_number || ""}
							onChange={handleChange}
							placeholder="e.g. KL 15 A 1234"
							required
							disabled={loading || success}
						/>
						{/* <label htmlFor="busNumber" className="text-muted">
							Bus Number
						</label> */}
					</div>
					<div className="row mb-3 g-2">
						<div className="col-12 col-md-6">
							<div className="form-floating">
								<select
									className="form-select"
									id="busColor"
									name="bus_color"
									value={form.bus_color || "Blue"}
									onChange={handleChange}
									disabled={loading || success}
								>
									<option value="White">White</option>
									<option value="Blue">Blue</option>
									<option value="Green">Green</option>
									<option value="Red">Red</option>
								</select>
								<label htmlFor="busColor" className="text-muted">
									Bus Color
								</label>
							</div>
						</div>

						<div className="col-12 col-md-6">
							<div className="form-floating">
								<select
									className="form-select"
									id="busCategory"
									name="bus_category"
									value={form.bus_category || "Ordinary"}
									onChange={handleChange}
									disabled={loading || success}
								>
									<option value="Ordinary">Ordinary</option>
									<option value="Sleeper">Sleeper</option>
									<option value="Seater">Seater</option>
									<option value="AC">AC</option>
								</select>
								<label htmlFor="busCategory" className="text-muted">
									Bus Category
								</label>
							</div>
						</div>

						<div className="col-12 col-md-6">
							<div className="form-floating">
								<select
									className="form-select"
									id="busType"
									name="operator_type"
									value={form.operator_type || "Private"}
									onChange={handleChange}
									disabled={loading || success}
								>
									<option value="Private">Private</option>
									<option value="Government">Government</option>
								</select>
								<label htmlFor="busType" className="text-muted">
									Sector
								</label>
							</div>
						</div>
					</div>
					<button
						type="submit"
						className="btn btn-primary w-100 py-3 fw-bold rounded-3 mt-2 shadow-sm d-flex align-items-center justify-content-center"
						disabled={loading || success}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>{" "}
								Submitting...
							</>
						) : (
							"SUBMIT BUS"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default BusContribution;
