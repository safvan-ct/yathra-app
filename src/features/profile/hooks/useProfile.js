import { useState, useCallback } from "react";
import { userService } from "../../../shared/api/userService";

export const useProfile = () => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchProfile = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const res = await userService.getProfile();
			setProfile(res?.data || res || {});
		} catch (err) {
			console.error("Failed to fetch profile:", err);
			setError(err.message || "Failed to load user profile.");
		} finally {
			setLoading(false);
		}
	}, []);

	return { profile, loading, error, fetchProfile };
};
