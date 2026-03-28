import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPin from "./pages/ForgotPin";
import ResetPin from "./pages/ResetPin";

const AppContent = () => {
	const { token, loading, logout } = useAuth();
	const [currentScreen, setCurrentScreen] = useState("login");

	const navigateTo = (screen) => {
		setCurrentScreen(screen);
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center vh-100 bg-light w-100">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	// A mock dashboard for demonstration if logged in
	if (token) {
		return (
			<div className="app-shell" style={{ backgroundColor: "#f8f9fa" }}>
				<div
					className="app-header"
					style={{ height: "20%", minHeight: "150px" }}
				>
					<h3 className="fw-bold mb-1">DASHBOARD</h3>
					<p className="small opacity-75">Welcome back, Partner</p>
				</div>
				<div className="login-body text-center mt-5">
					<h5>Logged In Successfully!</h5>
					<button
						className="btn btn-outline-danger mt-3"
						onClick={() => {
							logout();
							navigateTo("login");
						}}
					>
						Logout
					</button>
				</div>
			</div>
		);
	}

	switch (currentScreen) {
		case "login":
			return <Login navigateTo={navigateTo} />;
		case "register":
			return <Register navigateTo={navigateTo} />;
		case "forgotPin":
			return <ForgotPin navigateTo={navigateTo} />;
		case "resetPin":
			return <ResetPin navigateTo={navigateTo} />;
		default:
			return <Login navigateTo={navigateTo} />;
	}
};

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;
