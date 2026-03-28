import api from "./api";

export const routeService = {
	getRoutes: async () => {
		return await api.get("/routes");
	},
	getStations: async () => {
		return await api.get("/stations");
	},
};
