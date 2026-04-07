import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import OTPInput from "../components/OTPInput";
import { useAuth } from "../../../shared/context/AuthContext";
import "../styles/Auth.css";

const ResetPin = ({ navigateTo }) => {
	const { otpData, verifyOtp, resetPin } = useAuth();

	const [otpState, setOtpState] = useState("");
	const [newPin, setNewPin] = useState("");
	const [cNewPin, setCNewPin] = useState("");

	const [step, setStep] = useState(1); // 1 = OTP, 2 = New PIN
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleVerifyOtp = async (otpValue) => {
		setOtpState(otpValue);
		if (!otpData?.phone) {
			setError("Invalid session. Start over.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await verifyOtp({ phone: otpData.phone, otp: otpValue });
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
					<div>
						<div className="text-center mb-4">
							<label className="form-label d-block mb-3">
								OTP sent to +91 {otpData?.phone || "XXXXX XXXXX"}
							</label>
							<OTPInput length={6} onComplete={handleVerifyOtp} />
						</div>
						{loading && (
							<div className="text-center">
								<span className="spinner-border spinner-border-sm text-primary"></span>
								<p className="small text-muted mt-2">Verifying...</p>
							</div>
						)}
					</div>
				) : (
					<form onSubmit={handleResetPin}>
						<div className="row g-2 mb-4">
							<div className="col-6">
								<label className="form-label">New PIN</label>
								<input
									type="password"
									className="form-control pin-input-modern"
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
									className="form-control pin-input-modern"
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
