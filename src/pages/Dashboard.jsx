import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css"; // Ensure styles are imported

// Import Components
import DesktopNav from "../components/dashboard/DesktopNav";
import BottomNav from "../components/dashboard/BottomNav";
import HomeSection from "../components/dashboard/HomeSection";
import BusesSection from "../components/dashboard/BusesSection";
import ContributeSection from "../components/dashboard/ContributeSection";
import HistorySection from "../components/dashboard/HistorySection";
import ProfileSection from "../components/dashboard/ProfileSection";

const Dashboard = ({ navigateTo }) => {
	const { token, logout } = useAuth();
	const [activeSection, setActiveSection] = useState("home");

	// Auth protection
	useEffect(() => {
		if (!token) {
			logout();
			navigateTo("login");
		}
	}, [token, logout, navigateTo]);

	if (!token) return null; // Prevent rendering while redirecting

	return (
		<>
			<DesktopNav
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>

			{activeSection === "home" && <HomeSection />}
			{activeSection === "buses" && <BusesSection />}
			{activeSection === "contribute" && <ContributeSection />}
			{activeSection === "history" && (
				<HistorySection setActiveSection={setActiveSection} />
			)}
			{activeSection === "profile" && <ProfileSection navigateTo={navigateTo} />}

			<BottomNav
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
		</>
	);
};

export default Dashboard;
