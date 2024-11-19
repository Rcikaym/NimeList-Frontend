import apiUrl from "@/hooks/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";

export const setAccessToken = (accessToken, expiresIn) => {
  // Menghitung masa berlaku access token
  const expMs = expiresIn * 1000;

  // Menyimpan access token di localStorage
  localStorage.setItem("access_token", accessToken);
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
  const token = localStorage.getItem("access_token");
  const payload = jwtDecode(token);

  try {
    // Panggil endpoint backend untuk memperbarui access token
    const response = await fetch("http://localhost:4321/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });

    const data = await response.json();
    const decodedToken = jwtDecode(data.access_token);

    // Perbarui access token di localStorage
    setAccessToken(data.access_token, decodedToken.exp);
    return data.access_token;
  } catch (error) {
    message.error(data.message);
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
