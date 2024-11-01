import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const setAccessToken = (token, expiresIn) => {
  const expirationTime = Date.now() + expiresIn;
  localStorage.setItem("accessToken", token);
  localStorage.setItem("accessTokenExpiry", expiresIn);
};

export const getAccessToken = () => {
  return  localStorage?.getItem("accessToken");
};

export const isAccessTokenExpired = () => {
  const expirationTime = localStorage.getItem("accessTokenExpiry");
  return expirationTime && Date.now() > expirationTime;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("accessToken");
  try {
    // Panggil endpoint backend untuk memperbarui access token
    const response = await fetch("http://localhost:4321/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const { accessToken } = await response.json();
    const decodedToken = jwtDecode(accessToken);
    const expToken = decodedToken.exp;

    // Perbarui access token di localStorage
    setAccessToken(accessToken, expToken * 1000);
  } catch (error) {
    console.log("Failed to refresh access token:", error);
  }
};

export const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessTokenExpiry");
};
