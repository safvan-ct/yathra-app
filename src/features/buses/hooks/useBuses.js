import { useState, useCallback } from "react";
import { busService } from "../api/busService";

export const useBuses = () => {
	const [buses, setBuses] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const searchBuses = useCallback(async (from, to) => {
		setLoading(true);
		setError("");
		try {
			const res = await busService.searchBuses(from, to);
			const result = Array.isArray(res) ? res : res.data || [];
			setBuses(result);
		} catch (err) {
			console.error("Failed to search buses:", err);
			setError(err.message || "Failed to search buses.");
			setBuses([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const getAllBuses = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const res = await busService.getAllBuses();
			const result = Array.isArray(res) ? res : res.data || [];
			setBuses(result);
		} catch (err) {
			console.error("Failed to load buses:", err);
			setError(err.message || "Failed to load buses.");
			setBuses([]);
		} finally {
			setLoading(false);
		}
	}, []);

	/* wipe results (called by Clear button) */
	const clearBuses = useCallback(() => {
		setBuses(null);
	}, []);

	return { buses, loading, error, searchBuses, getAllBuses, clearBuses };
};
