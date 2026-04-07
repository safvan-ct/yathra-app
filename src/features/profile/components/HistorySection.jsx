import React, { useEffect, useRef, useCallback } from "react";
import { useContributions } from "../../contributions/hooks/useContributions";
import "/src/features/profile/styles/HistorySection.css";

const TYPE_META = {
	bus: {
		icon: "bi-bus-front-fill",
		accent: "#6366f1",
		bg: "#ede9fe",
		label: "Bus",
	},
	stop: {
		icon: "bi-geo-alt-fill",
		accent: "#0ea5e9",
		bg: "#e0f2fe",
		label: "Station",
	},
	route: {
		icon: "bi-signpost-split-fill",
		accent: "#10b981",
		bg: "#d1fae5",
		label: "Route",
	},
	trip: {
		icon: "bi-calendar-event-fill",
		accent: "#f59e0b",
		bg: "#fef3c7",
		label: "Trip",
	},
	"route stop": {
		icon: "bi-pin-map-fill",
		accent: "#ec4899",
		bg: "#fce7f3",
		label: "Route Stop",
	},
};

const DEFAULT_META = {
	icon: "bi-patch-plus-fill",
	accent: "#6b7280",
	bg: "#f3f4f6",
	label: "Contribution",
};

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DayPills = ({ days, accent }) =>
	Array.isArray(days) ? (
		<div className="d-flex gap-1 mt-1">
			{DAY_LETTERS.map((l, i) => {
				const on = days[i] === 1;
				return (
					<span
						key={i}
						title={DAY_NAMES[i]}
						className={`day-pill ${on ? "on" : "off"}`}
						style={{ "--accent-color": on ? accent : "transparent" }}
					>
						{l}
					</span>
				);
			})}
		</div>
	) : null;

const CARD_ACCENT = "#6366f1";

const TypeCard = ({ icon, title, chips = [], children }) => (
	<div className="type-card-shell">
		<div className="d-flex align-items-center gap-2 mb-2">
			<div className="type-card-icon-round">
				<i className={`bi ${icon}`} />
			</div>
			<span className="type-card-title">{title}</span>
		</div>

		{chips.length > 0 && (
			<div className="d-flex flex-wrap gap-1 mb-2">
				{chips.map((chip, i) =>
					chip ? (
						<span key={i} className="chip-pill">
							{chip.icon && <i className={`bi ${chip.icon}`} />}
							{chip.label}
						</span>
					) : null,
				)}
			</div>
		)}

		{children}
	</div>
);

const BusCard = ({ info }) => (
	<TypeCard
		icon={TYPE_META["bus"].icon}
		title={info.bus_name || "Unnamed Bus"}
		chips={[
			info.bus_number && { icon: "bi-hash", label: info.bus_number },
			info.bus_category && { icon: "bi-tag", label: info.bus_category },
			info.operator_type && { icon: "bi-building", label: info.operator_type },
		].filter(Boolean)}
	>
		{info.bus_color && (
			<div className="d-flex align-items-center gap-2 mt-1">
				<div
					className="color-preview-swatch"
					style={{ background: info.bus_color }}
				/>
				<span className="small text-muted opacity-75">{info.bus_color}</span>
			</div>
		)}
	</TypeCard>
);

const StopCard = ({ info }) => (
	<TypeCard
		icon={TYPE_META["stop"].icon}
		title={info.name || "Unnamed Station"}
		chips={[
			info.code && { icon: "bi-bookmark", label: info.code },
			info.type && { icon: "bi-layers", label: info.type },
		].filter(Boolean)}
	/>
);

const RouteCard = ({ info }) => (
	<TypeCard
		icon={TYPE_META["route"].icon}
		title={`${info.origin_name || "Origin"} → ${info.destination_name || "Destination"}`}
		chips={[
			info.path_signature && {
				icon: "bi-signpost-split",
				label: info.path_signature,
			},
			info.distance && { icon: "bi-rulers", label: `${info.distance} km` },
		].filter(Boolean)}
	/>
);

const TripCard = ({ info }) => (
	<TypeCard
		icon={TYPE_META["trip"].icon}
		title={info.route_name || "Unnamed Trip"}
		chips={[
			(info.departure_time || info.arrival_time) && {
				icon: "bi-clock",
				label: `${info.departure_time || "?"} → ${info.arrival_time || "?"}`,
			},
			info.bus_name && { icon: "bi-bus-front", label: info.bus_name },
		].filter(Boolean)}
	>
		<DayPills days={info.days_of_week} accent={CARD_ACCENT} />
	</TypeCard>
);

