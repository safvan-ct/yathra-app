import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const ResetPin = ({ navigateTo }) => {
	const { resetPin, otpData } = useAuth();
	const [pin, setPin] = useState("123456");
	const [cpin, setCpin] = useState("123456");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (pin !== cpin) {
			alert("PINs do not match!");
			return;
		}

		setLoading(true);
		try {
			await resetPin({
				new_pin: pin,
				confirm_pin: cpin,
				otp: otpData.otp,
				phone: otpData.phone,
			});
			alert("PIN updated successfully!");
			navigateTo("login");
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout titleText="Set New PIN" subText="Secure your account">
			<div className="login-card">
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label">New PIN</label>
						<input
							type="password"
							className="form-control"
							placeholder="Enter new 6-digit PIN"
							maxLength="6"
							required
							value={pin}
							onChange={(e) => setPin(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label className="form-label">Confirm New PIN</label>
						<input
							type="password"
							className="form-control"
							placeholder="Confirm new PIN"
							maxLength="6"
							required
							value={cpin}
							onChange={(e) => setCpin(e.target.value)}
						/>
					</div>
					<button type="submit" className="btn btn-otp" disabled={loading}>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>
								Please wait...
							</>
						) : (
							"Update PIN"
						)}
					</button>
				</form>
			</div>
		</AuthLayout>
	);
};

export default ResetPin;
