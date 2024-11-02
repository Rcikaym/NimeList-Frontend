// hooks/withAdmin.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "./auth";

// Definisikan tipe untuk props
interface WithAdminProps {
  children: React.ReactNode;
}

const withAdmin = (WrappedComponent: React.ComponentType<WithAdminProps>) => {
  return (props: WithAdminProps) => {
    const router = useRouter();

    useEffect(() => {
      if (isAccessTokenExpired()) {
        refreshAccessToken();
      }

      const accessToken = getAccessToken();

      if (!accessToken) {
        // Jika tidak ada token, redirect ke login
        router.push("/login");
        return;
      }

      try {
        const decodedToken: { role: string } = jwtDecode(accessToken);
        const { role } = decodedToken;

        // Periksa apakah role adalah 'admin'
        if (role !== "admin") {
          // Jika bukan admin, redirect ke halaman akses ditolak
          router.push("/403");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        // Jika token tidak valid, redirect ke login
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAdmin;