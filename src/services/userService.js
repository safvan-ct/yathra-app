import api from "./api";

export const userService = {
	getProfile: async () => {
		return await api.get("/user/me");
	},
	getContributions: async (page = 1, perPage = 10) => {
		return await api.get("/suggestions", {
			params: { page, per_page: perPage },
		});
	},
};
