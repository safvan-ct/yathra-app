import { useState, useCallback } from "react";
import { busService } from "../services/busService";

export const useBuses = () => {
	const [buses, setBuses] = useState(null); // null means untouched, [] means empty
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const searchBuses = useCallback(async (from, to) => {
		setLoading(true);
		setError("");
		try {
			const res = await busService.searchBuses(from, to);
			setBuses(Array.isArray(res) ? res : res.data || []);
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
			setBuses(Array.isArray(res) ? res : res.data || []);
		} catch (err) {
			console.error("Failed to load buses:", err);
			setError(err.message || "Failed to load buses.");
			setBuses([]);
		} finally {
			setLoading(false);
		}
	}, []);

	return { buses, loading, error, searchBuses, getAllBuses };
};
