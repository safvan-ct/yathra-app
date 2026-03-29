import api from "./api";

export const contributionService = {
	submitContribution: async (type, formData) => {
		const payload = {
			suggestable_type: type,
			proposed_data: formData,
		};
		return await api.post("/suggestions", payload);
	},
};
