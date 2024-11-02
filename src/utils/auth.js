import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const setAccessToken = (token, expiresIn) => {
  const expMs = expiresIn * 1000;
  localStorage.setItem("access_token", token);
  localStorage.setItem("access_token_expiry", expMs);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const isAccessTokenExpired = () => {
  const expirationTime = localStorage.getItem("accessTokenExpiry");
  return expirationTime && Date.now() > expirationTime - 5 * 60 * 1000;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("accessToken");
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

export const removeAccessToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expiry");
};
