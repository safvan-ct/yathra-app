import React from "react";

const HeaderIllustration = () => {
	return (
		<div className="header-illustration-container position-absolute end-0 top-0 bottom-0 overflow-hidden pointer-events-none">
			<svg
				viewBox="0 0 360 160"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="header-svg-art"
				preserveAspectRatio="xMaxYMid meet"
			>
				<defs>
					{/* Sky and sun gradients */}
					<radialGradient id="sunGlow" cx="60%" cy="40%" r="50%">
						<stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
						<stop offset="60%" stopColor="#fde047" stopOpacity="0.4" />
						<stop offset="100%" stopColor="#fde047" stopOpacity="0" />
					</radialGradient>
					
					<linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
						<stop offset="100%" stopColor="#eff6ff" stopOpacity="0.2" />
					</linearGradient>

					<linearGradient id="hillFar" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#bfdbfe" />
						<stop offset="100%" stopColor="#93c5fd" />
					</linearGradient>

					<linearGradient id="hillMid" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#a7f3d0" />
						<stop offset="100%" stopColor="#6ee7b7" />
					</linearGradient>

					<linearGradient id="hillNear" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#34d399" />
						<stop offset="100%" stopColor="#10b981" />
					</linearGradient>

					<linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#64748b" />
						<stop offset="100%" stopColor="#475569" />
					</linearGradient>

					<linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#3b82f6" />
						<stop offset="50%" stopColor="#1d4ed8" />
						<stop offset="100%" stopColor="#1e40af" />
					</linearGradient>

					<linearGradient id="busWindowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#1e293b" />
						<stop offset="100%" stopColor="#0f172a" />
					</linearGradient>

					<filter id="busShadow" x="-10%" y="-10%" width="130%" height="140%">
						<feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
					</filter>
				</defs>

				{/* Sun */}
				<circle cx="210" cy="50" r="42" fill="url(#sunGlow)" />
				<circle cx="210" cy="50" r="18" fill="#fef08a" opacity="0.8" />

				{/* Clouds */}
				<path
					d="M130 55 C130 48, 140 44, 150 48 C155 42, 170 42, 175 48 C182 46, 190 52, 190 58 C190 64, 130 64, 130 55 Z"
					fill="#ffffff"
					opacity="0.75"
				/>
				<path
					d="M260 40 C260 35, 268 32, 275 35 C280 30, 292 30, 296 35 C302 33, 308 38, 308 43 C308 48, 260 48, 260 40 Z"
					fill="#ffffff"
					opacity="0.65"
				/>

				{/* Far Mountain */}
				<path
					d="M100 130 Q 180 65 270 125 T 380 135 L 380 160 L 100 160 Z"
					fill="url(#hillFar)"
					opacity="0.5"
				/>

				{/* Mid Green Hill */}
				<path
					d="M140 145 Q 230 75 360 115 L 360 160 L 140 160 Z"
					fill="url(#hillMid)"
					opacity="0.7"
				/>

				{/* Near Vibrant Hill */}
				<path
					d="M170 150 Q 265 95 380 125 L 380 160 L 170 160 Z"
					fill="url(#hillNear)"
					opacity="0.6"
				/>

				{/* Road */}
				<path
					d="M180 155 Q 260 130 360 135 L 360 160 L 160 160 Z"
					fill="url(#roadGrad)"
				/>
				
				{/* Road dashed lines */}
				<path
					d="M200 153 Q 270 138 350 142"
					stroke="#f8fafc"
					strokeWidth="2"
					strokeDasharray="8 6"
					opacity="0.8"
				/>

				{/* Modern Bus Illustration */}
				<g transform="translate(215, 68) scale(0.95)" filter="url(#busShadow)">
					{/* Bus Body */}
					<path
						d="M8 44 C8 24, 20 18, 35 18 L125 18 C135 18, 140 22, 142 30 L145 46 C146 54, 144 58, 138 58 L12 58 C8 58, 8 50, 8 44 Z"
						fill="url(#busBodyGrad)"
					/>

					{/* Roof Highlight Line */}
					<path
						d="M32 20 L124 20"
						stroke="#93c5fd"
						strokeWidth="2"
						strokeLinecap="round"
					/>

					{/* Side Stripe */}
					<path
						d="M10 46 L144 46"
						stroke="#ffffff"
						strokeWidth="2.5"
						opacity="0.9"
					/>

					{/* Front Windshield */}
					<path
						d="M125 22 L139 32 L139 42 L125 42 Z"
						fill="url(#busWindowGrad)"
					/>
					{/* Front Glass reflection */}
					<path
						d="M127 24 L135 32"
						stroke="#93c5fd"
						strokeWidth="1.5"
						strokeLinecap="round"
						opacity="0.8"
					/>

					{/* Side Windows */}
					<rect x="20" y="24" width="18" height="16" rx="3" fill="url(#busWindowGrad)" />
					<rect x="42" y="24" width="18" height="16" rx="3" fill="url(#busWindowGrad)" />
					<rect x="64" y="24" width="18" height="16" rx="3" fill="url(#busWindowGrad)" />
					<rect x="86" y="24" width="18" height="16" rx="3" fill="url(#busWindowGrad)" />
					<rect x="108" y="24" width="14" height="16" rx="3" fill="url(#busWindowGrad)" />

					{/* Headlight */}
					<circle cx="143" cy="50" r="3" fill="#fef08a" />
					<circle cx="143" cy="50" r="1.5" fill="#ffffff" />
					
					{/* Tail light */}
					<rect x="8" y="46" width="2" height="6" rx="1" fill="#ef4444" />

					{/* Wheel Wells & Wheels */}
					{/* Rear Wheel */}
					<circle cx="34" cy="58" r="8.5" fill="#0f172a" />
					<circle cx="34" cy="58" r="5" fill="#64748b" />
					<circle cx="34" cy="58" r="2" fill="#e2e8f0" />

					{/* Front Wheel */}
					<circle cx="118" cy="58" r="8.5" fill="#0f172a" />
					<circle cx="118" cy="58" r="5" fill="#64748b" />
					<circle cx="118" cy="58" r="2" fill="#e2e8f0" />
				</g>
			</svg>
		</div>
	);
};

export default HeaderIllustration;
