import React, { useEffect, useRef, useCallback } from "react";
import { useContributions } from "../../../src/hooks/useContributions";

/* ─────────────────────────────────────────────────────────────
   Per-type meta: icon, accent colour, label
───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   Day pill row — reused for Trip cards
───────────────────────────────────────────────────────────── */
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
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: "22px",
							height: "22px",
							borderRadius: "5px",
							fontSize: "0.6rem",
							fontWeight: 800,
							border: `1.5px solid ${on ? accent : "#e2e8f0"}`,
							background: on ? accent : "#f8fafc",
							color: on ? "#fff" : "#cbd5e1",
							userSelect: "none",
						}}
					>
						{l}
					</span>
				);
			})}
		</div>
	) : null;

/* ─────────────────────────────────────────────────────────────
/* ─────────────────────────────────────────────────────────────
   UNIFIED card shell — same colour for every type.
   Only the icon, title, and chip data differ.
───────────────────────────────────────────────────────────── */
const CARD_ACCENT = "#6366f1"; // single accent used everywhere

const TypeCard = ({ icon, title, chips = [], children }) => (
	<div
		className="rounded-3 p-3 w-100"
		style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
	>
		{/* header row */}
		<div className="d-flex align-items-center gap-2 mb-2">
			<div
				className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
				style={{ width: "32px", height: "32px", background: "#ede9fe" }}
			>
				<i
					className={`bi ${icon}`}
					style={{ color: CARD_ACCENT, fontSize: "0.9rem" }}
				/>
			</div>
			<span
				className="fw-bold text-dark text-truncate"
				style={{ fontSize: "0.88rem" }}
			>
				{title}
			</span>
		</div>

		{/* chip row */}
		{chips.length > 0 && (
			<div className="d-flex flex-wrap gap-1 mb-2">
				{chips.map((chip, i) =>
					chip ? (
						<span
							key={i}
							className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1"
							style={{
								background: "#f1f5f9",
								border: "1px solid #e2e8f0",
								color: "#475569",
								fontSize: "0.65rem",
								fontWeight: 600,
							}}
						>
							{chip.icon && (
								<i
									className={`bi ${chip.icon}`}
									style={{ fontSize: "0.6rem" }}
								/>
							)}
							{chip.label}
						</span>
					) : null,
				)}
			</div>
		)}

		{children}
	</div>
);

/* ── 1. BUS ── */
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
					style={{
						width: "14px",
						height: "14px",
						borderRadius: "4px",
						background: info.bus_color,
						border: "1px solid rgba(0,0,0,0.1)",
						flexShrink: 0,
					}}
				/>
				<span style={{ fontSize: "0.65rem", color: "#64748b" }}>
					{info.bus_color}
				</span>
			</div>
		)}
	</TypeCard>
);

/* ── 2. STOP / STATION ── */
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

/* ── 3. ROUTE ── */
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

/* ── 4. TRIP ── */
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

/* ── 5. ROUTE STOP ── */
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
/* ─────────────────────────────────────────────────────────────
   Ad Cards — rotating community prompts
───────────────────────────────────────────────────────────── */
const AD_CARDS = [
	{
		accent: "#6366f1",
		bg: "#f5f3ff",
		iconBg: "#ede9fe",
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
		iconBg: "#e0f2fe",
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
		iconBg: "#d1fae5",
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
		iconBg: "#fef3c7",
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
			className="mx-3 my-2 rounded-4 p-3"
			style={{
				background: ad.bg,
				border: `1.5px dashed ${ad.accent}55`,
			}}
		>
			{/* tiny label */}
			<div
				className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1 mb-2"
				style={{
					background: ad.iconBg,
					fontSize: "0.6rem",
					fontWeight: 700,
					color: ad.accent,
					letterSpacing: "0.5px",
				}}
			>
				<i className={`bi ${ad.icon}`} style={{ fontSize: "0.65rem" }} />
				YATHRA TIP
			</div>

			<div className="d-flex align-items-center gap-3">
				{/* emoji avatar */}
				<div
					className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
					style={{
						width: "48px",
						height: "48px",
						background: ad.iconBg,
						fontSize: "1.5rem",
					}}
				>
					{ad.emoji}
				</div>

				{/* text */}
				<div className="flex-grow-1">
					<div
						className="fw-bold text-dark mb-1"
						style={{ fontSize: "0.85rem" }}
					>
						{ad.title}
					</div>
					<div
						className="text-muted"
						style={{ fontSize: "0.75rem", lineHeight: 1.4 }}
					>
						{ad.body}
					</div>
				</div>
			</div>

			{/* full-width CTA */}
			<button
				className="btn w-100 mt-3 fw-bold rounded-3"
				style={{
					background: ad.accent,
					color: "#fff",
					fontSize: "0.78rem",
					padding: "10px",
					border: "none",
					letterSpacing: "0.3px",
				}}
				onClick={() => onNavigate(ad.section)}
			>
				{ad.cta} <i className="bi bi-arrow-right ms-1" />
			</button>
		</div>
	);
};

