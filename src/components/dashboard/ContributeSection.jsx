import React, { useState, useEffect } from "react";
import { useStations } from "../../hooks/useStations";
import { useBuses } from "../../../src/hooks/useBuses";
import { useContributions } from "../../../src/hooks/useContributions";

const ContributeSection = () => {
	const [type, setType] = useState(null); // 'bus', 'station', 'route', 'stop', 'trip'
	const [form, setForm] = useState({});

	const { routes, stations, loadAllDependencies } = useStations();
	const { buses, getAllBuses } = useBuses();
	const {
		submitLoading: loading,
		error,
		success,
		setSuccess,
		setError,
		submitContribution,
	} = useContributions();

	useEffect(() => {
		loadAllDependencies();
		getAllBuses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const switchContribution = (selectedType) => {
		setType(selectedType);
		setForm({});
		setError("");
		setSuccess(false);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const goBackToMenu = () => {
		setType(null);
		setForm({});
		setError("");
		setSuccess(false);
	};

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
		const saved = await submitContribution(type, form);
		if (saved) {
			setForm({});
			setTimeout(() => {
				goBackToMenu();
			}, 2000);
		}
	};

	const renderMenu = () => (
		<div id="contribution-menu" className="section-fade active mt-3">
			<div className="row g-3">
				<div className="col-6 col-md-4">
					<div
						className="card contribution-card menu-item-card p-3"
						onClick={() => switchContribution("bus")}
					>
						<div className="icon-box">
							<i className="bi bi-bus-front"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Bus</h6>
						<p className="text-muted small mb-0">Add bus names or types</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card contribution-card menu-item-card p-3"
						onClick={() => switchContribution("station")}
					>
						<div className="icon-box">
							<i className="bi bi-geo-alt"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Station</h6>
						<p className="text-muted small mb-0">Main hubs or terminals</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card contribution-card menu-item-card p-3"
						onClick={() => switchContribution("route")}
					>
						<div className="icon-box">
							<i className="bi bi-signpost"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Route</h6>
						<p className="text-muted small mb-0">Path between cities</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card contribution-card menu-item-card p-3"
						onClick={() => switchContribution("stop")}
					>
						<div className="icon-box">
							<i className="bi bi-dot"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Stop</h6>
						<p className="text-muted small mb-0">Intermediate pick-ups</p>
					</div>
				</div>
				<div className="col-6 col-md-4">
					<div
						className="card contribution-card menu-item-card p-3"
						onClick={() => switchContribution("trip")}
					>
						<div className="icon-box">
							<i className="bi bi-calendar-event"></i>
						</div>
						<h6 className="fw-bold mb-1">Suggest Trip</h6>
						<p className="text-muted small mb-0">Timing & schedules</p>
					</div>
				</div>
			</div>
		</div>
	);

	const renderForm = () => {
		switch (type) {
			case "bus":
				return (
					<div id="form-bus" className="contribution-form">
						<div className="card contribution-card p-4">
							<h4 className="fw-bold mb-4">
								<i className="bi bi-bus-front me-2 text-primary"></i>Suggest Bus
							</h4>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label className="form-label">Bus Name</label>
									<input
										type="text"
										className="form-control"
										name="name"
										value={form.name || ""}
										onChange={handleChange}
										placeholder="e.g. Kallada, KSRTC Minnal"
										required
										disabled={loading}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Bus Number (Optional)</label>
									<input
										type="text"
										className="form-control"
										name="number"
										value={form.number || ""}
										onChange={handleChange}
										placeholder="e.g. KL-15-A-1234"
										disabled={loading}
									/>
								</div>
								<div className="row mb-3">
									<div className="col-6">
										<label className="form-label">Bus Color</label>
										<select
											className="form-select"
											name="color"
											value={form.color || "White"}
											onChange={handleChange}
											disabled={loading}
										>
											<option value="White">White</option>
											<option value="Blue">Blue</option>
											<option value="Green">Green</option>
											<option value="Red">Red</option>
										</select>
									</div>
									<div className="col-6">
										<label className="form-label">Type</label>
										<select
											className="form-select"
											name="bus_type"
											value={form.bus_type || "Government"}
											onChange={handleChange}
											disabled={loading}
										>
											<option value="Private">Private</option>
											<option value="Government">Government</option>
										</select>
									</div>
								</div>
								<button
									type="submit"
									className="btn btn-primary w-100 py-3 fw-bold rounded-3"
									disabled={loading}
								>
									SUBMIT BUS
								</button>
							</form>
						</div>
					</div>
				);
			case "station":
				return (
					<div id="form-station" className="contribution-form">
						<div className="card contribution-card p-4">
							<h4 className="fw-bold mb-4">
								<i className="bi bi-geo-alt me-2 text-primary"></i>Suggest
								Station
							</h4>
							<form onSubmit={handleSubmit}>
								<div className="row mb-3">
									<div className="col-6">
										<label className="form-label">State</label>
										<input
											type="text"
											className="form-control"
											name="state"
											value={form.state || "Kerala"}
											onChange={handleChange}
											required
											disabled={loading}
										/>
									</div>
									<div className="col-6">
										<label className="form-label">District</label>
										<input
											type="text"
											className="form-control"
											name="district"
											value={form.district || ""}
											onChange={handleChange}
											placeholder="e.g. Ernakulam"
											required
											disabled={loading}
										/>
									</div>
								</div>
								<div className="mb-3">
									<label className="form-label">City</label>
									<input
										type="text"
										className="form-control"
										name="city"
										value={form.city || ""}
										onChange={handleChange}
										placeholder="e.g. Aluva"
										required
										disabled={loading}
									/>
								</div>
								<div className="mb-4">
									<label className="form-label">Station Name</label>
									<input
										type="text"
										className="form-control"
										name="name"
										value={form.name || ""}
										onChange={handleChange}
										placeholder="e.g. KSRTC Bus Terminal"
										required
										disabled={loading}
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary w-100 py-3 fw-bold rounded-3"
									disabled={loading}
								>
									SUBMIT STATION
								</button>
							</form>
						</div>
					</div>
				);
			case "route":
				return (
					<div id="form-route" className="contribution-form">
						<div className="card contribution-card p-4">
							<h4 className="fw-bold mb-4">
								<i className="bi bi-signpost me-2 text-primary"></i>Suggest
								Route
							</h4>
							<form onSubmit={handleSubmit}>
								<div className="row mb-3">
									<div className="col-6">
										<label className="form-label">Origin</label>
										<input
											type="text"
											className="form-control"
											name="origin"
											value={form.origin || ""}
											onChange={handleChange}
											placeholder="e.g. Kochi"
											required
											disabled={loading}
										/>
									</div>
									<div className="col-6">
										<label className="form-label">Destination</label>
										<input
											type="text"
											className="form-control"
											name="destination"
											value={form.destination || ""}
											onChange={handleChange}
											placeholder="e.g. Trivandrum"
											required
											disabled={loading}
										/>
									</div>
								</div>
								<div className="mb-3">
									<label className="form-label">Path Signature (via)</label>
									<textarea
										className="form-control"
										rows="2"
										name="via"
										value={form.via || ""}
										onChange={handleChange}
										placeholder="e.g. Via NH66, Alappuzha, Kollam"
										disabled={loading}
									></textarea>
								</div>
								<div className="mb-4">
									<label className="form-label">Distance (KM)</label>
									<input
										type="number"
										className="form-control"
										name="distance"
										value={form.distance || ""}
										onChange={handleChange}
										placeholder="200"
										disabled={loading}
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary w-100 py-3 fw-bold rounded-3"
									disabled={loading}
								>
									SUBMIT ROUTE
								</button>
							</form>
						</div>
					</div>
				);
			case "stop":
				return (
					<div id="form-stop" className="contribution-form">
						<div className="card contribution-card p-4">
							<h4 className="fw-bold mb-4">
								<i className="bi bi-dot me-2 text-primary"></i>Intermediate Stop
							</h4>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label className="form-label">Select Route</label>
									<select
										className="form-select"
										name="route_id"
										value={form.route_id || ""}
										onChange={handleChange}
										required
										disabled={loading}
									>
										<option value="">Choose existing route...</option>
										{routes?.map((r, i) => (
											<option key={i} value={r.id || r.name}>
												{r.name || r.label || `Route ${r.id}`}
											</option>
										))}
									</select>
								</div>
								<div className="row mb-3">
									<div className="col-6">
										<label className="form-label">Before Stop</label>
										<input
											type="text"
											className="form-control"
											name="before_stop"
											value={form.before_stop || ""}
											onChange={handleChange}
											placeholder="Prev Stop"
											disabled={loading}
										/>
									</div>
									<div className="col-6">
										<label className="form-label">After Stop</label>
										<input
											type="text"
											className="form-control"
											name="after_stop"
											value={form.after_stop || ""}
											onChange={handleChange}
											placeholder="Next Stop"
											disabled={loading}
										/>
									</div>
								</div>
								<div className="mb-4">
									<label className="form-label">
										Distance from Origin (KM)
									</label>
									<input
										type="number"
										className="form-control"
										name="distance"
										value={form.distance || ""}
										onChange={handleChange}
										required
										disabled={loading}
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary w-100 py-3 fw-bold rounded-3"
									disabled={loading}
								>
									SUBMIT STOP
								</button>
							</form>
						</div>
					</div>
				);
			case "trip":
				return (
					<div id="form-trip" className="contribution-form">
						<div className="card contribution-card p-4">
							<h4 className="fw-bold mb-4">
								<i className="bi bi-calendar-event me-2 text-primary"></i>
								Suggest Trip
							</h4>
							<form onSubmit={handleSubmit}>
								<div className="row mb-3">
									<div className="col-6">
										<label className="form-label">Select Bus</label>
										<select
											className="form-select"
											name="bus_id"
											value={form.bus_id || ""}
											onChange={handleChange}
											required
											disabled={loading}
										>
											<option value="">Choose bus...</option>
											{buses?.map((b, i) => (
												<option key={i} value={b.id || b.name}>
													{b.name || b.bus_name || `Bus ${b.id}`}
												</option>
											))}
										</select>
									</div>
									<div className="col-6">
										<label className="form-label">Select Route</label>
										<select
											className="form-select"
											name="route_id"
											value={form.route_id || ""}
											onChange={handleChange}
											required
											disabled={loading}
										>
											<option value="">Choose route...</option>
											{routes?.map((r, i) => (
												<option key={i} value={r.id || r.name}>
													{r.name || r.label || `Route ${r.id}`}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className="row mb-3">
									<div className="col-6">
										<label className="form-label">Dep. Time</label>
										<input
											type="time"
											className="form-control"
											name="dep_time"
											value={form.dep_time || ""}
											onChange={handleChange}
											required
											disabled={loading}
										/>
									</div>
									<div className="col-6">
										<label className="form-label">Arr. Time</label>
										<input
											type="time"
											className="form-control"
											name="arr_time"
											value={form.arr_time || ""}
											onChange={handleChange}
											required
											disabled={loading}
										/>
									</div>
								</div>
								<div className="mb-4">
									<label className="form-label d-block mb-2">
										Operating Days
									</label>
									<div className="d-flex flex-wrap gap-2">
										<div className="form-check">
											<input
												className="form-check-input"
												type="checkbox"
												name="operating_days"
												value="daily"
												checked={(form.operating_days || []).includes("daily")}
												onChange={handleChange}
												disabled={loading}
											/>
											<label className="small">Daily</label>
										</div>
										<div className="form-check">
											<input
												className="form-check-input"
												type="checkbox"
												name="operating_days"
												value="mon-fri"
												checked={(form.operating_days || []).includes(
													"mon-fri",
												)}
												onChange={handleChange}
												disabled={loading}
											/>
											<label className="small">Mon-Fri</label>
										</div>
									</div>
								</div>
								<button
									type="submit"
									className="btn btn-primary w-100 py-3 fw-bold rounded-3"
									disabled={loading}
								>
									SUBMIT TRIP
								</button>
							</form>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div id="section-contribute" className="app-section active">
			{loading && (
				<div
					id="submit-loader"
					className="d-flex flex-column align-items-center justify-content-center"
				>
					<div className="spinner-border text-primary mb-2" role="status"></div>
					<span className="fw-bold">Submitting Contribution...</span>
				</div>
			)}

			<div className="dashboard-container py-3 pb-5 mb-5">
				<div className="text-center">
					<h2 className="fw-800 mb-1">Contribute Hub</h2>
					<p className="text-muted mb-1">
						Select a category to share information
					</p>
				</div>

				{success && (
					<div className="alert alert-success py-3 rounded-4 shadow-sm mb-4">
						<i className="bi bi-check-circle-fill me-2"></i> Thank you! Your
						suggestion has been submitted for review.
					</div>
				)}

				{error && (
					<div className="alert alert-danger py-3 rounded-4 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
					</div>
				)}

				{!type ? (
					renderMenu()
				) : (
					<div id="form-container" className="section-fade active">
						<button
							className="btn btn-link text-decoration-none text-dark fw-bold ps-0 mb-2"
							onClick={goBackToMenu}
						>
							<i className="bi bi-arrow-left me-2"></i>Back to options
						</button>
						{renderForm()}
					</div>
				)}
			</div>
		</div>
	);
};

export default ContributeSection;
