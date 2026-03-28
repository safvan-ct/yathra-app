import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
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

	const refreshUser = async () => {
		try {
			const data = await userService.getProfile();
			setUser({ isAuthenticated: true, ...data });
		} catch (error) {
			console.error("Failed to refresh user:", error);
			setUser(null);
			setToken(null);
			localStorage.removeItem("token");
		}
	};

	useEffect(() => {
		const initAuth = async () => {
			setLoading(true);
			if (token) {
				await refreshUser();
			} else {
				setUser(null);
			}
			setLoading(false);
		};

		initAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const login = async (phone, pin) => {
		try {
			const res = await authService.login(phone, pin);
			const returnedToken = res.data?.token || res.token || res;
			if (returnedToken) {
				setToken(returnedToken);
				localStorage.setItem("token", returnedToken);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const register = async (data) => {
		try {
			await authService.register(data);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const sendOtp = async (phone) => {
		try {
			await authService.requestOtp(phone);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const verifyOtp = async (data) => {
		try {
			await authService.verifyOtp(data);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const resetPin = async (data) => {
		try {
			await authService.resetPin(data);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const logout = async () => {
		try {
			if (token) await authService.logout().catch(() => null);
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setToken(null);
			setUser(null);
			localStorage.removeItem("token");
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
		refreshUser,
		otpData,
		setOtpData,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
