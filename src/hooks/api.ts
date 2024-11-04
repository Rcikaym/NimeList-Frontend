import axios from "axios";
import {
  setAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "@/utils/auth";

const apiUrl = axios.create({
  baseURL: "http://localhost:4321",
});

apiUrl.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default apiUrl;
