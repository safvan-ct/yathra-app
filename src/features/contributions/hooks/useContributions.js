import { useState, useCallback, useRef } from "react";
import { contributionService } from "../api/contributionService";
import { userService } from "../../../shared/api/userService";

const PER_PAGE = 10;

export const useContributions = () => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const pageRef = useRef(1);
	const loadingMoreRef = useRef(false);
	const hasMoreRef = useRef(true);

	const fetchHistory = useCallback(async () => {
		setLoading(true);
		setError("");
		pageRef.current = 1;
		loadingMoreRef.current = false;
		hasMoreRef.current = true;
		try {
			const res = await userService.getContributions(1, PER_PAGE);
			const items = Array.isArray(res.data) ? res.data : [];
			const pagination = res.pagination || {};
			setHistory(items);
			const more =
				(pagination.current_page ?? 1) < (pagination.total_pages ?? 1);
			setHasMore(more);
			hasMoreRef.current = more;
		} catch (err) {
			console.error("Failed to fetch history:", err);
			setError(err.message || "Failed to fetch contribution history.");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchMore = useCallback(async () => {
		if (loadingMoreRef.current || !hasMoreRef.current) return;

		loadingMoreRef.current = true;
		setLoadingMore(true);

		const nextPage = pageRef.current + 1;
		try {
			const res = await userService.getContributions(nextPage, PER_PAGE);
			const items = Array.isArray(res.data) ? res.data : [];
			const pagination = res.pagination || {};

			if (items.length > 0) {
				setHistory((prev) => [...prev, ...items]);
				pageRef.current = nextPage;
			}

			const more = nextPage < (pagination.total_pages ?? 1);
			setHasMore(more);
			hasMoreRef.current = more;
		} catch (err) {
			console.error("Failed to load more:", err);
		} finally {
			setLoadingMore(false);
			loadingMoreRef.current = false;
		}
	}, []);

	const submitContribution = useCallback(async (type, formData) => {
		setSubmitLoading(true);
		setError("");
		setSuccess(false);
		try {
			await contributionService.submitContribution(type, formData);
			setSuccess(true);
			return true;
		} catch (err) {
			console.error(`Failed to submit ${type}:`, err);
			setError(err.message || "Failed to log contribution to server.");
			return false;
		} finally {
			setSubmitLoading(false);
		}
	}, []);

	return {
		history,
		loading,
		loadingMore,
		hasMore,
		submitLoading,
		error,
		success,
		setSuccess,
		setError,
		fetchHistory,
		fetchMore,
		submitContribution,
	};
};
