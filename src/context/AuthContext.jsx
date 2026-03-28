import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || null);
	const [loading, setLoading] = useState(true);
	const [otpData, setOtpData] = useState({
		phone: null,
		otp: null,
	});

	useEffect(() => {
		if (token) {
			setUser({ isAuthenticated: true });
		}

		setLoading(false);
	}, [token]);

	const login = async (phone, pin) => {
		try {
			const res = await api.post("/user/login", { phone, pin });
			setToken(res.data.token);
			localStorage.setItem("token", res.data.token);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const register = async (data) => {
		try {
			await api.post("/user/register", data);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const sendOtp = async (phone) => {
		try {
			await api.post("/user/request-pin-reset-otp", { phone });
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const verifyOtp = async (data) => {
		try {
			await api.post("/user/verify-otp", data);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const resetPin = async (data) => {
		try {
			await api.post("/user/reset-pin", data);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const logout = async () => {
		try {
			await api.post("/user/logout");
			setToken(null);
			setUser(null);
			localStorage.removeItem("token");
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const value = {
		user,
		token,
		loading,
		setLoading,
		login,
		register,
		sendOtp,
		verifyOtp,
		resetPin,
		logout,
		otpData,
		setOtpData,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
