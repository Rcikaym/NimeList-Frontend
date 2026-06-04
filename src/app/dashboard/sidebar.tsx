import React from "react";
import { Layout, Menu } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AiOutlineAppstore,
  AiOutlineUser,
  AiOutlineVideoCamera,
  AiOutlineShoppingCart,
  AiOutlineRuby,
  AiOutlinePicRight,
} from "react-icons/ai";
import styles from "@/styles/sidebar.module.css";
import Image from "next/image";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    key: "1",
    icon: <AiOutlineAppstore size={22} />,
    label: <Link href="/dashboard">Dashboard</Link>,
    className: styles.menuItem,
  },
  {
    key: "2",
    icon: <AiOutlineUser size={22} />,
    label: <Link href="/dashboard/users">User</Link>,
    className: styles.menuItem,
  },
  {
    key: "sub1",
    icon: <AiOutlineVideoCamera size={22} />,
    label: "Manage Anime",
    className: styles.submenu,
    children: [
      {
        key: "3",
        label: <Link href="/dashboard/anime">Anime</Link>,
        className: styles.menuItem,
      },
      {
        key: "4",
        label: <Link href="/dashboard/anime/genre">Anime Genre</Link>,
        className: styles.menuItem,
      },
      {
        key: "5",
        label: <Link href="/dashboard/anime/review">Anime Review</Link>,
        className: styles.menuItem,
      },
    ],
  },
  {
    key: "sub2",
    icon: <AiOutlinePicRight size={22} />,
    label: "Manage Topic",
    className: styles.submenu,
    children: [
      {
        key: "7",
        label: <Link href="/dashboard/topic">Topic</Link>,
        className: styles.menuItem,
      },
      {
        key: "8",
        label: <Link href="/dashboard/topic/comment">Topic Comment</Link>,
        className: styles.menuItem,
      },
    ],
  },
  {
    key: "10",
    icon: <AiOutlineShoppingCart size={22} />,
    label: <Link href="/dashboard/transaction">Transaction</Link>,
    className: styles.menuItem,
  },
  {
    key: "11",
    icon: <AiOutlineRuby size={22} />,
    label: <Link href="/dashboard/premium">Premium</Link>,
    className: styles.menuItem,
  },
];

const { SubMenu } = Menu;
const { Sider } = Layout;

interface SidebarMenuProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname();

  const getSelectedKeys = () => {
    if (pathname === "/dashboard") return ["1"];
    if (pathname === "/dashboard/users") return ["2"];
    if (pathname?.startsWith("/dashboard/anime")) {
      if (pathname === "/dashboard/anime") return ["3"];
      if (pathname === "/dashboard/anime/genre") return ["4"];
      if (pathname === "/dashboard/anime/review") return ["5"];
    }
    if (pathname?.startsWith("/dashboard/topic")) {
      if (pathname === "/dashboard/topic") return ["7"];
      if (pathname === "/dashboard/topic/comment") return ["8"];
    }
    if (pathname === "/dashboard/transaction") return ["10"];
    if (pathname === "/dashboard/premium") return ["11"];
    return [];
  };

  const getOpenKeys = () => {
    if (pathname?.startsWith("/dashboard/anime")) return ["sub1"];
    if (pathname?.startsWith("/dashboard/topic")) return ["sub2"];
    return [];
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      collapsedWidth={80}
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
            <Image
              src="/images/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
          </div>
          {!collapsed && (
            <span className="text-emerald-700 text-xl font-bold tracking-wide">
              NimeList
            </span>
          )}
        </Link>
      </div>
      <Menu
  mode="inline"
  selectedKeys={getSelectedKeys()}
  defaultOpenKeys={getOpenKeys()}
  className={styles.sidebarMenu}
  items={menuItems}
/>
    </Sider>
  );
};

export default SidebarMenu;
