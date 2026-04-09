import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../../../shared/context/AuthContext";

const ForgotPin = ({ navigateTo }) => {
	const { sendOtp, setOtpData } = useAuth();
	const [phone, setPhone] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await sendOtp(phone);
			setOtpData({ phone, otp: null });
			// We just push phone to state. ResetPin will ask for OTP.
			navigateTo("resetPin");
		} catch (err) {
			setError(err.message || "Failed to send OTP.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout titleText="Forgot PIN" subText="Enter mobile number to verify.">
			<div className="login-card">
				{error && (
					<div className="alert alert-danger py-2 small mb-3">{error}</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="form-label">Registered Mobile</label>
						<div className="input-group">
							<span className="input-group-text border-0 bg-light auth-input-group-text">
								+91
							</span>
							<input
								type="tel"
								className="form-control border-start-0 auth-input-group-input"
								placeholder="00000 00000"
								required
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
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
							"Get OTP"
						)}
					</button>

					<div className="text-center mt-3 d-flex flex-column gap-2">
						<a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								if (!loading) navigateTo("login");
							}}
							className="text-muted text-decoration-none small fw-bold"
						>
							<i className="bi bi-arrow-left me-1"></i> Back to Login
						</a>
						<a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								navigateTo("dashboard");
							}}
							className="text-muted text-decoration-none small d-inline-flex align-items-center justify-content-center gap-1"
						>
							<i className="bi bi-house-door"></i>
							Back to Search
						</a>
					</div>
				</form>
			</div>
		</AuthLayout>
	);
};

export default ForgotPin;
