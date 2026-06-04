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

apiUrl.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: network error, timeout, CORS — no response object at all
    if (!error.response) {
      return Promise.reject(error);
    }

    const accessToken = getAccessToken();

    if (error.response.status === 401 && isAccessTokenExpired()) {
      try {
        const refreshToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${refreshToken}`;
        // Fix: use apiUrl instead of axios to keep baseURL + interceptors
        return apiUrl(originalRequest);
      } catch (refreshError) {
        // Refresh failed — redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response.status === 401 || !accessToken) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiUrl;