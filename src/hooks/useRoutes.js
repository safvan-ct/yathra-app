import { useState, useCallback } from "react";
import { routeService } from "../services/routeService";

export const useRoutes = () => {
	const [routes, setRoutes] = useState([]);
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const loadAllDependencies = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const [resRoutes, resStations] = await Promise.all([
				routeService.getRoutes().catch(() => []),
				routeService.getStations().catch(() => []),
			]);
			setRoutes(Array.isArray(resRoutes) ? resRoutes : resRoutes?.data || []);
			setStations(Array.isArray(resStations) ? resStations : resStations?.data || []);
		} catch (err) {
			console.error("Failed to fetch dependencies:", err);
			setError(err.message || "Failed to load routes and stations.");
		} finally {
			setLoading(false);
		}
	}, []);

	const getRoutes = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const res = await routeService.getRoutes();
			setRoutes(Array.isArray(res) ? res : res.data || []);
		} catch (err) {
			console.error("Failed to get routes:", err);
			setError(err.message || "Failed to retrieve active routes.");
		} finally {
			setLoading(false);
		}
	}, []);

	return { routes, stations, loading, error, loadAllDependencies, getRoutes };
};