/* ─────────────────────────────────────────────────────────────
   6. DETAILS MODAL / BOTTOM SHEET
───────────────────────────────────────────────────────────── */
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
		<div
			className="contribution-detail-overlay"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				backdropFilter: "blur(4px)",
				zIndex: 2000,
				display: "flex",
				alignItems: "flex-end", // Bottom sheet by default
				justifyContent: "center",
			}}
			onClick={onClose}
		>
			<div
				className="contribution-detail-sheet shadow-lg"
				style={{
					backgroundColor: "#fff",
					width: "100%",
					maxWidth: "600px",
					maxHeight: "85vh",
					overflowY: "auto",
					borderRadius: "24px 24px 0 0", // Mobile style
					paddingBottom: "env(safe-area-inset-bottom)",
					animation: "slideUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
					position: "relative",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Drag Handle for Mobile */}
				<div className="d-md-none d-flex justify-content-center py-3">
					<div
						style={{
							width: "40px",
							height: "5px",
							background: "#e2e8f0",
							borderRadius: "10px",
						}}
					></div>
				</div>

				<div className="p-4 pt-1 pt-md-4">
					{/* Header section */}
					<div className="d-flex justify-content-between align-items-center mb-4">
						<div className="d-flex align-items-center gap-3">
							<div
								className="rounded-3 d-flex align-items-center justify-content-center"
								style={{
									width: "48px",
									height: "48px",
									backgroundColor: meta.bg,
								}}
							>
								<i
									className={`bi ${meta.icon}`}
									style={{ fontSize: "1.2rem", color: meta.accent }}
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

					{/* Status Card */}
					<div
						className="p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between"
						style={{
							backgroundColor: isApproved
								? "#f0fdf4"
								: isPending
									? "#fffbeb"
									: "#fef2f2",
							border: `1.5px solid ${isApproved ? "#86efac" : isPending ? "#fcd34d" : "#fca5a5"}`,
						}}
					>
						<div className="d-flex align-items-center gap-2">
							<i
								className={`bi ${isApproved ? "bi-check-circle-fill text-success" : isPending ? "bi-hourglass-split text-warning" : "bi-x-circle-fill text-danger"} fs-5`}
							></i>
							<span
								className="fw-bold"
								style={{
									color: isApproved
										? "#166534"
										: isPending
											? "#92400e"
											: "#991b1b",
									fontSize: "0.95rem",
								}}
							>
								{item.status || "Pending Review"}
							</span>
						</div>
						<div className="text-muted small fw-medium">
							{item.created_relative}
						</div>
					</div>

					{/* Data Details */}
					<div className="mb-4">
						<h6 className="fw-bold text-dark mb-3">Proposed Information</h6>
						<div className="d-flex flex-column gap-3">
							{dataArray.map((info, i) => (
								<div
									key={i}
									className="p-3 rounded-4 border-0"
									style={{
										backgroundColor: "#f8fafc",
										border: "1px solid #e2e8f0 !important",
									}}
								>
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
													<div
														className="text-muted text-uppercase fw-bold mb-1"
														style={{
															fontSize: "0.62rem",
															letterSpacing: "0.5px",
														}}
													>
														{k.replace(/_/g, " ")}
													</div>
													<div
														className="text-dark fw-bold"
														style={{
															fontSize: "0.85rem",
															wordBreak: "break-all",
														}}
													>
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

					{/* Reward / Footer Section */}
					{isApproved && (
						<div
							className="rounded-4 p-3 text-center mb-2"
							style={{
								background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
								color: "#fff",
							}}
						>
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

			<style>{`
				@keyframes slideUp {
					from { transform: translateY(100%); }
					to { transform: translateY(0); }
				}
				@media (min-width: 768px) {
					.contribution-detail-overlay {
						align-items: center !important;
					}
					.contribution-detail-sheet {
						border-radius: 24px !important;
						animation: fadeIn 0.3s ease !important;
					}
				}
				@keyframes fadeIn {
					from { opacity: 0; transform: scale(0.95); }
					to { opacity: 1; transform: scale(1); }
				}
			`}</style>
		</div>
	);
};

/* ─────────────────────────────────────────────────────────────
   Single history item card
───────────────────────────────────────────────────────────── */
const iconFor = (rawType) => {
	const m = TYPE_META[rawType?.toLowerCase()] || DEFAULT_META;
	return m.icon;
};

const HistoryItem = ({ item, onClick }) => {
	const dataArray = Array.isArray(item.proposed_data)
		? item.proposed_data
		: [item.proposed_data];

	const isApproved = item.status?.toLowerCase() === "approved";
	const isPending = item.status?.toLowerCase() === "pending";
	const type = item.proposed_for?.toLowerCase();
	const meta = TYPE_META[type] || DEFAULT_META;

	return (
		<div
			className="list-group-item border-0 border-bottom bg-transparent p-4 position-relative"
			style={{
				cursor: "pointer",
				transition: "all 0.2s ease",
				borderBottomColor: "#f1f5f9 !important",
			}}
			onClick={onClick}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.03)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor = "transparent";
			}}
		>
			{/* Timeline line connector */}
			<div
				className="position-absolute"
				style={{
					top: 0,
					bottom: 0,
					left: "44px",
					width: "2px",
					background: "#f1f5f9",
					zIndex: 0,
				}}
			/>

			{/* ── Header row ── */}
			<div
				className="d-flex justify-content-between align-items-start mb-3 position-relative"
				style={{ zIndex: 1 }}
			>
				<div className="d-flex align-items-center gap-3">
					{/* type icon badge */}
					<div
						className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
						style={{
							width: "40px",
							height: "40px",
							background: meta.bg,
							flexShrink: 0,
							border: "2px solid #fff",
						}}
					>
						<i
							className={`bi ${meta.icon}`}
							style={{ color: meta.accent, fontSize: "1.1rem" }}
						/>
					</div>
					<div>
						<div className="fw-bolder text-dark" style={{ fontSize: "0.9rem" }}>
							{meta.label}
						</div>
						<div className="text-muted" style={{ fontSize: "0.72rem" }}>
							<i className="bi bi-clock me-1" />
							{item.created_relative || "recently"}
						</div>
					</div>
				</div>

				{/* status badge */}
				<span
					className="badge rounded-pill py-2 px-3"
					style={{
						fontSize: "0.68rem",
						fontWeight: 700,
						background: isApproved
							? "#d1fae5"
							: isPending
								? "#fef3c7"
								: "#fee2e2",
						color: isApproved ? "#065f46" : isPending ? "#92400e" : "#991b1b",
						border: `1px solid ${isApproved ? "#6ee7b7" : isPending ? "#fde68a" : "#fca5a5"}`,
					}}
				>
					<i
						className={`bi me-1 ${isApproved ? "bi-check-circle-fill" : isPending ? "bi-hourglass-split" : "bi-x-circle-fill"}`}
					/>
					{item.status || "Pending"}
				</span>
			</div>

			{/* ── Data summary (compact) ── */}
			<div className="ps-5 mb-3 position-relative" style={{ zIndex: 1 }}>
				{dataArray.slice(0, 1).map((info, i) => (
					<div
						key={i}
						className="text-dark fw-bold"
						style={{ fontSize: "0.92rem" }}
					>
						{type === "bus" &&
							(info.bus_name || info.bus_number || "Bus Details")}
						{type === "stop" && (info.name || "Station Details")}
						{type === "route" &&
							`${info.origin_name || "?"} → ${info.destination_name || "?"}`}
						{type === "trip" && (info.route_name || "Trip Details")}
						{type === "route stop" && (info.stop_name || "Route Stop Details")}
						{!["bus", "stop", "route", "trip", "route stop"].includes(type) &&
							"Tap for Details"}
					</div>
				))}
				<div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
					Click to see all{" "}
					{
						Object.keys(dataArray[0] || {}).filter(
							(k) =>
								(k !== "id" &&
									!k.endsWith("_id") &&
									k !== "created_at" &&
									k !== "updated_at") ||
								k.toLowerCase().includes("number") ||
								k.toLowerCase().includes("code"),
						).length
					}{" "}
					proposed details
				</div>
			</div>

			{/* ── Footer row ── */}
			<div
				className="d-flex align-items-center justify-content-between pt-1 ps-5 position-relative"
				style={{ zIndex: 1 }}
			>
				<div
					className="text-muted d-flex align-items-center gap-1"
					style={{ fontSize: "0.72rem" }}
				>
					<i className="bi bi-calendar3" />
					{item.created_time}
				</div>
				{isApproved && (
					<span
						style={{ color: "#6366f1", fontWeight: 800, fontSize: "0.85rem" }}
					>
						<i className="bi bi-stars me-1"></i>+{item.reward?.points || 0} pts
					</span>
				)}
			</div>
		</div>
	);
};

/* ─────────────────────────────────────────────────────────────
   Main Section
───────────────────────────────────────────────────────────── */
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchHistory]);

	/* Use a callback ref for the sentinel. 
	   This is more reliable than a standard useEffect + ref because 
	   it re-runs the logic as soon as the element is rendered in the DOM. */
	const setSentinel = useCallback(
		(el) => {
			if (!el) return;

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						console.log("Sentinel intersecting, fetching more...");
						fetchMore();
					}
				},
				{
					threshold: 0.1,
					rootMargin: "200px",
				},
			);

			observer.observe(el);
		},
		[fetchMore],
	);

	/* Build the flat list interleaved with ads every 3 items */
	const buildList = () => {
		const elements = [];
		let adCount = 0;

		history.forEach((item, idx) => {
			elements.push(
				<HistoryItem
					key={`item-${idx}`}
					item={item}
					onClick={() => setSelectedItem(item)}
				/>,
			);

			// inject ad after every 3rd real item
			if ((idx + 1) % 3 === 0) {
				elements.push(
					<AdCard
						key={`ad-${adCount}`}
						index={adCount}
						onNavigate={setActiveSection}
					/>,
				);
				adCount++;
			}
		});

		return elements;
	};

	return (
		<div id="section-history" className="app-section active">
			{/* animation keyframe */}
			<style>{`
				@keyframes pulse {
					0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,.4); }
					50% { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
				}
			`}</style>

			<div className="dashboard-container py-4 pb-5 mb-5">
				<div className="row">
					<div className="col-lg-8 mx-auto">
						<div className="card border-0 shadow-sm rounded-4 overflow-hidden">
							{/* ── Card header ── */}
							<div className="card-header bg-white border-0 p-4 pb-0">
								<div className="d-flex align-items-center gap-3 mb-1">
									<div
										className="d-flex align-items-center justify-content-center rounded-3"
										style={{
											width: "44px",
											height: "44px",
											background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
										}}
									>
										<i className="bi bi-clock-history text-white fs-5" />
									</div>
									<div>
										<h4 className="fw-800 mb-0">My Contributions</h4>
										<p className="text-muted small mb-0">
											Timeline of bus timings / routes you've shared
										</p>
									</div>
								</div>
							</div>

							{/* ── Loading ── */}
							{loading && (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							)}

							{/* ── Error ── */}
							{!loading && error && (
								<div className="p-4">
									<div className="alert alert-danger py-2 small mb-0">
										{error}
									</div>
								</div>
							)}

							{/* ── Empty ── */}
							{!loading && history.length === 0 && !error && (
								<div className="text-center py-5">
									<div
										className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
										style={{
											width: "72px",
											height: "72px",
											background: "#ede9fe",
										}}
									>
										<i
											className="bi bi-clock-history fs-2"
											style={{ color: "#6366f1" }}
										/>
									</div>
									<p className="text-muted fw-bold mb-1">
										No contributions yet
									</p>
									<p className="text-muted small">
										Start sharing and earn your first points!
									</p>
									<button
										className="btn btn-sm btn-primary rounded-pill px-4 mt-2"
										onClick={() => setActiveSection("contribute")}
									>
										<i className="bi bi-plus-lg me-1" />
										Add Entry
									</button>
								</div>
							)}

							{/* ── List ── */}
							{!loading && history.length > 0 && (
								<>
									<div className="px-4 pt-3 pb-1">
										<h6
											className="text-muted mb-0 fw-bold"
											style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
										>
											ACTIVITY HISTORY &nbsp;·&nbsp; {history.length} ITEM
											{history.length !== 1 ? "S" : ""}
										</h6>
									</div>
									<div className="list-group list-group-flush">
										{buildList()}

										{/* ── Infinite scroll sentinel ── */}
										<div
											ref={setSentinel}
											style={{ background: "transparent" }}
										/>
									</div>
								</>
							)}

							{/* ── Footer: loading spinner or end-of-list ── */}
							<div className="card-footer bg-white border-top text-center p-3">
								{loadingMore ? (
									<div
										className="d-flex align-items-center justify-content-center gap-2 text-muted py-1"
										style={{ fontSize: "0.8rem" }}
									>
										<div
											className="spinner-border spinner-border-sm text-primary"
											role="status"
										/>
										Loading more…
									</div>
								) : !hasMore && history.length > 0 ? (
									<div
										className="text-muted py-1"
										style={{ fontSize: "0.75rem" }}
									>
										<i className="bi bi-check-all me-1 text-success" />
										All contributions loaded
									</div>
								) : (
									<button
										className="btn btn-link btn-sm text-decoration-none fw-bold text-primary"
										onClick={() => setActiveSection("contribute")}
									>
										<i className="bi bi-plus-lg me-1" />
										ADD NEW ENTRY
									</button>
								)}
							</div>
						</div>
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
