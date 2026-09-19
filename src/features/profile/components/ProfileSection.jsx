import { useEffect } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import "../styles/Profile.css";

const ProfileSection = ({ navigateTo }) => {
	const { logout } = useAuth();
	const { profile, loading, error, fetchProfile } = useProfile();

	useEffect(() => {
		fetchProfile();
	}, []);

	const handleLogout = () => {
		logout();
		navigateTo("login");
	};

	const getTrustClass = (level) => {
		if (level === "high") return "trust-level-high";
		if (level === "medium") return "trust-level-medium";
		if (level === "low") return "trust-level-low";
		return "trust-level-none";
	};

	return (
		<div id="section-profile" className="app-section active">
			<div className="dashboard-container px-1 px-sm-3 mt-1">
				<div className="row g-2">
					<div className="col-md-4">
						<div className="card border-0 rounded-4 shadow-sm p-3 text-center bg-white mb-2">
							<div className="profile-avatar-container mb-2">
								{loading ? (
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								) : (
									<i className="bi bi-person-fill profile-avatar-icon"></i>
								)}
							</div>
							<h6
								className="fw-bold mb-1 text-dark"
								style={{ fontSize: "0.95rem" }}
							>
								{profile?.name || "User"}
							</h6>
							<p
								className="text-muted small mb-2"
								style={{ fontSize: "0.72rem" }}
							>
								{profile?.phone || "Welcome to Yathra"}
							</p>
							{error && (
								<div
									className="alert alert-danger py-1 px-2 small mb-2"
									style={{ fontSize: "11px" }}
								>
									{error}
								</div>
							)}
							<button
								className="btn btn-outline-danger btn-sm w-100 rounded-pill py-1 fw-bold"
								style={{ fontSize: "0.75rem" }}
								onClick={handleLogout}
							>
								LOGOUT
							</button>
						</div>
					</div>

					<div className="col-md-8">
						<div className="card border-0 rounded-4 shadow-sm p-3 bg-white mb-2">
							<h6
								className="fw-bold mb-2 text-dark"
								style={{ fontSize: "0.95rem" }}
							>
								Account Overview
							</h6>
							{loading && (
								<div className="text-center py-3">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							)}
							{!loading && (
								<div className="row g-3">
									<div className="col-6 col-md-4">
										<div className="stat-card">
											<div className="stat-value text-primary">
												{profile?.contribution_count !== undefined
													? profile.contribution_count
													: "0"}
											</div>
											<small className="stat-label">CONTRIBUTION</small>
										</div>
									</div>
									<div className="col-6 col-md-4">
										<div className="stat-card">
											<div className="stat-value text-success">
												{profile?.total_points !== undefined
													? profile.total_points
													: "0"}
											</div>
											<small className="stat-label">POINTS</small>
										</div>
									</div>
									<div className="col-6 col-md-4">
										<div className="stat-card">
											<div className="stat-value text-primary">
												{profile?.trust_score !== undefined
													? profile.trust_score
													: "0"}
											</div>
											<small className="stat-label">TRUST SCORE</small>
										</div>
									</div>
									<div className="col-6 col-md-4">
										<div className="stat-card">
											<div
												className={`trust-level-badge ${getTrustClass(profile?.trust_level || 0)}`}
											>
												{profile?.trust_level !== undefined
													? profile.trust_level
													: "low"}
											</div>
											<small className="stat-label">TRUST LEVEL</small>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileSection;
