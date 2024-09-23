import React from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";

const { Header } = Layout;

const Navbar: React.FC = () => (
  <Header
    style={{
      padding: 0,
      backgroundColor: "#005B50",
      position: "sticky",
      top: 0,
      zIndex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    }}
  >
    <div className="flex items-center mr-3">
      <span className="mr-3 text-white">Barr77</span>
      <img
        src="/images/logo-admin.jpeg"
        alt="User Profile"
        className="w-8 h-8 rounded-full cursor-pointer"
      />
    </div>
  </Header>
);

export default Navbar;
