import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import OTPInput from "../components/OTPInput";

const ForgotPin = ({ navigateTo }) => {
	const { sendOtp, verifyOtp, setOtpData } = useAuth();
	const [phone, setPhone] = useState("7560838394");
	const [loading, setLoading] = useState(false);

	// UI States: 'request' | 'otp'
	const [step, setStep] = useState("request");
	const [timeLeft, setTimeLeft] = useState(30);

	useEffect(() => {
		if (step === "otp") {
			setTimeLeft(30);
			const interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [step]);

	const handleForgotRequest = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await sendOtp(phone);
			setStep("otp");
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleOTPComplete = async (code) => {
		setLoading(true);
		try {
			await verifyOtp({ phone, otp: code });
			setOtpData({ phone, otp: code });
			navigateTo("resetPin");
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async (e) => {
		e.preventDefault();
		if (timeLeft > 0) return;
		setLoading(true);
		try {
			await sendOtp(phone);
			setTimeLeft(30);
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (step === "otp") {
		return (
			<AuthLayout titleText="Verification" subText="Enter the 6-digit code">
				<div className="login-card">
					<div className="text-center mb-3">
						<span className="badge bg-light text-primary p-2">
							OTP sent to your mobile
						</span>
					</div>
					{loading && (
						<div className="text-center mb-2">
							<span className="spinner-border spinner-border-sm text-primary"></span>
						</div>
					)}
					<OTPInput length={6} onComplete={handleOTPComplete} />

					<button
						className="btn btn-primary-custom mt-4"
						disabled={loading}
						onClick={() =>
							alert("Please type the 6-digit OTP above to continue")
						}
					>
						Verify & Continue
					</button>

					<div className="text-center mt-3">
						<p className="small text-muted mb-0">
							Didn't receive code?{" "}
							{timeLeft > 0 ? (
								<span className="fw-bold small">
									Resend in <span id="timer">{timeLeft}</span>s
								</span>
							) : (
								<a
									href="#"
									onClick={handleResend}
									className="text-primary text-decoration-none fw-bold small"
								>
									Resend Now
								</a>
							)}
						</p>
					</div>
					<button
						type="button"
						className="btn btn-link btn-sm w-100 mt-1 text-secondary text-decoration-none"
						onClick={() => navigateTo("login")}
						disabled={loading}
					>
						Cancel
					</button>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout titleText="Reset PIN" subText="Enter mobile to receive OTP">
			<div className="login-card">
				<form onSubmit={handleForgotRequest}>
					<div className="mb-4">
						<label className="form-label">Registered Mobile</label>
						<div className="input-group">
							<span
								className="input-group-text border-0 bg-light"
								style={{ borderRadius: "12px 0 0 12px" }}
							>
								+91
							</span>
							<input
								type="tel"
								className="form-control border-start-0"
								placeholder="00000 00000"
								style={{ borderRadius: "0 12px 12px 0" }}
								required
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
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
							"Send OTP"
						)}
					</button>
					<button
						type="button"
						className="btn btn-link btn-sm w-100 mt-2 text-secondary text-decoration-none"
						onClick={() => navigateTo("login")}
					>
						Back to Login
					</button>
				</form>
			</div>
		</AuthLayout>
	);
};

export default ForgotPin;
