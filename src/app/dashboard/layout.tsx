"use client";

import React from "react";
import { Layout } from "antd";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import withAdmin from "@/hooks/withAdmin";

const { Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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

export default withAdmin(DashboardLayout);
