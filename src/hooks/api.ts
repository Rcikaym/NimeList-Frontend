import axios from "axios";
import {
  setAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "./auth";

const api = axios.create({
  baseURL: "http://localhost:4321",
});

api.interceptors.request.use((config) => {
  if (isAccessTokenExpired()) {
    refreshAccessToken();
  }
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
