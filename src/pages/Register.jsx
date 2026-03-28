import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const Register = ({ navigateTo }) => {
	const { register } = useAuth();
	const [name, setName] = useState("safvan");
	const [phone, setPhone] = useState("7560838394");
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
			await register({ name, phone, pin, confirm_pin: cpin });
			alert("Account created! Please login.");
			navigateTo("login");
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout titleText="Create Account" subText="Join as a new partner">
			<div className="login-card">
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
						/>
					</div>
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
								placeholder="Mobile Number"
								style={{ borderRadius: "0 12px 12px 0" }}
								required
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
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
						<p className="small text-muted">
							Already have an account?{" "}
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									navigateTo("login");
								}}
								className="text-primary text-decoration-none fw-bold"
							>
								Login
							</a>
						</p>
					</div>
				</form>
			</div>
		</AuthLayout>
	);
};

export default Register;
