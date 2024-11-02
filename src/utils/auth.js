import apiUrl from "@/hooks/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const setAccessToken = (token, expiresIn) => {
  const expMs = expiresIn * 1000;
  localStorage.setItem("access_token", token);
  localStorage.setItem("access_token_expiry", expMs);
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const isAccessTokenExpired = () => {
  const expirationTime = localStorage.getItem("access_token_expiry");
  return expirationTime && Date.now() > expirationTime - 5 * 60 * 1000;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("access_token");
  const data_user = jwtDecode(refreshToken);

  try {
    // Panggil endpoint backend untuk memperbarui access token
    const response = await fetch("http://localhost:4321/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken, data_user }),
    });

    const { accessToken } = await response.json();
    const decodedToken = jwtDecode(accessToken);

    // Perbarui access token di localStorage
    setAccessToken(accessToken, decodedToken.exp);
  } catch (error) {
    console.log("Failed to refresh access token:", error);
  }
};

export const removeAccessToken = async () => {
  const token = localStorage.getItem("access_token");
  const response = await apiUrl.post("/auth/logout", { token: token });
  const { data } = response;

  if (data.status !== 200) {
    throw new Error("Failed to logout");
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expiry");
  return await data;
};
