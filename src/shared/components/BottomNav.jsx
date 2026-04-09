import "../styles/Navigation.css";

const BottomNav = ({ activeSection, setActiveSection, token }) => {
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
				<i className="bi bi-house-door-fill"></i>
				<span>Home</span>
			</a>
			<a
				href="#"
				className={`nav-item ${activeSection === "buses" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "buses")}
			>
				<i className="bi bi-bus-front"></i>
				<span>Buses</span>
			</a>
			<div
				className={`nav-item ${activeSection === "contribute" ? "active" : ""}`}
				onClick={() => handleNavClick(null, "contribute")}
			>
				<div className="btn-contribute-float">
					<i className="bi bi-plus-lg"></i>
				</div>
				<span className="bottom-nav-label-spacing">Contribute</span>
			</div>
			<a
				href="#"
				className={`nav-item ${activeSection === "history" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "history")}
			>
				<i className="bi bi-clock-history"></i>
				<span>History</span>
			</a>
			<a
				href="#"
				className={`nav-item ${activeSection === "profile" ? "active" : ""}`}
				onClick={(e) => handleNavClick(e, "profile")}
			>
				<i
					className={`bi ${token ? "bi-person-circle" : "bi-box-arrow-in-right"}`}
				></i>
				<span>{token ? "Profile" : "Login"}</span>
			</a>
		</nav>
	);
};

export default BottomNav;
