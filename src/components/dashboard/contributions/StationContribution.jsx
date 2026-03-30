import React, { useState, useEffect } from "react";
import { useContributions } from "../../../hooks/useContributions";
import api from "../../../services/api";

/* ─────────────────────────────────────────────
   Tiny helper: loading spinner inside a select
───────────────────────────────────────────── */
const SelectField = ({
	id,
	name,
	label,
	value,
	onChange,
	options,
	loading,
	disabled,
	placeholder,
	required,
}) => (
	<div className="form-floating">
		<select
			id={id}
			name={name}
			className="form-select"
			value={value}
			onChange={onChange}
			disabled={disabled || loading}
			required={required}
		>
			<option value="">{loading ? "Loading…" : placeholder}</option>
			{options.map((opt) => (
				<option key={opt.id ?? opt} value={opt.id ?? opt}>
					{opt.name ?? opt}
				</option>
			))}
		</select>
		<label htmlFor={id} className="text-muted">
			{label}
			{loading && (
				<span
					className="spinner-border spinner-border-sm ms-2"
					style={{ width: "0.7rem", height: "0.7rem" }}
				/>
			)}
		</label>
	</div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const StationContribution = ({ goBack, onSuccess }) => {
	const [form, setForm] = useState({
		state_id: "",
		district_id: "",
		city_id: "",
		type: "Stop",
		name: "",
	});

	// Dropdown data
	const [states, setStates] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [cities, setCities] = useState([]);

	// Per-field loading flags
	const [statesLoading, setStatesLoading] = useState(false);
	const [districtsLoading, setDistrictsLoading] = useState(false);
	const [citiesLoading, setCitiesLoading] = useState(false);

	const {
		submitLoading: loading,
		error,
		success,
		submitContribution,
	} = useContributions();

	/* ── Load states on mount ── */
	useEffect(() => {
		setStatesLoading(true);
		api
			.get("/states")
			.then((res) => setStates(res.data ?? res))
			.catch(() => setStates([]))
			.finally(() => setStatesLoading(false));
	}, []);

	/* ── Load districts when state changes ── */
	useEffect(() => {
		if (!form.state_id) {
			setDistricts([]);
			setCities([]);
			return;
		}
		setDistrictsLoading(true);
		setDistricts([]);
		setCities([]);
		api
			.get(`/districts?state_id=${form.state_id}`)
			.then((res) => setDistricts(res.data ?? res))
			.catch(() => setDistricts([]))
			.finally(() => setDistrictsLoading(false));
	}, [form.state_id]);

	/* ── Load cities when district changes ── */
	useEffect(() => {
		if (!form.district_id) {
			setCities([]);
			return;
		}
		setCitiesLoading(true);
		setCities([]);
		api
			.get(`/cities?district_id=${form.district_id}`)
			.then((res) => setCities(res.data ?? res))
			.catch(() => setCities([]))
			.finally(() => setCitiesLoading(false));
	}, [form.district_id]);

	/* ── Generic change handler ── */
	const handleChange = (e) => {
		const { name, value } = e.target;

		setForm((prev) => {
			const next = { ...prev, [name]: value };
			// Reset dependents
			if (name === "state_id") {
				next.district_id = "";
				next.city_id = "";
			}
			if (name === "district_id") {
				next.city_id = "";
			}
			return next;
		});
	};

	/* ── Submit ── */
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(form);

		const saved = await submitContribution("station", form);
		if (saved) {
			setForm({
				state_id: "",
				district_id: "",
				city_id: "",
				name: "",
				type: "Stop",
			});
			onSuccess("station");
		}
	};

	const isDisabled = loading || success;

	return (
		<div id="form-station" className="contribution-form">
			<div className="card contribution-card p-4 border-0 shadow-sm rounded-4">
				<h4 className="fw-bold mb-4">
					<i className="bi bi-geo-alt me-2 text-primary" />
					Suggest Station
				</h4>

				{error && (
					<div className="alert alert-danger py-3 rounded-3 shadow-sm mb-4">
						<i className="bi bi-exclamation-triangle-fill me-2" />
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					{/* State */}
					<div className="mb-3">
						<SelectField
							id="stateSelect"
							name="state_id"
							label="State"
							value={form.state_id}
							onChange={handleChange}
							options={states}
							loading={statesLoading}
							disabled={isDisabled}
							placeholder="Select State"
							required
						/>
					</div>

					{/* District */}
					<div className="mb-3">
						<SelectField
							id="districtSelect"
							name="district_id"
							label="District"
							value={form.district_id}
							onChange={handleChange}
							options={districts}
							loading={districtsLoading}
							disabled={isDisabled || !form.state_id}
							placeholder={
								form.state_id ? "Select District" : "Select a state first"
							}
							required
						/>
					</div>

					{/* City */}
					<div className="mb-3">
						<SelectField
							id="citySelect"
							name="city_id"
							label="City"
							value={form.city_id}
							onChange={handleChange}
							options={cities}
							loading={citiesLoading}
							disabled={isDisabled || !form.district_id}
							placeholder={
								form.district_id ? "Select City" : "Select a district first"
							}
							required
						/>
					</div>

					<div className="mb-3">
						<div className="form-floating">
							<select
								className="form-select"
								id="stationType"
								name="type"
								value={form.type || "Stop"}
								onChange={handleChange}
								disabled={loading || success}
							>
								<option value="Hub">Hub</option>
								<option value="Terminal">Terminal</option>
								<option value="Stop">Stop</option>
							</select>
							<label htmlFor="stationType" className="text-muted">
								Station Type
							</label>
						</div>
					</div>

					{/* Station Name */}
					<div className="mb-4 form-floating">
						<input
							type="text"
							className="form-control"
							id="stationName"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="e.g. KSRTC Bus Terminal"
							required
							disabled={isDisabled}
						/>
						<label htmlFor="stationName" className="text-muted">
							Station Name
						</label>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center"
						disabled={isDisabled}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" />
								Submitting…
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
