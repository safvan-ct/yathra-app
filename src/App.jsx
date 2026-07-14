import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./shared/context/AuthContext";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPin from "./features/auth/pages/ForgotPin";
import ResetPin from "./features/auth/pages/ResetPin";
import Dashboard from "./pages/Dashboard";

const AppContent = () => {
	const { token, loading } = useAuth();
	const navigate = useNavigate();

	const navigateTo = (screen) => {
		switch (screen) {
			case "dashboard":
				navigate("/");
				break;
			case "login":
				navigate("/login");
				break;
			case "register":
				navigate("/register");
				break;
			case "forgotPin":
				navigate("/forgot-pin");
				break;
			case "resetPin":
				navigate("/reset-pin");
				break;
			default:
				navigate("/");
		}
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

	return (
		<Routes>
			{/* Dashboard sub-sections as routes */}
			<Route path="/" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/home" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/buses" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/stops" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/tickets" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/tracking" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/contribute" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/history" element={<Dashboard navigateTo={navigateTo} />} />
			<Route path="/profile" element={<Dashboard navigateTo={navigateTo} />} />

			{/* Auth Screens */}
			<Route
				path="/login"
				element={
					token ? (
						<Navigate to="/" replace />
					) : (
						<div className="auth-container">
							<Login navigateTo={navigateTo} />
						</div>
					)
				}
			/>
			<Route
				path="/register"
				element={
					token ? (
						<Navigate to="/" replace />
					) : (
						<div className="auth-container">
							<Register navigateTo={navigateTo} />
						</div>
					)
				}
			/>
			<Route
				path="/forgot-pin"
				element={
					token ? (
						<Navigate to="/" replace />
					) : (
						<div className="auth-container">
							<ForgotPin navigateTo={navigateTo} />
						</div>
					)
				}
			/>
			<Route
				path="/reset-pin"
				element={
					token ? (
						<Navigate to="/" replace />
					) : (
						<div className="auth-container">
							<ResetPin navigateTo={navigateTo} />
						</div>
					)
				}
			/>

			{/* Catch-all redirect */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<AppContent />
			</Router>
		</AuthProvider>
	);
};

export default App;
