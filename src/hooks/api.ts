import axios from "axios";
import {
  setAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "@/utils/auth";
import { isMockMode, handleMockAxiosRequest } from "@/mocks/mockApi";

const apiUrl = axios.create({
  baseURL: "http://localhost:4321",
});

apiUrl.interceptors.request.use(
  (config) => {
    // In mock mode, reject with a special flag so the response interceptor
    // can return mock data without making a real network request
    if (isMockMode()) {
      const error: any = new Error("MOCK_INTERCEPT");
      error.__isMockIntercept = true;
      error.config = config;
      throw error;
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Re-throw mock intercepts so they reach the response error handler
    if (error.__isMockIntercept) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

apiUrl.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle mock mode: return mock data instead of making real requests
    if (error.__isMockIntercept) {
      return handleMockAxiosRequest(error.config);
    }

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
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_expiry");
        localStorage.removeItem("is_mock_auth");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response.status === 401 || !accessToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("access_token_expiry");
      localStorage.removeItem("is_mock_auth");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiUrl;