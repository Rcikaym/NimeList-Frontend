"use client";

import { NextUIProvider } from "@nextui-org/react";
import { App, ConfigProvider } from "antd";
import { useEffect } from "react";
import { isMockMode, installMockFetchOverride } from "@/mocks/mockApi";
import { setupMockAuth } from "@/mocks/mockAuth";
import { jwtDecode } from "jwt-decode";

export const Providers = ({ children }: any) => {
  useEffect(() => {
    if (isMockMode()) {
      // Auto-login with mock credentials if no token exists
      setupMockAuth();
      // Override global fetch to intercept API calls
      installMockFetchOverride();
    } else {
      // Clear mock storage if mock mode was disabled to avoid loop redirect
      const token = localStorage.getItem("access_token");
      let isDemoToken = false;
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded?.email === "demo@nimelist.com" || decoded?.username === "demo_user") {
            isDemoToken = true;
          }
        } catch (e) {
          // ignore parsing error, let other mechanisms handle invalid tokens
        }
      }
      if (localStorage.getItem("is_mock_auth") === "true" || isDemoToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_expiry");
        localStorage.removeItem("is_mock_auth");
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <NextUIProvider>
      <ConfigProvider>
        <App>{children}</App>
      </ConfigProvider>
    </NextUIProvider>
  );
};
