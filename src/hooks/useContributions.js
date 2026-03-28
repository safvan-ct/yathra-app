import { useState, useCallback } from "react";
import { contributionService } from "../services/contributionService";
import { userService } from "../services/userService";

export const useContributions = () => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const fetchHistory = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const res = await userService.getContributions();
			setHistory(Array.isArray(res) ? res : res.data || []);
		} catch (err) {
			console.error("Failed to trace history:", err);
			setError(err.message || "Failed to fetch contribution logistics.");
		} finally {
			setLoading(false);
		}
	}, []);

	const submitContribution = async (type, formData) => {
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
	};

	return { history, loading, submitLoading, error, success, setSuccess, setError, fetchHistory, submitContribution };
};
