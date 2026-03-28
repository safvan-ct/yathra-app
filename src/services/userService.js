import api from "./api";

export const userService = {
	getProfile: async () => {
		return await api.get("/user/me");
	},
	getContributions: async () => {
		return await api.get("/contributions");
	},
};
