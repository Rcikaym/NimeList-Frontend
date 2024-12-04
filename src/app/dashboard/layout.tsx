"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { checkAdminRole } from "@/utils/adminRole";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth";

const { Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      setIsInitialized(false);
      return;
    }

    const isAdmin = checkAdminRole();
    if (!isAdmin) {
      setIsInitialized(false);
      router.push("/403");
    } else {
      setIsInitialized(true);
    }
  });

  if (!isInitialized) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Navbar />
        <Content
          style={{
            padding: 24,
            background: "#ffff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