const RouteStopCard = ({ info }) => (
	<TypeCard
		icon={TYPE_META["route stop"].icon}
		title={info.stop_name || "Suggested Stop"}
		chips={[
			info.route_name && { icon: "bi-signpost", label: info.route_name },
			info.route_stop_name && {
				icon: "bi-pin-map",
				label: `After: ${info.route_stop_name}`,
			},
			info.distance_from_origin != null && {
				icon: "bi-rulers",
				label: `${info.distance_from_origin} km from origin`,
			},
		].filter(Boolean)}
	/>
);

const AD_CARDS = [
	{
		accent: "#6366f1",
		bg: "#f5f3ff",
		icon: "bi-stars",
		emoji: "⭐",
		title: "Earn reward points",
		body: "Every approved contribution gets you points. The more you share, the more you earn!",
		cta: "Contribute Now",
		section: "contribute",
	},
	{
		accent: "#0ea5e9",
		bg: "#f0f9ff",
		icon: "bi-people-fill",
		emoji: "🤝",
		title: "Help your community",
		body: "Accurate timings help thousands of daily commuters. Your input matters.",
		cta: "Add a Trip",
		section: "contribute",
	},
	{
		accent: "#10b981",
		bg: "#f0fdf4",
		icon: "bi-award-fill",
		emoji: "🏆",
		title: "Check the leaderboard",
		body: "See how you rank among fellow contributors in your city.",
		cta: "View Rankings",
		section: "leaderboard",
	},
	{
		accent: "#f59e0b",
		bg: "#fffbeb",
		icon: "bi-bus-front-fill",
		emoji: "🚌",
		title: "Missing a bus route?",
		body: "Suggest a new bus and help others discover routes they never knew existed.",
		cta: "Suggest Bus",
		section: "contribute",
	},
];

const AdCard = ({ index, onNavigate }) => {
	const ad = AD_CARDS[index % AD_CARDS.length];
	return (
		<div
			className="ad-card-container"
			style={{
				"--ad-bg": ad.bg,
				"--ad-accent": ad.accent,
				"--ad-accent-border": `${ad.accent}22`,
				"--ad-shadow": `${ad.accent}11`,
				"--ad-accent-label-border": `${ad.accent}33`,
				"--ad-accent-shadow": `${ad.accent}44`,
				"--ad-accent-shadow-hover": `${ad.accent}55`,
			}}
		>
			<div className="ad-card-glow" />

			<div className="d-flex align-items-center justify-content-between mb-3">
				<div className="ad-card-label">
					<i className={`bi ${ad.icon}`} />
					YATHRA TIP
				</div>

				<div className="ad-card-emoji">{ad.emoji}</div>
			</div>

			<div className="pe-2">
				<div className="ad-card-title">{ad.title}</div>
				<div className="ad-card-body">{ad.body}</div>
			</div>

			<button className="ad-card-cta" onClick={() => onNavigate(ad.section)}>
				{ad.cta}
				<div className="ad-card-cta-icon-round">
					<i className="bi bi-chevron-right" style={{ color: ad.accent }} />
				</div>
			</button>
		</div>
	);
};

const ContributionDetailModal = ({ item, onClose }) => {
	if (!item) return null;

	const type = item.proposed_for?.toLowerCase();
	const meta = TYPE_META[type] || DEFAULT_META;
	const isApproved = item.status?.toLowerCase() === "approved";
	const isPending = item.status?.toLowerCase() === "pending";

	const dataArray = Array.isArray(item.proposed_data)
		? item.proposed_data
		: [item.proposed_data];

	return (
		<div className="contribution-detail-overlay" onClick={onClose}>
			<div
				className="contribution-detail-sheet shadow-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="d-md-none d-flex justify-content-center py-3">
					<div className="mobile-drag-handle"></div>
				</div>

				<div className="p-4 pt-1 pt-md-4 pb-5">
					<div className="d-flex justify-content-between align-items-center mb-4">
						<div className="d-flex align-items-center gap-3">
							<div
								className="modal-header-icon-box"
								style={{ backgroundColor: meta.bg }}
							>
								<i
									className={`bi ${meta.icon} modal-header-icon`}
									style={{ color: meta.accent }}
								></i>
							</div>
							<div>
								<h5 className="fw-800 mb-0">{meta.label} Entry</h5>
								<small className="text-muted">{item.created_time}</small>
							</div>
						</div>
						<button
							className="btn-close d-none d-md-block"
							onClick={onClose}
						></button>
					</div>

					<div
						className="modal-status-card"
						style={{
							"--status-bg": isApproved
								? "#f0fdf4"
								: isPending
									? "#fffbeb"
									: "#fef2f2",
							"--status-border": isApproved
								? "#86efac"
								: isPending
									? "#fcd34d"
									: "#fca5a5",
							"--status-color": isApproved
								? "#166534"
								: isPending
									? "#92400e"
									: "#991b1b",
						}}
					>
						<div className="d-flex align-items-center gap-2">
							<i
								className={`bi ${isApproved ? "bi-check-circle-fill" : isPending ? "bi-hourglass-split" : "bi-x-circle-fill"} fs-5`}
								style={{ color: "var(--status-color)" }}
							></i>
							<span className="status-text">
								{item.status || "Pending Review"}
							</span>
						</div>
						<div className="text-muted small fw-medium">
							{item.created_relative}
						</div>
					</div>

					<div className="mb-4">
						<h6 className="fw-bold text-dark mb-3">Proposed Information</h6>
						<div className="d-flex flex-column gap-3">
							{dataArray.map((info, i) => (
								<div key={i} className="modal-data-card">
									<div className="row g-3">
										{Object.entries(info)
											.filter(
												([k]) =>
													(k !== "id" &&
														!k.endsWith("_id") &&
														k !== "created_at" &&
														k !== "updated_at") ||
													k.toLowerCase().includes("number") ||
													k.toLowerCase().includes("code"),
											)
											.map(([k, v]) => (
												<div key={k} className="col-6">
													<div className="modal-data-label">
														{k.replace(/_/g, " ")}
													</div>
													<div className="modal-data-value">
														{k === "days_of_week" && Array.isArray(v)
															? v
																	.map((bit, i) =>
																		bit === 1
																			? [
																					"Sun",
																					"Mon",
																					"Tue",
																					"Wed",
																					"Thu",
																					"Fri",
																					"Sat",
																				][i]
																			: null,
																	)
																	.filter(Boolean)
																	.join(", ") || "--"
															: v === 1 &&
																  (k.includes("day") || k.includes("is_"))
																? "Yes"
																: v === 0 &&
																	  (k.includes("day") || k.includes("is_"))
																	? "No"
																	: String(v ?? "--")}
													</div>
												</div>
											))}
									</div>
								</div>
							))}
						</div>
					</div>

					{isApproved && (
						<div className="modal-reward-banner">
							<div className="small fw-bold text-uppercase opacity-75 mb-1">
								Contribution Reward
							</div>
							<div className="h4 fw-900 mb-0">
								<i className="bi bi-stars me-2"></i>+{item.reward?.points || 0}{" "}
								Points Earned
							</div>
						</div>
					)}

					<button
						className="btn btn-light w-100 mt-3 py-3 fw-bold rounded-4 d-md-none"
						onClick={onClose}
					>
						Close Details
					</button>
				</div>
			</div>
		</div>
	);
};

const HistoryItem = ({ item, onClick }) => {
	const dataArray = Array.isArray(item.proposed_data)
		? item.proposed_data
		: [item.proposed_data];

	const isApproved = item.status?.toLowerCase() === "approved";
	const isPending = item.status?.toLowerCase() === "pending";
	const type = item.proposed_for?.toLowerCase();
	const meta = TYPE_META[type] || DEFAULT_META;

	const statusColor = isApproved
		? "#10b981"
		: isPending
			? "#f59e0b"
			: "#ef4444";

	const statusColorRgb = isApproved
		? "16, 185, 129"
		: isPending
			? "245, 158, 11"
			: "239, 68, 68";

	return (
		<div className="history-item-container" onClick={onClick}>
			<div className="d-flex align-items-center gap-3">
				<div
					className="history-item-icon-round"
					style={{ "--icon-bg": meta.bg, "--icon-color": meta.accent }}
				>
					<i className={`bi ${meta.icon}`} />
				</div>

				<div className="flex-grow-1 min-w-0 py-1">
					<div className="history-item-subject">
						{dataArray.slice(0, 1).map((info) => {
							if (type === "bus")
								return info.bus_name || info.bus_number || "Bus Details";
							if (type === "stop") return info.name || "Station Details";
							if (type === "route")
								return `${info.origin_name || "?"} → ${info.destination_name || "?"}`;
							if (type === "trip") return info.route_name || "Trip Details";
							if (type === "route stop")
								return info.stop_name || "Route Stop Details";
							return "Contribution Detail";
						})}
					</div>

					<div className="history-item-meta-row">
						<span
							className="history-item-type-label"
							style={{ "--icon-color": meta.accent, "--icon-bg": meta.bg }}
						>
							{meta.label}
						</span>
						<span className="opacity-25">•</span>
						<span className="fw-medium text-muted">
							{item.created_relative || "recently"}
						</span>
						<span className="opacity-25">•</span>
						<div className="d-flex align-items-center gap-2">
							<div
								className="status-dot"
								style={{
									"--status-color": statusColor,
									"--status-color-rgb": statusColorRgb,
								}}
							/>
							<span
								className="status-label"
								style={{ "--status-color": statusColor }}
							>
								{item.status || "Pending"}
							</span>
						</div>
					</div>
				</div>

				<div className="history-item-action-area">
					{isApproved && item.reward?.points > 0 ? (
						<div className="point-badge">
							<i className="bi bi-stars"></i>+{item.reward.points}
						</div>
					) : (
						<i className="bi bi-chevron-right history-item-chevron"></i>
					)}
				</div>
			</div>
		</div>
	);
};

