import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.github.com",
});

export const setBearerAuthToken = (token: string | null) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
