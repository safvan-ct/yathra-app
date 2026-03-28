import api from "./api";

export const busService = {
	searchBuses: async (from, to) => {
		return await api.get("/trips/buses", { params: { from, to } });
	},
	getAllBuses: async () => {
		return await api.get("/buses");
	},
};