const HistorySection = ({ setActiveSection }) => {
	const {
		history,
		loading,
		loadingMore,
		hasMore,
		error,
		fetchHistory,
		fetchMore,
	} = useContributions();
	const [selectedItem, setSelectedItem] = React.useState(null);

	useEffect(() => {
		fetchHistory();
	}, [fetchHistory]);

	const handleScroll = useCallback(
		(e) => {
			const { scrollTop, scrollHeight, clientHeight } = e.target;
			if (
				scrollHeight - scrollTop <= clientHeight + 200 &&
				hasMore &&
				!loadingMore
			) {
				fetchMore();
			}
		},
		[hasMore, loadingMore, fetchMore],
	);

	if (loading && !history.length) {
		return (
			<div className="d-flex justify-content-center py-5">
				<div className="spinner-border text-primary" role="status" />
			</div>
		);
	}

	return (
		<div
			className="d-flex flex-column bg-white position-relative"
			style={{ height: "100dvh" }}
		>
			<div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-white sticky-top shadow-sm z-3">
				<div className="d-flex align-items-center gap-2">
					<div className="history-header-icon-box">
						<i className="bi bi-clock-history text-primary fs-5" />
					</div>
					<div>
						<h5 className="fw-900 mb-0">History</h5>
						<p className="text-muted small mb-0 fw-bold opacity-75">
							Your contribution journey
						</p>
					</div>
				</div>
				<button
					className="btn btn-light rounded-circle shadow-sm border history-back-btn"
					onClick={() => setActiveSection("contribute")}
				>
					<i className="bi bi-arrow-left" />
				</button>
			</div>

			<div
				className="flex-grow-1 overflow-auto bg-light"
				onScroll={handleScroll}
			>
				{error && (
					<div className="alert alert-danger mx-3 my-3 rounded-4">{error}</div>
				)}

				<AdCard index={0} onNavigate={setActiveSection} />

				<div className="history-list px-3 pb-5 mb-5">
					<div className="bg-white rounded-3 border shadow-sm">
						{history.map((item, idx) => (
							<React.Fragment key={item.id}>
								<HistoryItem
									item={item}
									onClick={() => setSelectedItem(item)}
								/>
								{/* {idx % 5 === 4 && idx !== history.length - 1 && (
									<AdCard index={Math.floor(idx / 5) + 1} onNavigate={setActiveSection} />
								)} */}
							</React.Fragment>
						))}

						{loadingMore && (
							<div className="text-center py-4">
								<div className="spinner-border spinner-border-sm text-primary" />
							</div>
						)}

						{!loading && !history.length && (
							<div className="text-center py-5 px-4">
								<div className="no-history-icon-box mb-3">
									<i className="bi bi-clock-history text-muted fs-1" />
								</div>
								<h6 className="fw-bold text-dark">No History Found</h6>
								<p className="text-muted small">
									Start contributing to see your activity logs here!
								</p>
								<button
									className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
									onClick={() => setActiveSection("contribute")}
								>
									Contribute Now
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<ContributionDetailModal
				item={selectedItem}
				onClose={() => setSelectedItem(null)}
			/>
		</div>
	);
};

export default HistorySection;
