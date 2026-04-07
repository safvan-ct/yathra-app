import { useState, useEffect } from "react";
import { useAuth } from "../shared/context/AuthContext";
import "./Dashboard.css";

import DesktopNav from "../shared/components/DesktopNav";
import BottomNav from "../shared/components/BottomNav";

import HomeSection from "../features/home/components/HomeSection";
import BusesSection from "../features/buses/components/BusesSection";
import ContributeSection from "../features/contributions/components/ContributeSection";
import HistorySection from "../features/profile/components/HistorySection";
import ProfileSection from "../features/profile/components/ProfileSection";

const Dashboard = ({ navigateTo }) => {
	const { token, logout } = useAuth();
	const [activeSection, setActiveSection] = useState("home");

	useEffect(() => {
		if (!token) {
			logout();
			navigateTo("login");
		}
	}, [token, logout, navigateTo]);

	if (!token) return null;

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
			{activeSection === "profile" && (
				<ProfileSection navigateTo={navigateTo} />
			)}

			<BottomNav
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
		</>
	);
};

export default Dashboard;
