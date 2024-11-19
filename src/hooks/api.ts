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

    if (error.response.status === 401 && isAccessTokenExpired()) {
      try {
        await refreshAccessToken();

        const accessToken = getAccessToken();
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiUrl;
