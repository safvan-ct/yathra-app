import "../styles/Navigation.css";

const BottomNav = ({ activeSection, setActiveSection }) => {
	const handleNavClick = (e, section) => {
		if (e) e.preventDefault();
		setActiveSection(section);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const navItems = [
		{
			id: "home",
			label: "Home",
			activeIcon: "bi-house-door-fill",
			inactiveIcon: "bi-house-door",
		},
		{
			id: "buses",
			label: "Buses",
			activeIcon: "bi-bus-front-fill",
			inactiveIcon: "bi-bus-front",
		},
		{
			id: "stops",
			label: "Stops",
			activeIcon: "bi-geo-alt-fill",
			inactiveIcon: "bi-geo-alt",
		},
		{
			id: "tickets",
			label: "Tickets",
			activeIcon: "bi-ticket-perforated-fill",
			inactiveIcon: "bi-ticket-perforated",
		},
	];

	return (
		<nav className="bottom-nav-dashboard d-md-none">
			{navItems.map((item) => {
				const isActive =
					activeSection === item.id ||
					(item.id === "buses" && activeSection === "bus-trips") ||
					(item.id === "stops" && activeSection === "stop-timings");
				return (
					<a
						key={item.id}
						href="#"
						className={`nav-item ${isActive ? "active" : ""}`}
						onClick={(e) => handleNavClick(e, item.id)}
					>
						<i
							className={`bi ${isActive ? item.activeIcon : item.inactiveIcon}`}
						></i>
						<span className="nav-label">{item.label}</span>
					</a>
				);
			})}
		</nav>
	);
};

export default BottomNav;
