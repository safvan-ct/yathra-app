import api from "../../../shared/api/api";

export const stationService = {
	getStations: async (options = {}) => {
		// options can contain { params, signal }
		return await api.get("/stations", options);
	},
};
