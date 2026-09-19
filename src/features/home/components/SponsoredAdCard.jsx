import React from "react";

const SponsoredAdCard = () => {
	return (
		<div className="sponsored-ad-banner card border-0 shadow-sm rounded-3 mb-2 overflow-hidden position-relative">
			<div className="card-body p-2 px-3 d-flex align-items-center justify-content-between gap-2">
				{/* Left content with Logo */}
				<div className="d-flex align-items-center gap-2">
					{/* McDonald's Red Square Logo */}
					<div 
						className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
						style={{ 
							width: "42px", 
							height: "42px", 
							background: "#da291c",
							position: "relative"
						}}
					>
						{/* Golden Arches SVG */}
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

					<div>
						<div className="fw-bold text-dark lh-1" style={{ fontSize: "0.82rem" }}>
							Good Food
						</div>
						<div className="fw-bold text-dark lh-1 mt-1" style={{ fontSize: "0.82rem" }}>
							Brighter Journeys
						</div>
						<div className="text-secondary small mb-0 mt-1" style={{ fontSize: "0.66rem", lineHeight: "1.2" }}>
							Grab your favourites before you hit the road.
						</div>
					</div>
				</div>

				{/* Middle Burger, Fries & Drink Illustration */}
				<div className="d-flex align-items-center justify-content-end gap-2 flex-shrink-0">
					<div className="ad-food-visual d-flex align-items-end gap-1 flex-shrink-0 d-none d-xs-flex">
						{/* Burger Art */}
						<svg width="48" height="34" viewBox="0 0 100 70" fill="none">
							<path d="M10 38 C10 15, 90 15, 90 38 Z" fill="#eab308" />
							<circle cx="35" cy="24" r="2" fill="#fef08a" />
							<circle cx="50" cy="20" r="2" fill="#fef08a" />
							<circle cx="65" cy="25" r="2" fill="#fef08a" />
							<path d="M8 40 Q 25 34 40 40 T 75 36 T 92 40 L 92 44 L 8 44 Z" fill="#22c55e" />
							<rect x="12" y="44" width="76" height="4" rx="2" fill="#ef4444" />
							<rect x="10" y="48" width="80" height="8" rx="4" fill="#78350f" />
							<path d="M14 48 L 50 56 L 86 48 Z" fill="#facc15" />
							<rect x="12" y="56" width="76" height="10" rx="5" fill="#ca8a04" />
						</svg>

						{/* Fries Art */}
						<svg width="24" height="34" viewBox="0 0 60 80" fill="none">
							<rect x="10" y="10" width="7" height="45" rx="3" fill="#facc15" />
							<rect x="19" y="4" width="7" height="50" rx="3" fill="#fbbf24" />
							<rect x="28" y="2" width="7" height="52" rx="3" fill="#facc15" />
							<rect x="37" y="8" width="7" height="46" rx="3" fill="#fbbf24" />
							<rect x="44" y="14" width="7" height="40" rx="3" fill="#facc15" />
							<path d="M6 35 L 14 78 L 46 78 L 54 35 Z" fill="#dc2626" />
							<path d="M22 62 C22 52, 26 48, 30 54 C34 48, 38 52, 38 62" stroke="#facc15" strokeWidth="3" strokeLinecap="round" fill="none" />
						</svg>

						{/* Beverage Cup */}
						<svg width="20" height="34" viewBox="0 0 50 85" fill="none">
							<path d="M30 6 L 25 24" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
							<ellipse cx="25" cy="24" rx="20" ry="5" fill="#f1f5f9" />
							<path d="M7 25 L 12 80 L 38 80 L 43 25 Z" fill="#0f172a" />
							<text x="25" y="55" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontStyle="italic">Coke</text>
						</svg>
					</div>

					{/* Right CTA and Sponsored Label */}
					<div className="d-flex flex-column align-items-end flex-shrink-0 ms-1">
						<span className="text-muted fw-semibold mb-1" style={{ fontSize: "0.58rem", letterSpacing: "0.4px" }}>
							Sponsored
						</span>
						<button 
							className="btn btn-danger btn-sm rounded-pill px-2 py-1 fw-bold shadow-sm d-flex align-items-center gap-1"
							style={{ background: "#da291c", border: "none", fontSize: "0.68rem" }}
							onClick={() => window.open("https://www.google.com/search?q=mcdonalds+near+me", "_blank")}
						>
							Order Now <i className="bi bi-arrow-right" style={{ fontSize: "0.65rem" }}></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SponsoredAdCard;
