import React, { useEffect, useState, useRef, useCallback } from "react";
import { busService } from "../api/busService";
import "../styles/BusesSection.css";

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

	return (
		<div id="section-buses" className="app-section active">
			{/* Sticky Search Bar */}
			<div className="sticky-top bg-white py-3 px-3 mb-4 rounded-bottom-4 shadow-sm buses-sticky-search">
				<div className="position-relative search-input-wrapper rounded-pill">
					<i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-primary opacity-75"></i>
					<input
						type="text"
						className="form-control form-control-lg bg-light border-0 rounded-pill shadow-none buses-search-input"
						placeholder="Search by bus name, number ..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{searchTerm && (
						<button
							className="btn position-absolute top-50 end-0 translate-middle-y text-muted border-0 shadow-none p-2 buses-clear-btn"
							onClick={() => setSearchTerm("")}
							aria-label="Clear search"
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
												"--bus-color": rawColor || "#0d6efd",
												"--bus-color-light": rawColor
													? `${rawColor}20`
													: "rgba(13, 110, 253, 0.15)",
											}}
										>
											<i className="bi bi-bus-front fs-2"></i>
										</div>

										{/* Main content */}
										<div className="flex-grow-1 bus-card-content">
											<div className="d-flex justify-content-between align-items-end gap-2 mb-1">
												<h5 className="fw-bold mb-0 text-dark bus-card-number">
													{highlightText(bus.bus_number || "XX-00", searchTerm)}
												</h5>
												{bus.category && (
													<span className="badge bg-light text-dark border rounded-pill custom-badge fw-medium flex-shrink-0 mt-1">
														{bus.category}
													</span>
												)}
											</div>
											<h6 className="text-secondary fw-semibold mb-1 text-truncate bus-card-name">
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
											<div className="bg-light rounded-circle d-flex align-items-center justify-content-center transition-all next-icon-box">
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
									<div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative hover-lift text-white sponsored-ad-card">
										{/* Decorative background shapes */}
										<div className="ad-shape-circle"></div>

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
											<p className="mb-0 text-white-50 ad-card-description">
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
						<div className="col-12 text-center pt-2 pb-4 mb-3">
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
