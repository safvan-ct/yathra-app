import { useState, useCallback } from "react";
import { busService } from "../api/busService";

const BUS_CACHE_KEY = "yathra_bus_results";

/* helpers */
const loadCache = () => {
	try {
		const raw = localStorage.getItem(BUS_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
};

const saveCache = (data) => {
	try {
		localStorage.setItem(BUS_CACHE_KEY, JSON.stringify(data));
	} catch (_) {}
};

const clearCache = () => {
	try {
		localStorage.removeItem(BUS_CACHE_KEY);
	} catch (_) {}
};

export const useBuses = () => {
	// hydrate from cache on first render so results survive page reload
	const [buses, setBuses] = useState(() => loadCache());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const searchBuses = useCallback(async (from, to) => {
		setLoading(true);
		setError("");
		try {
			const res = await busService.searchBuses(from, to);
			const result = Array.isArray(res) ? res : res.data || [];
			setBuses(result);
			saveCache(result); // ← persist results
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
			saveCache(result);
		} catch (err) {
			console.error("Failed to load buses:", err);
			setError(err.message || "Failed to load buses.");
			setBuses([]);
		} finally {
			setLoading(false);
		}
	}, []);

	/* wipe both results and cache (called by Clear button) */
	const clearBuses = useCallback(() => {
		setBuses(null);
		clearCache();
	}, []);

	return { buses, loading, error, searchBuses, getAllBuses, clearBuses };
};
