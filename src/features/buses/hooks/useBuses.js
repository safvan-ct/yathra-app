import { useState, useCallback } from "react";
import { busService } from "../api/busService";

const SESSION_BUS_CACHE_KEY = "yathra_bus_results_session";

/* Session cache helpers: persists only during active website session, cleared on tab/browser close */
const loadSessionCache = () => {
	try {
		const raw = sessionStorage.getItem(SESSION_BUS_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
};

const saveSessionCache = (data) => {
	try {
		sessionStorage.setItem(SESSION_BUS_CACHE_KEY, JSON.stringify(data));
	} catch (_) {}
};

const clearSessionCache = () => {
	try {
		sessionStorage.removeItem(SESSION_BUS_CACHE_KEY);
	} catch (_) {}
};

export const useBuses = () => {
	const [buses, setBuses] = useState(() => loadSessionCache());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const searchBuses = useCallback(async (from, to) => {
		setLoading(true);
		setError("");
		try {
			const res = await busService.searchBuses(from, to);
			const result = Array.isArray(res) ? res : res.data || [];
			setBuses(result);
			saveSessionCache(result);
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
			saveSessionCache(result);
		} catch (err) {
			console.error("Failed to load buses:", err);
			setError(err.message || "Failed to load buses.");
			setBuses([]);
		} finally {
			setLoading(false);
		}
	}, []);

	/* wipe results and session cache (called by Clear button) */
	const clearBuses = useCallback(() => {
		setBuses(null);
		clearSessionCache();
	}, []);

	return { buses, loading, error, searchBuses, getAllBuses, clearBuses };
};
