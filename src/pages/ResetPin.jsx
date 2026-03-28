import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const ResetPin = ({ navigateTo }) => {
	const { otpData, verifyOtp, resetPin } = useAuth();

	const [otpState, setOtpState] = useState("");
	const [newPin, setNewPin] = useState("");
	const [cNewPin, setCNewPin] = useState("");

	const [step, setStep] = useState(1); // 1 = OTP, 2 = New PIN
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		if (!otpData?.phone) {
			setError("Invalid session. Start over.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await verifyOtp({ phone: otpData.phone, otp: otpState });
			setSuccess("OTP verified! Create new PIN.");
			setStep(2);
		} catch (err) {
			setError(err.message || "Invalid OTP.");
		} finally {
			setLoading(false);
		}
	};

	const handleResetPin = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (newPin !== cNewPin) {
			setError("PINs do not match!");
			return;
		}

		setLoading(true);

		try {
			await resetPin({
				phone: otpData.phone,
				otp: otpState,
				new_pin: newPin,
				confirm_pin: cNewPin,
			});
			setSuccess("PIN reset successfully!");
			setTimeout(() => {
				navigateTo("login");
			}, 2000);
		} catch (err) {
			setError(err.message || "Failed to reset PIN.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout titleText="Reset PIN" subText="Verify and set new code.">
			<div className="login-card">
				{error && (
					<div className="alert alert-danger py-2 small mb-3">{error}</div>
				)}
				{success && (
					<div className="alert alert-success py-2 small mb-3">{success}</div>
				)}

				{step === 1 ? (
					<form onSubmit={handleVerifyOtp}>
						<div className="mb-4">
							<label className="form-label">
								OTP sent to +91 {otpData?.phone || "XXXXX XXXXX"}
							</label>
							<input
								type="text"
								className="form-control text-center fs-3 letter-spacing-1"
								placeholder="0 0 0 0 0 0"
								maxLength="6"
								required
								value={otpState}
								onChange={(e) => setOtpState(e.target.value)}
								disabled={loading}
							/>
						</div>
						<button type="submit" className="btn btn-otp" disabled={loading}>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2"></span>
									Verifying...
								</>
							) : (
								"Verify OTP"
							)}
						</button>
					</form>
				) : (
					<form onSubmit={handleResetPin}>
						<div className="row g-2 mb-4">
							<div className="col-6">
								<label className="form-label">New PIN</label>
								<input
									type="password"
									className="form-control"
									placeholder="6-digits"
									maxLength="6"
									required
									value={newPin}
									onChange={(e) => setNewPin(e.target.value)}
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
									value={cNewPin}
									onChange={(e) => setCNewPin(e.target.value)}
									disabled={loading}
								/>
							</div>
						</div>
						<button type="submit" className="btn btn-otp" disabled={loading}>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2"></span>
									Saving...
								</>
							) : (
								"Save New PIN"
							)}
						</button>
					</form>
				)}

				<div className="text-center mt-3">
					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (!loading) navigateTo("login");
						}}
						className="text-muted text-decoration-none small fw-bold"
					>
						<i className="bi bi-arrow-left me-1"></i> Cancel
					</a>
				</div>
			</div>
		</AuthLayout>
	);
};

export default ResetPin;
