import React, { useState } from "react";
import { AuthProvider, useAuth } from "./shared/context/AuthContext";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPin from "./features/auth/pages/ForgotPin";
import ResetPin from "./features/auth/pages/ResetPin";
import Dashboard from "./pages/Dashboard";

const AppContent = () => {
	const { token, loading, logout } = useAuth();
	const [currentScreen, setCurrentScreen] = useState("dashboard");

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

	if (currentScreen === "dashboard") {
		return <Dashboard navigateTo={navigateTo} />;
	}

	const renderScreen = () => {
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
				return <Dashboard navigateTo={navigateTo} />;
		}
	};

	return <div className="auth-container">{renderScreen()}</div>;
};

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;
