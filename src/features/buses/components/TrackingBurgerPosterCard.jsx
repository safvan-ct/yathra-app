import React from "react";
import "../styles/BurgerPosterCard.css";

const TrackingBurgerPosterCard = ({
	brandName = "Mr. Burger",
	headline = "Chicken Burger",
	subHeadline = "Yummy!!!",
	discountText = "Save upto\n50% on your\nfirst order",
	offerTerms = "*Offer applicable only from Friday - Sunday",
	phone = "+971 123567789",
	website = "www.mrburgercountry.com",
	orderUrl = "https://www.google.com/search?q=mr+burger+delivery",
}) => {
	const handleOrderClick = () => {
		window.open(orderUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="burger-poster-card shadow-lg rounded-4 overflow-hidden position-relative mb-5">
			{/* Background Decorative Rings / Watermarks */}
			<div className="poster-bg-rings" aria-hidden="true">
				<div className="bg-ring ring-1"></div>
				<div className="bg-ring ring-2"></div>
				<div className="bg-ring ring-3"></div>
				<div className="bg-ring ring-4"></div>
			</div>

			{/* Poster Header */}
			<div className="poster-header d-flex justify-content-between align-items-center p-3 pb-1 position-relative z-2">
				{/* Brand Badge */}
				<div className="brand-badge-seal d-flex align-items-center justify-content-center">
					<span className="brand-badge-text">{brandName}</span>
				</div>

				{/* Social / Contact Icons */}
				<div className="social-icons-group d-flex align-items-center gap-2">
					<button
						type="button"
						className="social-icon-btn whatsapp"
						title="WhatsApp Us"
						onClick={handleOrderClick}
					>
						<i className="bi bi-whatsapp"></i>
					</button>
					<button
						type="button"
						className="social-icon-btn instagram"
						title="Instagram"
						onClick={handleOrderClick}
					>
						<i className="bi bi-instagram"></i>
					</button>
					<button
						type="button"
						className="social-icon-btn info-call"
						title="Call Us"
						onClick={() => window.open(`tel:${phone.replace(/\s+/g, "")}`)}
					>
						<i className="bi bi-telephone-fill"></i>
					</button>
				</div>
			</div>

			{/* Main Headline */}
			<div className="poster-headline-wrap text-center px-3 pt-1 position-relative z-2">
				<div className="poster-script-yummy">{subHeadline}</div>
				<h2 className="poster-title-burger mb-0">{headline}</h2>
			</div>

			{/* Hero Visual Area with Burger and Discount Badge */}
			<div className="poster-visual-container position-relative text-center my-2">
				{/* Discount Pebble Badge */}
				<div className="discount-pebble-badge">
					<div className="pebble-inner">
						<span className="pebble-line-1">Save upto</span>
						<span className="pebble-line-2">50% OFF</span>
						<span className="pebble-line-3">on your first order</span>
					</div>
				</div>

				{/* Center Burger Photo */}
				<div className="burger-image-wrapper">
					<img
						src="/images/yummy_chicken_burger.jpg"
						alt="Yummy Chicken Burger"
						className="burger-hero-img"
						loading="lazy"
					/>
					<div className="burger-glow-shadow"></div>
				</div>
			</div>

			{/* Offer Terms */}
			<div className="poster-terms text-center px-3 position-relative z-2">
				<small className="terms-text">{offerTerms}</small>
			</div>

			{/* Poster Footer Bar */}
			<div className="poster-footer p-3 pt-2 d-flex align-items-center justify-content-between position-relative z-2">
				{/* Phone / Delivery Info */}
				<div className="delivery-contact-block">
					<div className="delivery-label">For Delivery</div>
					<a
						href={`tel:${phone.replace(/\s+/g, "")}`}
						className="delivery-phone text-decoration-none"
					>
						{phone}
					</a>
				</div>

				{/* Website / Tagline (Hidden on very small screens if compact) */}
				<div className="d-none d-sm-block text-center poster-web-tagline">
					<span className="call-now-sub">Call now or visit website</span>
					<div className="web-url">{website}</div>
				</div>

				{/* Order Now CTA Button */}
				<button
					type="button"
					className="btn-order-now-pill"
					onClick={handleOrderClick}
				>
					<span>ORDER NOW</span>
				</button>
			</div>
		</div>
	);
};

export default TrackingBurgerPosterCard;
