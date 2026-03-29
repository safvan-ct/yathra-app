import React, { useEffect, useState, useRef, useCallback } from "react";
import { busService } from "../../services/busService";

const BusesSection = () => {
	const [buses, setBuses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [initialLoad, setInitialLoad] = useState(true);

	const observerTarget = useRef(null);

	const fetchBusesData = async (
		currentPage,
		currentSearch,
		isReset = false,
	) => {
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

			// Handle typical axios structure (res.data) containing our payload { data, pagination }
			// or fallback to checking res if the interceptor strips the wrapper
			const payload = res.data?.data ? res.data : res;

			const newData = payload.data || [];
			const pagination = payload.pagination || {};

			setBuses((prev) => (isReset ? newData : [...prev, ...newData]));

			// Use pagination metadata to determine if we should load more
			setHasMore(
				pagination.current_page < pagination.total_pages ||
					(newData.length > 0 && newData.length >= (pagination.per_page || 15)),
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
	};

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

	return (
		<div id="section-buses" className="app-section active">
			<style>
				{`
					.hover-lift {
						transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
						cursor: pointer;
						border: 1px solid rgba(0,0,0,0.04) !important;
					}
					.hover-lift:hover {
						transform: translateY(-5px);
						box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15) !important;
						border-color: rgba(0,0,0,0.08) !important;
					}
					.bus-icon-bg {
						background: linear-gradient(135deg, var(--bus-color-light), rgba(255,255,255,0.8));
						color: var(--bus-color, #0d6efd);
						box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
					}
					.custom-badge {
						font-size: 0.7rem;
						letter-spacing: 0.3px;
					}
                    .search-input-wrapper {
                        transition: box-shadow 0.2s;
                    }
                    .search-input-wrapper:focus-within {
                        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
                    }
				`}
			</style>

			{/* Sticky Search Bar */}
			<div
				className="sticky-top bg-white py-3 px-3 mb-4 rounded-bottom-4 shadow-sm"
				style={{ zIndex: 1020 }}
			>
				<div className="position-relative search-input-wrapper rounded-pill">
					<i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-primary opacity-75"></i>
					<input
						type="text"
						className="form-control form-control-lg bg-light border-0 rounded-pill shadow-none"
						style={{
							paddingLeft: "3rem",
							paddingRight: "3rem",
							fontSize: "1rem",
						}}
						placeholder="Search by bus name, number ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{searchTerm && (
						<button
							className="btn position-absolute top-50 end-0 translate-middle-y text-muted border-0 shadow-none p-2"
							onClick={() => setSearchTerm("")}
							aria-label="Clear search"
							style={{ marginRight: "0.5rem" }}
						>
							<i className="bi bi-x-circle-fill fs-5 opacity-50 hover-opacity-100"></i>
						</button>
					)}
				</div>
			</div>

			<div className="dashboard-container px-3 pb-5">
				<div className="d-flex justify-content-between align-items-end mb-4 px-1">
					<div>
						<h4 className="fw-bolder mb-1 text-dark">Explore Buses</h4>
						<p className="text-muted small mb-0">
							Find and book your next journey
						</p>
					</div>
					<span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill shadow-sm custom-badge">
						{buses.length > 0 ? `${buses.length} Buses loaded` : `Search Buses`}
					</span>
				</div>

				{error && (
					<div
						className="alert alert-danger d-flex align-items-center rounded-4 border-0 shadow-sm py-3 mb-4"
						role="alert"
					>
						<i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
						<div>{error}</div>
					</div>
				)}

				<div className="row g-3">
					{/* Bus List */}
					{buses.map((bus, idx) => {
						const rawColor =
							bus.bus_color === "White" ? "#aeafb3" : bus.bus_color;
						const elements = [];

						// Push the actual Bus Card
						elements.push(
							<div key={bus.id || idx} className="col-12 col-md-6 col-lg-4">
								<div className="card border-0 shadow-sm rounded-4 h-100 hover-lift bg-white">
									<div className="card-body p-3 d-flex align-items-center gap-3">
										{/* Left side: Colored bus icon */}
										<div
											className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0 bus-icon-bg"
											style={{
												width: "65px",
												height: "65px",
												"--bus-color": rawColor || "#0d6efd",
												"--bus-color-light": rawColor
													? `${rawColor}20`
													: "rgba(13, 110, 253, 0.15)",
											}}
										>
											<i className="bi bi-bus-front fs-2"></i>
										</div>

										{/* Main content */}
										<div
											className="flex-grow-1 min-w-0"
											style={{ minWidth: 0 }}
										>
											<div className="d-flex justify-content-between align-items-end gap-2 mb-1">
												<h5
													className="fw-bold mb-0 text-dark"
													style={{
														fontSize: "0.95rem",
														wordBreak: "break-word",
													}}
												>
													{highlightText(bus.bus_number || "XX-00", searchTerm)}
												</h5>
												{bus.category && (
													<span className="badge bg-light text-dark border rounded-pill custom-badge fw-medium flex-shrink-0 mt-1">
														{bus.category}
													</span>
												)}
											</div>
											<h6
												className="text-secondary fw-semibold mb-1 text-truncate"
												style={{ fontSize: "0.9rem" }}
											>
												{highlightText(
													bus.bus_name || "Unknown Bus",
													searchTerm,
												)}
											</h6>

											{/* Operator details with subtle badge */}
											<div className="d-flex align-items-center mt-2 gap-1 overflow-hidden">
												<span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill custom-badge text-truncate pb-1">
													<i className="bi bi-building me-1 opacity-75"></i>
													{highlightText(
														bus.operator?.name || "Unknown",
														searchTerm,
													)}
												</span>
												{bus.operator?.type && (
													<span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill custom-badge pb-1">
														{bus.operator.type}
													</span>
												)}
											</div>
										</div>

										{/* Right side: Next icon indicator */}
										<div className="d-flex flex-column align-items-end justify-content-center ps-2 flex-shrink-0 opacity-75">
											<div
												className="bg-light rounded-circle d-flex align-items-center justify-content-center transition-all"
												style={{ width: "36px", height: "36px" }}
											>
												<i className="bi bi-arrow-right text-primary"></i>
											</div>
										</div>
									</div>
								</div>
							</div>,
						);

						// Insert a Creative Ad block after every 2nd bus
						if ((idx + 1) % 2 === 0) {
							elements.push(
								<div key={`ad-${idx}`} className="col-12 col-md-6 col-lg-4">
									<div
										className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative hover-lift text-white"
										style={{
											background:
												"linear-gradient(135deg, #FF6B6C 0%, #FF8E53 100%)",
											minHeight: "120px",
										}}
									>
										{/* Decorative background shapes */}
										<div
											className="position-absolute rounded-circle bg-white opacity-25"
											style={{
												width: "120px",
												height: "120px",
												top: "-30px",
												right: "-30px",
												filter: "blur(4px)",
											}}
										></div>
										{/* <div className="position-absolute rounded-circle bg-white opacity-10" style={{ width: "60px", height: "60px", bottom: "10px", right: "40px" }}></div> */}

										<div className="card-body p-3 d-flex flex-column justify-content-center position-relative z-1 h-100">
											<div className="d-flex justify-content-between align-items-start mb-2">
												<span className="badge bg-white text-danger border-0 rounded-pill custom-badge shadow-sm px-2 py-1">
													<i className="bi bi-stars me-1"></i> SPONSORED
												</span>
												<i className="bi bi-tag-fill opacity-50 fs-4"></i>
											</div>
											<h5 className="fw-bolder mb-1 text-white">
												Save 20% Today!
											</h5>
											<p
												className="mb-0 text-white-50"
												style={{ fontSize: "0.85rem", lineHeight: "1.3" }}
											>
												Use code{" "}
												<strong className="text-white px-1 bg-dark bg-opacity-25 rounded-1">
													YATHRA20
												</strong>{" "}
												on your next trip.
											</p>
										</div>
									</div>
								</div>,
							);
						}

						return elements;
					})}

					{/* Loading Initial Data Spinner */}
					{loading && buses.length === 0 && (
						<div className="col-12 text-center py-5">
							<div
								className="spinner-border text-primary border-3"
								role="status"
								style={{ width: "3rem", height: "3rem" }}
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
							<div
								className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-muted shadow-sm"
								style={{ width: "90px", height: "90px" }}
							>
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
						<div className="col-12 text-center pt-2 pb-4 mb-3">
							<span className="text-muted small bg-light px-3 py-1 rounded-pill">
								You've reached the end of the list
							</span>
						</div>
					)}

					{/* Observer Target to trigger Infinite Scroll */}
					<div ref={observerTarget} style={{ height: "1px" }}></div>
				</div>
			</div>
		</div>
	);
};

export default BusesSection;
