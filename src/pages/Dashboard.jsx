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
import TrackingSection from "../features/buses/components/TrackingSection";

const Dashboard = ({ navigateTo }) => {
	const { token } = useAuth();
	const [activeSection, setActiveSection] = useState("home");
	const [trackedBus, setTrackedBus] = useState(null);
	const [previousSection, setPreviousSection] = useState("home");

	const handleTrackBus = (bus, fromSection) => {
		setTrackedBus(bus);
		setPreviousSection(fromSection);
		setActiveSection("tracking");
	};

	const handleSectionChange = (section) => {
		if (
			section !== "home" &&
			section !== "stops" &&
			section !== "buses" &&
			section !== "tracking" &&
			!token
		) {
			navigateTo("login");
			return;
		}
		setActiveSection(section);
	};

	return (
		<>
			{activeSection !== "tracking" && (
				<DesktopNav
					activeSection={activeSection}
					setActiveSection={handleSectionChange}
					token={token}
				/>
			)}

			{activeSection === "home" && (
				<HomeSection onBusClick={(bus) => handleTrackBus(bus, "home")} />
			)}
			{activeSection === "buses" && (
				<BusesSection onBusClick={(bus) => handleTrackBus(bus, "buses")} />
			)}
			{activeSection === "stops" && <StopsSection />}
			{activeSection === "tickets" && (
				<TicketsSection setActiveSection={handleSectionChange} />
			)}
			{activeSection === "tracking" && (
				<TrackingSection bus={trackedBus} onBack={() => setActiveSection(previousSection)} />
			)}
			{activeSection === "contribute" && <ContributeSection />}
			{activeSection === "history" && (
				<HistorySection setActiveSection={handleSectionChange} />
			)}
			{activeSection === "profile" && (
				<ProfileSection navigateTo={navigateTo} />
			)}

			{activeSection !== "tracking" && (
				<BottomNav
					activeSection={activeSection}
					setActiveSection={handleSectionChange}
					token={token}
				/>
			)}
		</>
	);
};

export default Dashboard;

