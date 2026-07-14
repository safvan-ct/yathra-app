import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import BusTripsSection from "../features/buses/components/BusTripsSection";
import StopTimingsSection from "../features/stops/components/StopTimingsSection";

const Dashboard = ({ navigateTo }) => {
	const { token } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const { busId, stopId } = useParams();

	// Determine active section from location.pathname
	const getActiveSection = () => {
		const path = location.pathname;
		const active = (() => {
			if (path === "/" || path === "/home") return "home";
			if (path.startsWith("/buses/") && path.endsWith("/trips")) return "bus-trips";
			if (path.startsWith("/buses")) return "buses";
			if (path.startsWith("/stops/") && path.endsWith("/timings")) return "stop-timings";
			if (path.startsWith("/stops")) return "stops";
			if (path.startsWith("/tickets")) return "tickets";
			if (path.startsWith("/tracking")) return "tracking";
			if (path.startsWith("/contribute")) return "contribute";
			if (path.startsWith("/history")) return "history";
			if (path.startsWith("/profile")) return "profile";
			return "home";
		})();
		console.log("getActiveSection path:", path, "activeSection:", active);
		return active;
	};

	const activeSection = getActiveSection();

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

	const initialRestoreDone = useRef(false);

	// Restore last active section on visiting root `/` (only on initial load)
	useEffect(() => {
		if (location.pathname === "/") {
			if (!initialRestoreDone.current) {
				initialRestoreDone.current = true;
				const saved = localStorage.getItem("yathra_active_section");
				if (saved && saved !== "home" && saved !== "tracking") {
					if (saved === "stops" || saved === "buses" || token) {
						navigate(`/${saved}`, { replace: true });
					}
				}
			} else {
				localStorage.setItem("yathra_active_section", "home");
			}
		}
	}, [location.pathname, token, navigate]);

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

	// Protected routes redirect
	useEffect(() => {
		if (
			activeSection !== "home" &&
			activeSection !== "stops" &&
			activeSection !== "buses" &&
			activeSection !== "tracking" &&
			activeSection !== "bus-trips" &&
			activeSection !== "stop-timings" &&
			!token
		) {
			navigate("/");
		}
	}, [activeSection, token, navigate]);

	const handleTrackBus = (bus, fromSection) => {
		setTrackedBus(bus);
		setPreviousSection(fromSection);
		navigate("/tracking");
	};

	const handleSectionChange = (section) => {
		if (
			section !== "home" &&
			section !== "stops" &&
			section !== "buses" &&
			section !== "tracking" &&
			section !== "bus-trips" &&
			!token
		) {
			navigateTo("login");
			return;
		}
		navigate(section === "home" ? "/" : `/${section}`);
	};

	return (
		<>
			{activeSection !== "tracking" && activeSection !== "bus-trips" && activeSection !== "stop-timings" && (
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
				<BusesSection onBusClick={(bus) => navigate(`/buses/${bus.id}/trips`, { state: { bus } })} />
			)}
			{activeSection === "bus-trips" && (
				<BusTripsSection
					bus={location.state?.bus || { id: busId }}
					onBack={() => navigate("/buses")}
					onTrackBus={(busObj, tripObj) => {
						handleTrackBus({ ...busObj, trip_id: tripObj.id }, `buses/${busObj.id}/trips`);
					}}
				/>
			)}
			{activeSection === "stops" && (
				<StopsSection onStopClick={(stop) => {
					console.log("onStopClick callback invoked in Dashboard for stop:", stop);
					navigate(`/stops/${stop.id}/timings`, { state: { stop } });
				}} />
			)}
			{activeSection === "stop-timings" && (
				<StopTimingsSection
					stop={location.state?.stop || { id: stopId }}
					onBack={() => navigate("/stops")}
					onBusClick={(bus) => handleTrackBus(bus, `stops/${stopId}/timings`)}
				/>
			)}
			{activeSection === "tickets" && (
				<TicketsSection setActiveSection={handleSectionChange} />
			)}
			{activeSection === "tracking" && (
				<TrackingSection
					bus={trackedBus}
					onBack={() => navigate(previousSection === "home" ? "/" : `/${previousSection}`)}
				/>
			)}
			{activeSection === "contribute" && <ContributeSection />}
			{activeSection === "history" && (
				<HistorySection setActiveSection={handleSectionChange} />
			)}
			{activeSection === "profile" && (
				<ProfileSection navigateTo={navigateTo} />
			)}

			{activeSection !== "tracking" && activeSection !== "bus-trips" && activeSection !== "stop-timings" && (
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

