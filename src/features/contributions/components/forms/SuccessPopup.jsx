import { useEffect, useState } from "react";
import "../../styles/Forms.css";

const TYPE_META = {
	bus: {
		icon: "bi-bus-front",
		color: "#0d6efd",
		colorLight: "rgba(13,110,253,0.12)",
		label: "Bus",
		message: "We'll review your bus suggestion and add it soon.",
	},
	station: {
		icon: "bi-geo-alt",
		color: "#198754",
		colorLight: "rgba(25,135,84,0.12)",
		label: "Station",
		message: "Your station suggestion is now under moderation.",
	},
	route: {
		icon: "bi-signpost",
		color: "#6f42c1",
		colorLight: "rgba(111,66,193,0.12)",
		label: "Route",
		message: "Our team will validate your route suggestion shortly.",
	},
	stop: {
		icon: "bi-pin-map",
		color: "#fd7e14",
		colorLight: "rgba(253,126,20,0.12)",
		label: "Stop",
		message: "Your stop suggestion has been logged for review.",
	},
	trip: {
		icon: "bi-calendar-event",
		color: "#dc3545",
		colorLight: "rgba(220,53,69,0.12)",
		label: "Trip",
		message: "Your trip schedule suggestion is pending review.",
	},
};

const SuccessPopup = ({ type, onClose }) => {
	const [visible, setVisible] = useState(false);
	const meta = TYPE_META[type] || TYPE_META["bus"];

	useEffect(() => {
		requestAnimationFrame(() => setVisible(true));
	}, []);

	const handleClose = () => {
		setVisible(false);
		setTimeout(onClose, 350);
	};

	useEffect(() => {
		const timer = setTimeout(handleClose, 10000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className={`sp-overlay ${visible ? "sp-visible" : ""}`}
			onClick={handleClose}
			style={{
				"--sp-color": meta.color,
				"--sp-color-light": meta.colorLight,
				"--sp-btn-bg": `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
			}}
		>
			<div className="sp-card" onClick={(e) => e.stopPropagation()}>
				<div className="sp-top-bar">
					<div className="sp-top-bar-fill" />
				</div>

				<div
					className="sp-float-dot"
					style={{
						width: 160,
						height: 160,
						top: -60,
						right: -50,
					}}
				/>
				<div
					className="sp-float-dot"
					style={{
						width: 100,
						height: 100,
						bottom: -30,
						left: -30,
					}}
				/>

				<div className="sp-icon-ring">
					<i className={`bi ${meta.icon}`}></i>
					<div className="sp-check-badge">
						<i
							className="bi bi-check2"
							style={{ fontSize: "0.9rem", fontWeight: 900 }}
						></i>
					</div>

					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="sp-sparkle"
							style={{
								top: `${20 + Math.sin((i * Math.PI) / 3) * 55}%`,
								left: `${50 + Math.cos((i * Math.PI) / 3) * 55}%`,
								animationDelay: `${i * 0.1}s`,
								width: i % 2 === 0 ? 5 : 4,
								height: i % 2 === 0 ? 5 : 4,
							}}
						/>
					))}
				</div>

				<div className="sp-title">Contribution Received!</div>

				<div className="sp-type-badge">{meta.label} Suggestion</div>

				<div className="sp-message">{meta.message}</div>

				<div className="sp-divider" />

				<div className="sp-points-pill">
					<i className="bi bi-star-fill" style={{ fontSize: "0.75rem" }}></i>
					Reward Points Earn After Approval
				</div>

				<button className="sp-close-btn" onClick={handleClose}>
					Awesome, Thanks! 🎉
				</button>
			</div>
		</div>
	);
};

export default SuccessPopup;
