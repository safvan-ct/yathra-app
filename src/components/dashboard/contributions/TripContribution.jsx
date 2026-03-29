import React, { useState } from "react";
import { useContributions } from "../../../hooks/useContributions";

const TripContribution = ({ goBack, routes, buses, onSuccess }) => {
	const [form, setForm] = useState({});
	const {
		submitLoading: loading,
		error,
		success,
		submitContribution,
	} = useContributions();

	const handleChange = (e) => {
		const { name, value, type: inputType, checked } = e.target;
		if (inputType === "checkbox") {
			setForm((prev) => {
				const currentArr = prev[name] || [];
				if (checked) {
					return { ...prev, [name]: [...currentArr, value] };
				} else {
					return {
						...prev,
						[name]: currentArr.filter((item) => item !== value),
					};
				}
			});
		} else {
			setForm((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const saved = await submitContribution("trip", form);
		if (saved) {
			setForm({});
			onSuccess("trip");
		}
	};

	const operatingDays = form.operating_days || [];

	return (
		<div id="form-trip" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-calendar-event me-2 text-primary"></i>
					Suggest Trip
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
								<select
									className="form-select"
									id="busSelect"
									name="bus_id"
									value={form.bus_id || ""}
									onChange={handleChange}
									required
									disabled={loading || success}
								>
									<option value="">Choose bus...</option>
									{buses?.map((b) => (
										<option key={b.id} value={b.id || b.name}>
											{b.name || b.bus_name || `Bus ${b.id}`}
										</option>
									))}
								</select>
								<label htmlFor="busSelect" className="text-muted">
									Select Bus
								</label>
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-floating">
								<select
									className="form-select"
									id="routeSelectTrip"
									name="route_id"
									value={form.route_id || ""}
									onChange={handleChange}
									required
									disabled={loading || success}
								>
									<option value="">Choose route...</option>
									{routes?.map((r) => (
										<option key={r.id} value={r.id || r.name}>
											{r.name || r.label || `Route ${r.id}`}
										</option>
									))}
								</select>
								<label htmlFor="routeSelectTrip" className="text-muted">
									Select Route
								</label>
							</div>
						</div>
					</div>
					<div className="row mb-3 g-2">
						<div className="col-6">
							<div className="form-floating">
								<input
									type="time"
									className="form-control"
									id="depTime"
									name="dep_time"
									value={form.dep_time || ""}
									onChange={handleChange}
									required
									disabled={loading || success}
								/>
								<label htmlFor="depTime" className="text-muted">
									Dep. Time
								</label>
							</div>
						</div>
						<div className="col-6">
							<div className="form-floating">
								<input
									type="time"
									className="form-control"
									id="arrTime"
									name="arr_time"
									value={form.arr_time || ""}
									onChange={handleChange}
									required
									disabled={loading || success}
								/>
								<label htmlFor="arrTime" className="text-muted">
									Arr. Time
								</label>
							</div>
						</div>
					</div>
					<div className="mb-4">
						<label className="form-label d-block text-muted small fw-bold mb-2">
							Operating Days
						</label>
						<div className="d-flex flex-wrap gap-2">
							<div className="form-check custom-check">
								<input
									className="form-check-input"
									type="checkbox"
									id="checkDaily"
									name="operating_days"
									value="daily"
									checked={operatingDays.includes("daily")}
									onChange={handleChange}
									disabled={loading || success}
								/>
								<label className="form-check-label small" htmlFor="checkDaily">
									Daily
								</label>
							</div>
							<div className="form-check custom-check">
								<input
									className="form-check-input"
									type="checkbox"
									id="checkMonFri"
									name="operating_days"
									value="mon-fri"
									checked={operatingDays.includes("mon-fri")}
									onChange={handleChange}
									disabled={loading || success}
								/>
								<label className="form-check-label small" htmlFor="checkMonFri">
									Mon-Fri
								</label>
							</div>
						</div>
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
							"SUBMIT TRIP"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default TripContribution;
