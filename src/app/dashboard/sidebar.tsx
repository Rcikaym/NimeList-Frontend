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

const { SubMenu } = Menu;
const { Sider } = Layout;

const SidebarMenu = () => {
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
          <span className="text-emerald-700 text-xl font-bold tracking-wide">
            NimeList
          </span>
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        className={styles.sidebarMenu}
      >
        <Menu.Item
          key="1"
          icon={<AiOutlineAppstore size={22} />}
          className={styles.menuItem}
        >
          <Link href="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<AiOutlineUser size={22} />}
          className={styles.menuItem}
        >
          <Link href="/dashboard/users">User</Link>
        </Menu.Item>
        <SubMenu
          key="sub1"
          icon={<AiOutlineVideoCamera size={22} />}
          title="Manage Anime"
          className={styles.submenu}
        >
          <Menu.Item key="3" className={styles.menuItem}>
            <Link href="/dashboard/anime">Anime</Link>
          </Menu.Item>
          <Menu.Item key="4" className={styles.menuItem}>
            <Link href="/dashboard/anime/genre">Anime Genre</Link>
          </Menu.Item>
          <Menu.Item key="5" className={styles.menuItem}>
            <Link href="/dashboard/anime/review">Anime Review</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          icon={<AiOutlinePicRight size={22} />}
          title="Manage Topic"
          className={styles.submenu}
        >
          <Menu.Item key="7" className={styles.menuItem}>
            <Link href="/dashboard/topic">Topic</Link>
          </Menu.Item>
          <Menu.Item key="8" className={styles.menuItem}>
            <Link href="/dashboard/topic/comment">Topic Comment</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          key="10"
          icon={<AiOutlineShoppingCart size={22} />}
          className={styles.menuItem}
        >
          <Link href="/dashboard/transaction">Transaction</Link>
        </Menu.Item>
        <Menu.Item
          key="11"
          icon={<AiOutlineRuby size={22} />}
          className={styles.menuItem}
        >
          <Link href="/dashboard/premium">Premium</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarMenu;
