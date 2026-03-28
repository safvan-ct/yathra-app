import React from "react";

const DesktopNav = ({ activeSection, setActiveSection }) => {
	const handleNavClick = (e, section) => {
		e.preventDefault();
		setActiveSection(section);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<nav className="desktop-nav d-none d-md-block">
			<div className="dashboard-container d-flex justify-content-between align-items-center">
				<div
					className="fw-800 fs-4 text-primary"
					style={{ letterSpacing: "-1px" }}
				>
					Yathra
				</div>
				<div className="nav d-flex gap-2">
					<a
						href="#"
						className={`nav-link ${activeSection === "home" ? "active" : ""}`}
						onClick={(e) => handleNavClick(e, "home")}
					>
						Home
					</a>
					<a
						href="#"
						className={`nav-link ${activeSection === "buses" ? "active" : ""}`}
						onClick={(e) => handleNavClick(e, "buses")}
					>
						Buses
					</a>
					<a
						href="#"
						className={`nav-link ${activeSection === "history" ? "active" : ""}`}
						onClick={(e) => handleNavClick(e, "history")}
					>
						History
					</a>
					<a
						href="#"
						className={`nav-link ${activeSection === "profile" ? "active" : ""}`}
						onClick={(e) => handleNavClick(e, "profile")}
					>
						Profile
					</a>
					<button
						className="btn btn-primary ms-3 rounded-pill px-4 fw-bold shadow-sm"
						onClick={(e) => handleNavClick(e, "contribute")}
					>
						<i className="bi bi-plus-lg me-1"></i> CONTRIBUTE
					</button>
				</div>
			</div>
		</nav>
	);
};

export default DesktopNav;
