import React, { useEffect, useState } from "react";

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
		// Trigger entry animation
		requestAnimationFrame(() => setVisible(true));
	}, []);

	const handleClose = () => {
		setVisible(false);
		setTimeout(onClose, 350);
	};

	useEffect(() => {
		const timer = setTimeout(handleClose, 10000);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<style>{`
				.sp-overlay {
					position: fixed;
					inset: 0;
					background: rgba(10, 10, 25, 0.55);
					backdrop-filter: blur(6px);
					-webkit-backdrop-filter: blur(6px);
					z-index: 2000;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 1.5rem;
					opacity: 0;
					transition: opacity 0.3s ease;
				}
				.sp-overlay.sp-visible {
					opacity: 1;
				}
				.sp-card {
					background: #fff;
					border-radius: 24px;
					padding: 2.5rem 2rem;
					max-width: 360px;
					width: 100%;
					text-align: center;
					position: relative;
					overflow: hidden;
					box-shadow: 0 30px 80px -10px rgba(0,0,0,0.25);
					transform: translateY(40px) scale(0.95);
					transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
				}
				.sp-overlay.sp-visible .sp-card {
					transform: translateY(0) scale(1);
				}
				.sp-top-bar {
					position: absolute;
					top: 0; left: 0; right: 0;
					height: 5px;
					border-radius: 24px 24px 0 0;
				}
				.sp-top-bar-fill {
					height: 100%;
					border-radius: inherit;
					animation: sp-drain 5s linear forwards;
				}
				@keyframes sp-drain {
					from { width: 100%; }
					to   { width: 0%; }
				}
				.sp-icon-ring {
					width: 80px;
					height: 80px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 auto 1.25rem;
					font-size: 2rem;
					position: relative;
				}
				.sp-icon-ring::before {
					content: '';
					position: absolute;
					inset: -6px;
					border-radius: 50%;
					border: 2px dashed;
					opacity: 0.35;
					animation: sp-spin 8s linear infinite;
				}
				@keyframes sp-spin {
					to { transform: rotate(360deg); }
				}
				.sp-check-badge {
					position: absolute;
					bottom: -2px;
					right: -2px;
					width: 26px;
					height: 26px;
					background: #fff;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 2px 8px rgba(0,0,0,0.15);
				}
				.sp-sparkle {
					position: absolute;
					width: 6px;
					height: 6px;
					border-radius: 50%;
					opacity: 0;
					animation: sp-pop 0.6s ease forwards;
				}
				@keyframes sp-pop {
					0%   { transform: scale(0); opacity: 0; }
					50%  { transform: scale(1.5); opacity: 1; }
					100% { transform: scale(1); opacity: 0.7; }
				}
				.sp-title {
					font-size: 1.4rem;
					font-weight: 800;
					color: #0f172a;
					margin-bottom: 0.4rem;
				}
				.sp-type-badge {
					display: inline-block;
					font-size: 0.7rem;
					font-weight: 700;
					padding: 2px 10px;
					border-radius: 100px;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					margin-bottom: 0.75rem;
				}
				.sp-message {
					font-size: 0.88rem;
					color: #64748b;
					line-height: 1.5;
					margin-bottom: 1.5rem;
				}
				.sp-divider {
					height: 1px;
					background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
					margin-bottom: 1.5rem;
				}
				.sp-points-pill {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					border-radius: 100px;
					padding: 6px 14px;
					font-size: 0.8rem;
					font-weight: 600;
					margin-bottom: 1.5rem;
				}
				.sp-close-btn {
					width: 100%;
					border: none;
					border-radius: 14px;
					padding: 0.8rem;
					font-weight: 700;
					font-size: 0.95rem;
					color: #fff;
					cursor: pointer;
					transition: filter 0.2s ease, transform 0.2s ease;
				}
				.sp-close-btn:hover {
					filter: brightness(1.1);
					transform: translateY(-1px);
				}
				.sp-close-btn:active {
					transform: translateY(0);
				}
				.sp-float-dot {
					position: absolute;
					border-radius: 50%;
					opacity: 0.08;
					pointer-events: none;
				}
			`}</style>

			<div
				className={`sp-overlay ${visible ? "sp-visible" : ""}`}
				onClick={handleClose}
			>
				<div className="sp-card" onClick={(e) => e.stopPropagation()}>
					{/* Auto-dismiss progress bar */}
					<div className="sp-top-bar">
						<div
							className="sp-top-bar-fill"
							style={{ background: meta.color }}
						/>
					</div>

					{/* Floating background decoration */}
					<div
						className="sp-float-dot"
						style={{
							width: 160,
							height: 160,
							background: meta.color,
							top: -60,
							right: -50,
						}}
					/>
					<div
						className="sp-float-dot"
						style={{
							width: 100,
							height: 100,
							background: meta.color,
							bottom: -30,
							left: -30,
						}}
					/>

					{/* Icon */}
					<div
						className="sp-icon-ring"
						style={{ background: meta.colorLight, color: meta.color }}
					>
						<i className={`bi ${meta.icon}`}></i>
						<div className="sp-check-badge" style={{ color: meta.color }}>
							<i
								className="bi bi-check2"
								style={{ fontSize: "0.9rem", fontWeight: 900 }}
							></i>
						</div>
						{/* Sparkles */}
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="sp-sparkle"
								style={{
									background: meta.color,
									top: `${20 + Math.sin((i * Math.PI) / 3) * 55}%`,
									left: `${50 + Math.cos((i * Math.PI) / 3) * 55}%`,
									animationDelay: `${i * 0.1}s`,
									width: i % 2 === 0 ? 5 : 4,
									height: i % 2 === 0 ? 5 : 4,
								}}
							/>
						))}
					</div>

					{/* Content */}
					<div className="sp-title">Contribution Received!</div>

					<div
						className="sp-type-badge"
						style={{ background: meta.colorLight, color: meta.color }}
					>
						{meta.label} Suggestion
					</div>

					<div className="sp-message">{meta.message}</div>

					<div className="sp-divider" />

					{/* XP Points Pill */}
					<div
						className="sp-points-pill"
						style={{ background: meta.colorLight, color: meta.color }}
					>
						<i className="bi bi-star-fill" style={{ fontSize: "0.75rem" }}></i>
						Reward Points Earn After Approval
					</div>

					<button
						className="sp-close-btn"
						style={{
							background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
						}}
						onClick={handleClose}
					>
						Awesome, Thanks! 🎉
					</button>
				</div>
			</div>
		</>
	);
};

export default SuccessPopup;
