import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const Login = ({ navigateTo }) => {
	const { login } = useAuth();
	const [phone, setPhone] = useState("");
	const [pin, setPin] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await login(phone, pin);
			navigateTo("dashboard");
		} catch (err) {
			setError(err.message || "Failed to login. Check credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout titleText="Welcome Back" subText="Sign in to continue.">
			<div className="login-card">
				{error && (
					<div className="alert alert-danger py-2 small mb-3">{error}</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label">Mobile Number</label>
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
								disabled={loading}
							/>
						</div>
					</div>

					<div className="mb-2">
						<div className="d-flex justify-content-between align-items-center">
							<label className="form-label mb-0">PIN</label>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (!loading) navigateTo("forgotPin");
								}}
								className="otp-link small"
							>
								Forgot PIN?
							</a>
						</div>
						<input
							type="password"
							className="form-control mt-2"
							placeholder="Enter PIN"
							maxLength="6"
							required
							value={pin}
							onChange={(e) => setPin(e.target.value)}
							disabled={loading}
						/>
					</div>

					<button type="submit" className="btn btn-otp" disabled={loading}>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>
								Please wait...
							</>
						) : (
							"Login"
						)}
					</button>
					<div className="text-center mt-3">
						<p className="small text-muted">
							New partner?{" "}
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (!loading) navigateTo("register");
								}}
								className="text-primary text-decoration-none fw-bold"
							>
								Create Account
							</a>
						</p>
					</div>
				</form>
			</div>
		</AuthLayout>
	);
};

export default Login;
