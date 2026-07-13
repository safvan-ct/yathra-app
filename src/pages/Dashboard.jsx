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
import StopsSection from "../features/stops/components/StopsSection";
import TicketsSection from "../features/tickets/components/TicketsSection";

const Dashboard = ({ navigateTo }) => {
	const { token } = useAuth();
	const [activeSection, setActiveSection] = useState("home");

	const handleSectionChange = (section) => {
		if (section !== "home" && section !== "stops" && !token) {
			navigateTo("login");
			return;
		}
		setActiveSection(section);
	};

	return (
		<>
			<DesktopNav
				activeSection={activeSection}
				setActiveSection={handleSectionChange}
				token={token}
			/>

			{activeSection === "home" && <HomeSection />}
			{activeSection === "buses" && <BusesSection />}
			{activeSection === "stops" && <StopsSection />}
			{activeSection === "tickets" && (
				<TicketsSection setActiveSection={handleSectionChange} />
			)}
			{activeSection === "contribute" && <ContributeSection />}
			{activeSection === "history" && (
				<HistorySection setActiveSection={handleSectionChange} />
			)}
			{activeSection === "profile" && (
				<ProfileSection navigateTo={navigateTo} />
			)}

			<BottomNav
				activeSection={activeSection}
				setActiveSection={handleSectionChange}
				token={token}
			/>
		</>
	);
};

export default Dashboard;

