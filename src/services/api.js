import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");

		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`,
			};
		}

		return config;
	},
	(error) => Promise.reject(error),
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
	(response) => {
		const res = response.data;

		if (res.status === false) {
			return Promise.reject({ message: res.message || "Request failed" });
		}

		return res;
	},
	(error) => {
		const message =
			error?.response?.data?.message ||
			error?.message ||
			"Something went wrong";

		return Promise.reject(new Error(message));
	},
);

export default api;
