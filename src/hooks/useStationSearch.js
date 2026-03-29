import { useState, useRef, useCallback } from "react";
import { stationService } from "../services/stationService";

export const useStationSearch = () => {
	const [stationResults, setStationResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState("");

	// In-memory cache to skip redundant API requests
	const cache = useRef({});
	// Reference to the active AbortController to cancel pending promises
	const activeRequest = useRef(null);
	// Search debounce timeout reference
	const debounceTimeout = useRef(null);
	// Track the very last text evaluated
	const lastQuery = useRef("");

	const searchStations = useCallback(async (query = "") => {
		const trimmedQuery = query.trim();

		// Optional: Ignore short searches unless empty (which signifies a reset/default load)
		if (trimmedQuery.length > 0 && trimmedQuery.length < 2) return;

		// Unnecessary to search identically what we already just searched
		if (lastQuery.current === trimmedQuery) return;
		lastQuery.current = trimmedQuery;

		// 1. CLEAR DEBOUNCE
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		// 2. CHECK CACHE FIRST (instant render, no debounce needed)
		if (cache.current[trimmedQuery]) {
			setStationResults(cache.current[trimmedQuery]);
			setError("");
			return;
		}

		// 3. APPLY DEBOUNCE (delay API spam)
		debounceTimeout.current = setTimeout(async () => {
			// Cancelling heavily stacked pending requests immediately
			if (activeRequest.current) {
				activeRequest.current.abort();
			}

			// Generate new cancellation token
			const abortController = new AbortController();
			activeRequest.current = abortController;

			setIsSearching(true);
			setError("");

			try {
				const response = await stationService.getStations({
					params: {
						search: trimmedQuery,
						per_page: 5, // Limiting dropdown spam efficiently
					},
					signal: abortController.signal,
				});

				const rawData = Array.isArray(response)
					? response
					: response?.data || [];

				// Storing to ephemeral ram-cache
				cache.current[trimmedQuery] = rawData;

				setStationResults(rawData);
			} catch (err) {
				// AbortError expects no UI logging as user typing merely skipped it
				if (
					err.name === "AbortError" ||
					err.message === "canceled" ||
					err.code === "ERR_CANCELED"
				) {
					console.log("Stale station search aborted.");
				} else {
					console.error("Station search failed:", err);
					setError(err.message || "Failed to locate stations.");
					setStationResults([]);
				}
			} finally {
				// If this controller is still the active one, computation is done
				if (activeRequest.current === abortController) {
					setIsSearching(false);
				}
			}
		}, 400); // 400ms debounce buffer against frantic typing
	}, []);

	return { searchStations, stationResults, isSearching, error };
};
