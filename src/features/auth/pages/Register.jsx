import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../../../shared/context/AuthContext";

const Register = ({ navigateTo }) => {
	const { register } = useAuth();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [pin, setPin] = useState("");
	const [cpin, setCpin] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (pin !== cpin) {
			setError("PINs do not match!");
			return;
		}

		setLoading(true);

		try {
			await register({ name, phone, pin, confirm_pin: cpin });
			setSuccess("Account created successfully!");
			setTimeout(() => {
				navigateTo("login");
			}, 2000);
		} catch (err) {
			setError(err.message || "Failed to create account.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout titleText="Create Account" subText="Join as a new partner">
			<div className="login-card">
				{error && (
					<div className="alert alert-danger py-2 small mb-3">{error}</div>
				)}
				{success && (
					<div className="alert alert-success py-2 small mb-3">{success}</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label">Full Name</label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter your name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={loading}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label">Mobile Number</label>
						<div className="input-group">
							<span className="input-group-text border-0 bg-light auth-input-group-text">
								+91
							</span>
							<input
								type="tel"
								className="form-control border-start-0 auth-input-group-input"
								placeholder="Mobile Number"
								required
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								disabled={loading}
							/>
						</div>
					</div>
					<div className="row g-2 mb-3">
						<div className="col-6">
							<label className="form-label">Set PIN</label>
							<input
								type="password"
								className="form-control"
								placeholder="6-digits"
								maxLength="6"
								required
								value={pin}
								onChange={(e) => setPin(e.target.value)}
								disabled={loading}
							/>
						</div>
						<div className="col-6">
							<label className="form-label">Confirm PIN</label>
							<input
								type="password"
								className="form-control"
								placeholder="Confirm"
								maxLength="6"
								required
								value={cpin}
								onChange={(e) => setCpin(e.target.value)}
								disabled={loading}
							/>
						</div>
					</div>
					<button type="submit" className="btn btn-otp" disabled={loading}>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>
								Please wait...
							</>
						) : (
							"Create Account"
						)}
					</button>
					<div className="text-center mt-3">
						<p className="small text-muted mb-2">
							Already have an account?{" "}
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (!loading) navigateTo("login");
								}}
								className="text-primary text-decoration-none fw-bold"
							>
								Login
							</a>
						</p>
						<a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								navigateTo("dashboard");
							}}
							className="text-muted text-decoration-none small d-inline-flex align-items-center gap-1"
						>
							<i className="bi bi-arrow-left"></i>
							Back to Search
						</a>
					</div>
				</form>
			</div>
		</AuthLayout>
	);
};

export default Register;
