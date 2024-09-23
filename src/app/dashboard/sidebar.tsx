"use client";

import React from "react";
import { Layout, Menu } from "antd";
import Link from "next/link"; // Menggunakan Link dari Next.js
import {
  AiOutlineAlignCenter,
  AiOutlineAppstore,
  AiOutlineUser,
  AiOutlineVideoCamera,
} from "react-icons/ai";

import { usePathname } from "next/navigation";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
  const path = usePathname();

  const getSelectedKeys = () => {
    if (path === "/dashboard") return ["1"];
    if (path === "/dashboard/users") return ["2"];
    if (path?.startsWith("/dashboard/anime")) {
      if (path === "/dashboard/anime") return ["3"];
      if (path === "/dashboard/anime/photo") return ["4"];
      if (path === "/dashboard/anime/genre") return ["5"];
      if (path === "/dashboard/anime/review") return ["6"];
    }
    if (path?.startsWith("/dashboard/topic")) {
      if (path === "/dashboard/topic") return ["7"];
      if (path === "/dashboard/topic/photo") return ["8"];
      if (path === "/dashboard/topic/comment") return ["9"];
    }
    return [];
  };

  const getOpenKeys = () => {
    if (path?.startsWith("/dashboard/anime")) return ["sub1"];
    if (path?.startsWith("/dashboard/topic")) return ["sub2"];
    return [];
  };

  return (
    <Sider
      style={{
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 1000,
        backgroundColor: "white",
      }}
    >
      <div className="flex items-center justify-between p-5">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex items-center rounded-md bg-[#005B50] p-2">
            <img
              src="/images/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
          </div>
          <span className="text-emerald-700 text-xl font-bold tracking-wide">
            NimeList
          </span>
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        style={{
          height: "100%",
          borderRight: 0,
          padding: 2,
          backgroundColor: "transparent",
        }}
      >
        <Menu.Item key="1" icon={<AiOutlineAppstore size={22} />}>
          <Link href="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<AiOutlineUser size={22} />}>
          <Link href="/dashboard/users">User</Link>
        </Menu.Item>
        <SubMenu
          key="sub1"
          icon={<AiOutlineVideoCamera size={22} />}
          title="Manage Anime"
        >
          <Menu.Item key="3">
            <Link href="/dashboard/anime">Anime</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="/dashboard/anime/photo">Anime Photo</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="/dashboard/anime/genre">Anime Genre</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link href="/dashboard/anime/review">Anime Review</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          icon={<AiOutlineAlignCenter size={22} />}
          title="Manage Topic"
        >
          <Menu.Item key="7" className="hover:text-blue-500">
            <Link href="/dashboard/topic">Topic</Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link href="/dashboard/topic/photo">Topic Photo</Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link href="/dashboard/topic/photo">Comment Topic</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
