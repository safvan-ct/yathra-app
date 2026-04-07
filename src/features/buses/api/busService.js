import api from "../../../shared/api/api";

export const busService = {
	searchBuses: async (from, to) => {
		return await api.get("/trips/buses", { params: { from, to } });
	},
	getAllBuses: async (params = {}) => {
		return await api.get("/buses", { params });
	},
};
