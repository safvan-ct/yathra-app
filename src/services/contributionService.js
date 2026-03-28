import api from "./api";

export const contributionService = {
	submitContribution: async (type, formData) => {
		return await api.post(`/contribute/${type}`, formData);
	},
};
