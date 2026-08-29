import "../styles/Navigation.css";

const BottomNav = ({ activeSection, setActiveSection }) => {
	const handleNavClick = (e, section) => {
		if (e) e.preventDefault();
		setActiveSection(section);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<nav className="bottom-nav-dashboard d-md-none">
			<a
				href="#"
				className={`nav-item ${activeSection === "home" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "home")}
			>
				<i className={`bi ${activeSection === "home" ? "bi-house-fill" : "bi-house"}`}></i>
				<span>Home</span>
			</a>
			<a
				href="#"
				className={`nav-item ${activeSection === "buses" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "buses")}
			>
				<i className={`bi ${activeSection === "buses" ? "bi-bus-front-fill" : "bi-bus-front"}`}></i>
				<span>Buses</span>
			</a>
			<a
				href="#"
				className={`nav-item ${activeSection === "stops" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "stops")}
			>
				<i className={`bi ${activeSection === "stops" ? "bi-geo-alt-fill" : "bi-geo-alt"}`}></i>
				<span>Stops</span>
			</a>
			<a
				href="#"
				className={`nav-item ${activeSection === "tickets" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "tickets")}
			>
				<i className={`bi ${activeSection === "tickets" ? "bi-ticket-perforated-fill" : "bi-ticket-perforated"}`}></i>
				<span>Tickets</span>
			</a>
		</nav>
	);
};

export default BottomNav;

