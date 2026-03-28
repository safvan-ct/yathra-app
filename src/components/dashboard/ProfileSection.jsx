import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ProfileSection = ({ navigateTo }) => {
	const { logout } = useAuth();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			setError("");
			try {
				const res = await api.get("/user/me");
				setProfile(res.data || res || {});
			} catch (err) {
				console.error("Failed to load profile", err);
				setError(err.message || "Failed to load profile.");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleLogout = () => {
		logout();
		navigateTo("login");
	};

	const getTrustStyle = (level) => {
		if (level == "high") return { color: "#198754" };
		if (level == "medium") return { color: "#0d6efd" };
		if (level == "low") return { color: "#dc3545" };
		return { color: "#ffc107" };
	};

	return (
		<div id="section-profile" className="app-section active">
			<div className="dashboard-container py-2 mb-5">
				<div className="row g-4">
					<div className="col-md-4">
						<div className="card border-0 rounded-4 shadow-sm p-4 text-center">
							<div
								className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
								style={{ width: "100px", height: "100px" }}
							>
								{loading ? (
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								) : (
									<i
										className="bi bi-person-fill text-primary"
										style={{ fontSize: "3rem" }}
									></i>
								)}
							</div>
							<h4 className="fw-bold mb-1">{profile?.name || "User"}</h4>
							<p className="text-muted small mb-3">
								{profile?.phone || "Welcome to Yathra"}
							</p>
							{error && (
								<div className="alert alert-danger py-1 small mb-3">
									{error}
								</div>
							)}
							<button
								className="btn btn-outline-danger btn-sm w-100 rounded-pill"
								onClick={handleLogout}
							>
								LOGOUT
							</button>
						</div>
					</div>
					<div className="col-md-8">
						<div className="card border-0 rounded-4 shadow-sm p-4">
							<h5 className="fw-bold mb-4">Account Overview</h5>
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
										<div className="p-3 bg-light rounded-3 text-center">
											<div className="h3 fw-bold text-primary mb-0">
												{profile?.contribution_count !== undefined
													? profile.contribution_count
													: "0"}
											</div>
											<small className="text-muted fw-bold">CONTRIBUTION</small>
										</div>
									</div>
									<div className="col-6 col-md-4">
										<div className="p-3 bg-light rounded-3 text-center">
											<div className="h3 fw-bold text-success mb-0">
												{profile?.total_points !== undefined
													? profile.total_points
													: "0"}
											</div>
											<small className="text-muted fw-bold">POINTS</small>
										</div>
									</div>
									<div className="col-6 col-md-4">
										<div className="p-3 bg-light rounded-3 text-center">
											<div className="h3 fw-bold text-primary mb-0">
												{profile?.trust_score !== undefined
													? profile.trust_score
													: "0"}
											</div>
											<small className="text-muted fw-bold">TRUST SCORE</small>
										</div>
									</div>
									<div className="col-6 col-md-4">
										<div className="p-3 bg-light rounded-3 text-center">
											<div
												className="h3 fw-bold mb-0 text-uppercase"
												style={getTrustStyle(profile?.trust_level || 0)}
											>
												{profile?.trust_level !== undefined
													? profile.trust_level
													: "low"}
											</div>
											<small className="text-muted fw-bold">TRUST LEVEL</small>
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
