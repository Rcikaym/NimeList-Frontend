import React from "react";
import { Button, Dropdown, Layout, Menu } from "antd";
import { MenuProps } from "@nextui-org/react";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";

const { Header } = Layout;

const items = [
  {
    key: "1",
    label: <a href="/dashboard/profile">Profile</a>,
    icon: <AiOutlineProfile size={17} />,
  },
  {
    key: "2",
    label: <a href="http://localhost:4321/auth/logout">Logout</a>,
    icon: <AiOutlineLogout size={17} />,
  },
];

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
    <span className="mr-3 text-white">Barr77</span>
    <Dropdown menu={{ items }} placement="bottomRight">
      <div className="flex items-center mr-3">
        <img
          src="/images/logo-admin.jpeg"
          alt="User Profile"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </Dropdown>
  </Header>
);

export default Navbar;
