import { useState, useCallback } from "react";
import { stationService } from "../api/stationService";

export const useStations = () => {
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchStations = useCallback(async (params = {}) => {
		setLoading(true);
		setError("");

		try {
			const resStations = await stationService.getStations(params);

			setStations(
				Array.isArray(resStations) ? resStations : resStations?.data || [],
			);
		} catch (err) {
			console.error("Failed to fetch dependencies:", err);
			setError(err.message || "Failed to load routes and stations.");
		} finally {
			setLoading(false);
		}
	}, []);

	return { stations, loading, error, fetchStations };
};
