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

	const [activeSection, setActiveSection] = useState(() => {
		const saved = localStorage.getItem("yathra_active_section");
		if (saved === "tracking") {
			const savedBus = localStorage.getItem("yathra_tracked_bus");
			if (!savedBus) return "home";
		}
		return saved || "home";
	});

	const [trackedBus, setTrackedBus] = useState(() => {
		const savedBus = localStorage.getItem("yathra_tracked_bus");
		try {
			return savedBus ? JSON.parse(savedBus) : null;
		} catch (e) {
			return null;
		}
	});

	const [previousSection, setPreviousSection] = useState(() => {
		return localStorage.getItem("yathra_previous_section") || "home";
	});

	useEffect(() => {
		localStorage.setItem("yathra_active_section", activeSection);
	}, [activeSection]);

	useEffect(() => {
		if (trackedBus) {
			localStorage.setItem("yathra_tracked_bus", JSON.stringify(trackedBus));
		} else {
			localStorage.removeItem("yathra_tracked_bus");
		}
	}, [trackedBus]);

	useEffect(() => {
		localStorage.setItem("yathra_previous_section", previousSection);
	}, [previousSection]);

	useEffect(() => {
		if (
			activeSection !== "home" &&
			activeSection !== "stops" &&
			activeSection !== "buses" &&
			activeSection !== "tracking" &&
			!token
		) {
			setActiveSection("home");
		}
	}, [activeSection, token]);

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

