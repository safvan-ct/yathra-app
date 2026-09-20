import React from "react";

const AD_BRANDS = [
	{
		id: "mcdonalds",
		brandName: "McDonald's",
		tagline1: "Good Food",
		tagline2: "Brighter Journeys",
		description: "Grab your favourites before you hit the road.",
		ctaText: "Order Now",
		ctaColor: "#da291c",
		cardBg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fde68a 100%)",
		borderColor: "#fcd34d",
		searchQuery: "mcdonalds near me",
		logo: (
			<div
				className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
				style={{
					width: "44px",
					height: "44px",
					background: "#da291c",
					position: "relative",
					border: "2px solid #ffffff",
				}}
			>
				<svg width="26" height="26" viewBox="0 0 100 100" fill="none">
					<path
						d="M15 90 C15 50, 30 20, 50 50 C70 20, 85 50, 85 90"
						stroke="#ffc72c"
						strokeWidth="14"
						strokeLinecap="round"
						fill="none"
					/>
				</svg>
				<span
					className="position-absolute text-white fw-bold"
					style={{ bottom: "1px", fontSize: "5.5px", letterSpacing: "-0.2px" }}
				>
					McDonald's
				</span>
			</div>
		),
		visual: (
			<div className="ad-food-visual d-flex align-items-end gap-1 flex-shrink-0">
				{/* Burger */}
				<svg width="44" height="34" viewBox="0 0 100 70" fill="none">
					<path d="M10 38 C10 15, 90 15, 90 38 Z" fill="#eab308" />
					<circle cx="35" cy="24" r="2" fill="#fef08a" />
					<circle cx="50" cy="20" r="2" fill="#fef08a" />
					<circle cx="65" cy="25" r="2" fill="#fef08a" />
					<path
						d="M8 40 Q 25 34 40 40 T 75 36 T 92 40 L 92 44 L 8 44 Z"
						fill="#22c55e"
					/>
					<rect x="12" y="44" width="76" height="4" rx="2" fill="#ef4444" />
					<rect x="10" y="48" width="80" height="8" rx="4" fill="#78350f" />
					<path d="M14 48 L 50 56 L 86 48 Z" fill="#facc15" />
					<rect x="12" y="56" width="76" height="10" rx="5" fill="#ca8a04" />
				</svg>
				{/* Fries */}
				<svg width="22" height="34" viewBox="0 0 60 80" fill="none">
					<rect x="10" y="10" width="7" height="45" rx="3" fill="#facc15" />
					<rect x="19" y="4" width="7" height="50" rx="3" fill="#fbbf24" />
					<rect x="28" y="2" width="7" height="52" rx="3" fill="#facc15" />
					<rect x="37" y="8" width="7" height="46" rx="3" fill="#fbbf24" />
					<path d="M6 35 L 14 78 L 46 78 L 54 35 Z" fill="#dc2626" />
					<path
						d="M22 62 C22 52, 26 48, 30 54 C34 48, 38 52, 38 62"
						stroke="#facc15"
						strokeWidth="3"
						strokeLinecap="round"
						fill="none"
					/>
				</svg>
				{/* Coke Cup */}
				<svg width="18" height="34" viewBox="0 0 50 85" fill="none">
					<path
						d="M30 6 L 25 24"
						stroke="#ef4444"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<ellipse cx="25" cy="24" rx="20" ry="5" fill="#f1f5f9" />
					<path d="M7 25 L 12 80 L 38 80 L 43 25 Z" fill="#0f172a" />
					<text
						x="25"
						y="55"
						fill="#ffffff"
						fontSize="10"
						fontWeight="bold"
						textAnchor="middle"
						fontStyle="italic"
					>
						Coke
					</text>
				</svg>
			</div>
		),
	},
	{
		id: "starbucks",
		brandName: "Starbucks",
		tagline1: "Fresh Brew",
		tagline2: "Smooth Journey",
		description: "Fuel your morning ride with handcrafted coffee.",
		ctaText: "Get Coffee",
		ctaColor: "#006241",
		cardBg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)",
		borderColor: "#86efac",
		searchQuery: "starbucks near me",
		logo: (
			<div
				className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
				style={{
					width: "44px",
					height: "44px",
					background: "#006241",
					position: "relative",
					border: "2px solid #ffffff",
				}}
			>
				<i
					className="bi bi-cup-hot-fill text-white"
					style={{ fontSize: "20px" }}
				></i>
			</div>
		),
		visual: (
			<div className="ad-food-visual d-flex align-items-end gap-1 flex-shrink-0">
				{/* Iced Coffee Cup */}
				<svg width="26" height="36" viewBox="0 0 60 90" fill="none">
					<path
						d="M38 5 L 30 26"
						stroke="#15803d"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<rect x="10" y="24" width="40" height="7" rx="3" fill="#e2e8f0" />
					<path
						d="M14 31 L 20 86 L 40 86 L 46 31 Z"
						fill="#854d0e"
						opacity="0.85"
					/>
					{/* Ice cubes */}
					<rect
						x="22"
						y="38"
						width="8"
						height="8"
						rx="2"
						fill="#ffffff"
						opacity="0.6"
					/>
					<rect
						x="30"
						y="48"
						width="8"
						height="8"
						rx="2"
						fill="#ffffff"
						opacity="0.6"
					/>
					<circle cx="30" cy="58" r="7" fill="#006241" />
					<polygon
						points="30,53 32,57 36,57 33,60 34,64 30,62 26,64 27,60 24,57 28,57"
						fill="#ffffff"
					/>
				</svg>
				{/* Croissant */}
				<svg width="34" height="28" viewBox="0 0 80 60" fill="none">
					<ellipse cx="40" cy="35" rx="32" ry="18" fill="#d97706" />
					<path
						d="M12 40 C 25 15, 55 15, 68 40"
						stroke="#b45309"
						strokeWidth="4"
						fill="none"
					/>
					<path
						d="M22 36 C 30 24, 50 24, 58 36"
						stroke="#92400e"
						strokeWidth="3"
						fill="none"
					/>
				</svg>
			</div>
		),
	},
	{
		id: "dominos",
		brandName: "Domino's Pizza",
		tagline1: "Hot Slices",
		tagline2: "Zero Transit Delay",
		description: "Fresh oven-baked pizza ready at your stop.",
		ctaText: "Order Pizza",
		ctaColor: "#005596",
		cardBg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #bae6fd 100%)",
		borderColor: "#7dd3fc",
		searchQuery: "dominos pizza near me",
		logo: (
			<div
				className="rounded-3 d-flex flex-column align-items-center justify-content-center flex-shrink-0 shadow-sm"
				style={{
					width: "44px",
					height: "44px",
					background: "#005596",
					position: "relative",
					transform: "rotate(45deg)",
					margin: "0 4px",
					border: "2px solid #ffffff",
				}}
			>
				<div
					style={{ transform: "rotate(-45deg)", display: "flex", gap: "3px" }}
				>
					<span
						style={{
							width: "7px",
							height: "7px",
							background: "#e31837",
							borderRadius: "50%",
						}}
					></span>
					<span
						style={{
							width: "7px",
							height: "7px",
							background: "#ffffff",
							borderRadius: "50%",
						}}
					></span>
				</div>
			</div>
		),
		visual: (
			<div className="ad-food-visual d-flex align-items-end gap-1 flex-shrink-0">
				{/* Pizza Slice */}
				<svg width="42" height="36" viewBox="0 0 100 80" fill="none">
					{/* Pizza Crust & Cheese */}
					<path d="M10 15 Q 50 10 90 15 L 50 75 Z" fill="#facc15" />
					<path
						d="M10 15 Q 50 8 90 15 L 86 20 Q 50 14 14 20 Z"
						fill="#b45309"
					/>
					{/* Pepperoni & toppings */}
					<circle cx="42" cy="30" r="6" fill="#dc2626" />
					<circle cx="60" cy="38" r="5" fill="#dc2626" />
					<circle cx="48" cy="52" r="4" fill="#dc2626" />
					<circle cx="32" cy="24" r="2.5" fill="#16a34a" />
					<circle cx="56" cy="25" r="2.5" fill="#16a34a" />
					<circle cx="40" cy="42" r="2.5" fill="#16a34a" />
				</svg>
				{/* Garlic Bread */}
				<svg width="26" height="28" viewBox="0 0 60 60" fill="none">
					<rect x="5" y="15" width="48" height="28" rx="8" fill="#d97706" />
					<line
						x1="16"
						y1="18"
						x2="16"
						y2="40"
						stroke="#78350f"
						strokeWidth="2.5"
					/>
					<line
						x1="28"
						y1="18"
						x2="28"
						y2="40"
						stroke="#78350f"
						strokeWidth="2.5"
					/>
					<line
						x1="40"
						y1="18"
						x2="40"
						y2="40"
						stroke="#78350f"
						strokeWidth="2.5"
					/>
					<circle cx="22" cy="28" r="1.5" fill="#16a34a" />
					<circle cx="34" cy="32" r="1.5" fill="#16a34a" />
				</svg>
			</div>
		),
	},
	{
		id: "kfc",
		brandName: "KFC",
		tagline1: "Crispy Cravings",
		tagline2: "Finger Lickin' Good",
		description: "Crispy chicken bucket for your journey hunger.",
		ctaText: "Get Bucket",
		ctaColor: "#e4002b",
		cardBg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #fecdd3 100%)",
		borderColor: "#fda4af",
		searchQuery: "kfc near me",
		logo: (
			<div
				className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
				style={{
					width: "44px",
					height: "44px",
					background: "#e4002b",
					position: "relative",
					border: "2px solid #ffffff",
				}}
			>
				<span
					className="text-white fw-bold"
					style={{ fontSize: "14px", letterSpacing: "1px" }}
				>
					KFC
				</span>
			</div>
		),
		visual: (
			<div className="ad-food-visual d-flex align-items-end gap-1 flex-shrink-0">
				{/* KFC Bucket */}
				<svg width="36" height="36" viewBox="0 0 70 80" fill="none">
					{/* Chicken pieces sticking out */}
					<circle cx="26" cy="22" r="10" fill="#d97706" />
					<circle cx="44" cy="20" r="11" fill="#b45309" />
					<circle cx="35" cy="14" r="9" fill="#d97706" />
					{/* Bucket body */}
					<path
						d="M12 28 L 18 76 L 52 76 L 58 28 Z"
						fill="#ffffff"
						stroke="#e4002b"
						strokeWidth="2"
					/>
					<rect x="22" y="30" width="8" height="44" fill="#e4002b" />
					<rect x="40" y="30" width="8" height="44" fill="#e4002b" />
				</svg>
				{/* Dip */}
				<svg width="22" height="24" viewBox="0 0 50 50" fill="none">
					<ellipse cx="25" cy="28" rx="20" ry="12" fill="#ef4444" />
					<ellipse cx="25" cy="24" rx="20" ry="8" fill="#fee2e2" />
					<ellipse cx="25" cy="24" rx="16" ry="6" fill="#dc2626" />
				</svg>
			</div>
		),
	},
	{
		id: "swiggy",
		brandName: "Swiggy",
		tagline1: "Hungry On The Way?",
		tagline2: "Flat 50% OFF",
		description: "Order fresh meals delivered to your nearby stop.",
		ctaText: "Order Now",
		ctaColor: "#fc8019",
		cardBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%)",
		borderColor: "#fdba74",
		searchQuery: "swiggy food order",
		logo: (
			<div
				className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
				style={{
					width: "44px",
					height: "44px",
					background: "#fc8019",
					position: "relative",
					border: "2px solid #ffffff",
				}}
			>
				<i
					className="bi bi-bag-heart-fill text-white"
					style={{ fontSize: "20px" }}
				></i>
			</div>
		),
		visual: (
			<div className="ad-food-visual d-flex align-items-end gap-1 flex-shrink-0">
				{/* Food Platter with Discount Badge */}
				<svg width="46" height="36" viewBox="0 0 90 70" fill="none">
					{/* Plate */}
					<ellipse cx="45" cy="48" rx="38" ry="14" fill="#e2e8f0" />
					<ellipse cx="45" cy="46" rx="34" ry="11" fill="#ffffff" />
					{/* Bowl of Noodles/Food */}
					<path d="M25 44 C25 30, 65 30, 65 44 Z" fill="#f59e0b" />
					{/* Chopsticks */}
					<line
						x1="20"
						y1="20"
						x2="52"
						y2="42"
						stroke="#78350f"
						strokeWidth="2.5"
					/>
					<line
						x1="24"
						y1="16"
						x2="56"
						y2="40"
						stroke="#78350f"
						strokeWidth="2.5"
					/>
					{/* 50% OFF Badge */}
					<circle cx="70" cy="22" r="14" fill="#fc8019" />
					<text
						x="70"
						y="25"
						fill="#ffffff"
						fontSize="8"
						fontWeight="bold"
						textAnchor="middle"
					>
						50%
					</text>
					<text
						x="70"
						y="32"
						fill="#ffffff"
						fontSize="6"
						fontWeight="bold"
						textAnchor="middle"
					>
						OFF
					</text>
				</svg>
			</div>
		),
	},
];

