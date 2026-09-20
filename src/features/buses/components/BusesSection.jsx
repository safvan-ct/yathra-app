import React, { useEffect, useState, useRef, useCallback } from "react";
import { busService } from "../api/busService";
import SponsoredAdCard from "../../home/components/SponsoredAdCard";
import "../styles/BusesSection.css";

const BusesSection = ({ onBusClick }) => {
	const [buses, setBuses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [initialLoad, setInitialLoad] = useState(true);

	const observerTarget = useRef(null);

	const fetchBusesData = useCallback(
		async (currentPage, currentSearch, isReset = false) => {
			try {
				if (isReset) {
					setLoading(true);
					setBuses([]);
				} else {
					setLoadingMore(true);
				}
				setError(null);

				const res = await busService.getAllBuses({
					search: currentSearch,
					per_page: 8,
					page: currentPage,
				});

				const payload = res.data?.data ? res.data : res;
				const newData = payload.data || [];
				const pagination = payload.pagination || {};

				setBuses((prev) => (isReset ? newData : [...prev, ...newData]));
				setHasMore(
					pagination.current_page < pagination.total_pages ||
						(newData.length > 0 &&
							newData.length >= (pagination.per_page || 15)),
				);
			} catch (err) {
				console.error("Failed to fetch buses:", err);
				setError(
					err?.response?.data?.message ||
						err.message ||
						"Failed to load buses. Please try again.",
				);
			} finally {
				setLoading(false);
				setLoadingMore(false);
				setInitialLoad(false);
			}
		},
		[],
	);

	// Debounce for Search
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setPage(1);
			fetchBusesData(1, searchTerm, true);
		}, 600);
		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm]);

	// Fetch next page when 'page' state changes (triggered by IntersectionObserver)
	useEffect(() => {
		if (page > 1) {
			fetchBusesData(page, searchTerm, false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	// Setup Intersection Observer for Infinite Scroll
	const handleObserver = useCallback(
		(entries) => {
			const [target] = entries;
			if (target.isIntersecting && hasMore && !loading && !loadingMore) {
				setPage((prev) => prev + 1);
			}
		},
		[hasMore, loading, loadingMore],
	);

	useEffect(() => {
		const element = observerTarget.current;
		const option = { threshold: 0, rootMargin: "100px" };
		const observer = new IntersectionObserver(handleObserver, option);
		if (element) observer.observe(element);
		return () => {
			if (element) observer.unobserve(element);
		};
	}, [handleObserver]);

	// Helper to highlight matching text
	const highlightText = (text, highlight) => {
		if (!highlight.trim() || !text) return text;
		const parts = text
			.toString()
			.split(new RegExp(`(${highlight.trim()})`, "gi"));
		return parts.map((part, i) =>
			part.toLowerCase() === highlight.toLowerCase().trim() ? (
				<span
					key={i}
					className="bg-warning text-dark px-1 rounded-1 fw-bold bg-opacity-75"
				>
					{part}
				</span>
			) : (
				<React.Fragment key={i}>{part}</React.Fragment>
			),
		);
	};

	const getCategoryBadgeClass = (category) => {
		const cat = (category || "").toLowerCase();
		if (cat.includes("super fast") || cat.includes("super express")) {
			return "bg-danger bg-opacity-10 text-danger border-danger border-opacity-25";
		}
		if (cat.includes("fast") || cat.includes("express")) {
			return "bg-primary bg-opacity-10 text-primary border-primary border-opacity-25";
		}
		if (
			cat.includes("ac") ||
			cat.includes("low floor") ||
			cat.includes("deluxe")
		) {
			return "bg-success bg-opacity-10 text-success border-success border-opacity-25";
		}
		return "bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25";
	};

	return (
		<div id="section-buses" className="app-section active mb-6">
			{/* Sticky Search Bar */}
			<div className="dashboard-container px-2 px-sm-3 mt-1">
				<div className="card border-0 rounded-3 shadow-sm bg-white p-2 mb-1">
					<div className="position-relative search-input-wrapper">
						<i
							className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-75"
							style={{ fontSize: "13px" }}
						></i>
						<input
							type="text"
							className="form-control bg-light border-0 rounded-3 shadow-none buses-search-input"
							placeholder="Search by bus name, number ..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						{searchTerm && (
							<button
								className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted p-1 buses-clear-btn"
								onClick={() => setSearchTerm("")}
							>
								<i
									className="bi bi-x-circle-fill opacity-50"
									style={{ fontSize: "13px" }}
								></i>
							</button>
						)}
					</div>
				</div>

				<div className="d-flex justify-content-between align-items-center mb-1 px-1">
					<div>
						<h6
							className="fw-bold mb-0 text-dark"
							style={{ fontSize: "0.95rem" }}
						>
							Bus Schedules
						</h6>
						<p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>
							Explore real-time bus timings & routes
						</p>
					</div>
					<span
						className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 rounded-pill"
						style={{ fontSize: "0.68rem" }}
					>
						{buses.length} Buses
					</span>
				</div>

				{/* Error state */}
				{error && (
					<div className="alert alert-danger rounded-4 py-2 px-3 small d-flex align-items-center mb-3">
						<i className="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
						<div>{error}</div>
					</div>
				)}

				<div className="row g-1">
					{/* Bus List */}
					{buses.map((bus, idx) => {
						const rawColor =
							bus.bus_color === "White" ? "#aeafb3" : bus.bus_color;
						const elements = [];

						// Push the actual Bus Card
						elements.push(
							<div key={bus.id || idx} className="col-12 col-md-6 col-lg-4">
								<div
									className="card border-0 shadow-sm rounded-3 h-100 hover-lift bg-white mb-1 overflow-hidden position-relative"
									onClick={() => onBusClick && onBusClick(bus)}
									style={{ cursor: "pointer" }}
								>
									<div className="card-body p-2 d-flex flex-column justify-content-between gap-0">
										{/* Top Header Row: Bus Icon + Name/Reg + Category Badge */}
										<div className="d-flex align-items-center justify-content-between gap-2">
											<div
												className="d-flex align-items-center gap-2 overflow-hidden"
												style={{ minWidth: 0 }}
											>
												{/* Glowing Bus Icon */}
												<div
													className="bus-brand-icon-box rounded-5 d-flex align-items-center justify-content-center flex-shrink-0"
													style={{
														backgroundColor: "#cbdbec96",
														color: rawColor || "#0d6efd",
														border: `1px solid ${
															rawColor
																? `${rawColor}35`
																: "rgba(13, 110, 253, 0.25)"
														}`,
													}}
												>
													<i className="bi bi-bus-front fs-6"></i>
												</div>

												{/* Bus Title & Registration */}
												<div
													className="overflow-hidden"
													style={{ minWidth: 0 }}
												>
													<h6 className="fw-bold mb-0 text-dark text-truncate bus-card-title">
														{highlightText(
															bus.bus_name || "Bus Service",
															searchTerm,
														)}
													</h6>
													<span className="bus-reg-badge text-muted fw-semibold">
														{highlightText(
															bus.bus_number || "XX-00",
															searchTerm,
														)}
													</span>
												</div>
											</div>

											{/* Category Badge */}
											{bus.category && (
												<span
													className={`badge rounded-pill px-2 py-1 border custom-badge flex-shrink-0 ${getCategoryBadgeClass(
														bus.category,
													)}`}
												>
													{bus.category}
												</span>
											)}
										</div>

										{/* Bottom Info Bar: Operator + Details + View Route Action */}
										<div className="d-flex align-items-center justify-content-between pt-1 border-top border-light-subtle gap-2">
											{/* Left metadata tags */}
											<div
												className="d-flex align-items-center gap-1 overflow-hidden flex-wrap"
												style={{ minWidth: 0 }}
											>
												{bus.operator?.name && (
													<span className="badge bg-light text-secondary border rounded-pill px-2 py-0.5 custom-badge text-truncate d-flex align-items-center gap-1">
														<i
															className="bi bi-building opacity-75"
															style={{ fontSize: "10px" }}
														></i>
														<span className="text-truncate">
															{highlightText(bus.operator.name, searchTerm)}
														</span>
													</span>
												)}
												{bus.operator?.type && (
													<span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill px-2 py-0.5 custom-badge">
														{bus.operator.type}
													</span>
												)}
												{bus.bus_color && bus.bus_color !== "White" && (
													<span className="badge bg-light text-muted border rounded-pill px-2 py-0.5 custom-badge d-flex align-items-center gap-1">
														<span
															className="rounded-circle d-inline-block"
															style={{
																width: "6px",
																height: "6px",
																backgroundColor: rawColor,
															}}
														></span>
														<span>{bus.bus_color}</span>
													</span>
												)}
											</div>

											{/* Right Action Cue */}
											<div
												className="d-flex align-items-center gap-1 text-primary fw-bold flex-shrink-0 view-stops-cta"
												style={{ fontSize: "0.74rem" }}
											>
												<span>Stops</span>
												<i className="bi bi-chevron-right transition-transform"></i>
											</div>
										</div>
									</div>
								</div>
							</div>,
						);

						// Insert Sponsored Ad Banner after every 2 bus cards like home ad card
						if ((idx + 1) % 2 === 0) {
							const adIndex = Math.floor(idx / 2);
							elements.push(
								<div key={`sponsored-ad-${idx}`} className="col-12 mb-0">
									<SponsoredAdCard index={adIndex} />
								</div>,
							);
						}

						return elements;
					})}

					{/* Loading Initial Data Spinner */}
					{loading && buses.length === 0 && (
						<div className="col-12 text-center py-5">
							<div
								className="spinner-border text-primary border-3 buses-loader-spinner"
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
							<p className="text-muted mt-3 fw-medium">
								Searching for buses...
							</p>
						</div>
					)}

					{/* Empty State */}
					{!loading && !initialLoad && buses.length === 0 && !error && (
						<div className="col-12 text-center py-5">
							<div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-muted shadow-sm empty-state-icon-box">
								<i className="bi bi-search fs-1 opacity-50"></i>
							</div>
							<h5 className="fw-bold text-dark mt-2 mb-1">No buses found</h5>
							<p className="text-muted mb-0">
								We couldn't find any buses matching "{searchTerm}"
							</p>
						</div>
					)}

					{/* Loading More Spinner (Infinite Scroll) */}
					{loadingMore && (
						<div className="col-12 text-center py-4">
							<div
								className="spinner-border spinner-border-sm text-primary me-2"
								role="status"
							></div>
							<span className="text-muted fw-medium small">
								Loading more buses...
							</span>
						</div>
					)}

					{/* End of List indicator */}
					{!hasMore && buses.length > 0 && !loading && !loadingMore && (
						<div className="col-12 text-center pt-2">
							<span className="text-muted small bg-light px-3 py-1 rounded-pill">
								You've reached the end of the list
							</span>
						</div>
					)}

					{/* Observer Target to trigger Infinite Scroll */}
					<div ref={observerTarget} className="infinite-scroll-trigger"></div>
				</div>
			</div>
		</div>
	);
};

export default BusesSection;
