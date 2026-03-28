import api from "./api";

export const authService = {
	login: async (phone, pin) => {
		return await api.post("/user/login", { phone, pin });
	},
	register: async (data) => {
		return await api.post("/user/register", data);
	},
	requestOtp: async (phone) => {
		return await api.post("/user/request-pin-reset-otp", { phone });
	},
	verifyOtp: async (data) => {
		return await api.post("/user/verify-otp", data);
	},
	resetPin: async (data) => {
		return await api.post("/user/reset-pin", data);
	},
	logout: async () => {
		return await api.post("/user/logout");
	},
};