const SponsoredAdCard = ({ index = 0 }) => {
	const brand = AD_BRANDS[index % AD_BRANDS.length] || AD_BRANDS[0];

	return (
		<div
			className="sponsored-ad-banner card border-0 shadow-sm rounded-3 mb-2 overflow-hidden position-relative"
			style={{
				height: "100px",
				minHeight: "100px",
				maxHeight: "100px",
				background: brand.cardBg,
				borderColor: brand.borderColor,
				borderWidth: "1px",
				borderStyle: "solid",
				boxSizing: "border-box",
			}}
		>
			<div className="card-body p-2 px-3 h-100 d-flex align-items-center justify-content-between gap-2 position-relative">
				{/* Left Section: Logo + Taglines + Description */}
				<div
					className="d-flex align-items-center gap-2 overflow-hidden me-auto"
					style={{ minWidth: 0 }}
				>
					{brand.logo}

					<div
						className="d-flex flex-column justify-content-center overflow-hidden"
						style={{ minWidth: 0 }}
					>
						<div className="d-flex align-items-center gap-1 flex-wrap">
							<span
								className="fw-bold text-dark text-truncate"
								style={{ fontSize: "0.86rem", lineHeight: "1.2" }}
							>
								{brand.tagline1}
							</span>
							<span
								className="fw-bold text-truncate"
								style={{
									color: brand.ctaColor,
									fontSize: "0.86rem",
									lineHeight: "1.2",
								}}
							>
								• {brand.tagline2}
							</span>
						</div>
						<div
							className="text-secondary text-truncate mt-1"
							style={{ fontSize: "0.72rem", lineHeight: "1.2", maxWidth: "260px" }}
						>
							{brand.description}
						</div>
					</div>
				</div>

				{/* Middle Illustration (Food / Drink Vector) */}
				<div className="d-none d-sm-flex align-items-center justify-content-center flex-shrink-0 px-2">
					{brand.visual}
				</div>

				{/* Right CTA and Sponsored Label */}
				<div className="d-flex flex-column align-items-end justify-content-center flex-shrink-0 gap-1">
					<span
						className="text-muted fw-bold"
						style={{
							fontSize: "0.58rem",
							letterSpacing: "0.6px",
							textTransform: "uppercase",
						}}
					>
						Sponsored
					</span>
					<button
						type="button"
						className="btn btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm d-flex align-items-center gap-1 text-white border-0"
						style={{
							background: brand.ctaColor,
							fontSize: "0.74rem",
							whiteSpace: "nowrap",
							transition: "transform 0.15s ease",
						}}
						onClick={() =>
							window.open(
								`https://www.google.com/search?q=${encodeURIComponent(brand.searchQuery)}`,
								"_blank",
								"noopener,noreferrer",
							)
						}
					>
						<span>{brand.ctaText}</span>
						<i
							className="bi bi-arrow-right"
							style={{ fontSize: "0.7rem" }}
						></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default SponsoredAdCard;
