"use client";

import React from "react";
import { Layout } from "antd";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 200 }}>
        <Navbar />
        <Content
          style={{
            margin: "24px 16px 0",
            padding: 24,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
