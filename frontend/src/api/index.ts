import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.github.com",
});

api.interceptors.request.use(
    (config) => {
        if (!config.params) config.params = {};
        config.params.cb = Date.now();
        return config;
    }
);

export const setBearerAuthToken = (token: string | null) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
