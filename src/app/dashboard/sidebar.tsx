"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreFilled,
  UserOutlined,
  CrownFilled,
  VideoCameraOutlined,
  DollarOutlined,
  CreditCardOutlined,
  CommentOutlined,
  CrownOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [mounted, setMounted] = useState(false);
  const [animeMenuOpen, setAnimeMenuOpen] = useState(false); // State untuk submenu

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAnimeMenu = () => {
    setAnimeMenuOpen((prev) => !prev);
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <AppstoreFilled /> },
    { href: "/dashboard/users", label: "Users", icon: <UserOutlined /> },
    { href: "/dashboard/premium", label: "Premium", icon: <CrownOutlined /> },
    {
      label: "Manage Anime",
      icon: <VideoCameraOutlined />,
      subItems: [
        { href: "/dashboard/anime", label: "Anime" },
        { href: "/dashboard/anime/photo", label: "Photo Anime" },
        { href: "/dashboard/anime/genre", label: "Genre Anime" },
        { href: "/dashboard/anime/review", label: "Review Anime" },
      ],
    },
    { href: "/dashboard/payment", label: "Payment", icon: <DollarOutlined /> },
    {
      href: "/dashboard/payment-method",
      label: "Payment Method",
      icon: <CreditCardOutlined />,
    },
    {
      href: "/dashboard/manage-topic",
      label: "Manage Topic",
      icon: <CommentOutlined />,
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <aside className="w-64 bg-white border-r h-screen fixed">
      <div className="p-6">
        <div className="flex items-center justify-between mb-10">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center rounded-md bg-emerald-700 p-2">
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
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.href || item.label} className="mb-4">
                {/* Jika ada subItems, tampilkan toggle submenu */}
                {item.subItems ? (
                  <>
                    <div
                      className={`flex items-center p-2 font-sans font-medium rounded-md cursor-pointer
                      text-emerald-950 hover:bg-gray-100`}
                      onClick={toggleAnimeMenu}
                    >
                      {React.cloneElement(item.icon, {
                        style: { fontSize: 20, marginRight: 7 },
                      })}
                      {item.label}
                      <DownOutlined
                        className={`ml-auto transition-transform ${
                          animeMenuOpen ? "rotate-0" : "-rotate-90"
                        }`}
                        style={{ fontSize: 12 }}
                      />
                    </div>
                    {/* Submenu untuk "Manage Anime" */}
                    {animeMenuOpen && (
                      <ul className="ml-6 mt-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.href} className="mb-2">
                            <Link to={subItem.href}>
                              <div
                                className={`p-2 font-sans font-medium rounded-md
                                ${
                                  pathname === subItem.href
                                    ? "bg-emerald-700 text-white"
                                    : "text-emerald-950 hover:bg-gray-100"
                                }`}
                              >
                                {subItem.label}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link to={item.href}>
                    <div
                      className={`flex items-center p-2 font-sans font-medium rounded-md
                      ${
                        pathname === item.href
                          ? "bg-emerald-700 text-white"
                          : "text-emerald-950 hover:bg-gray-100"
                      }`}
                    >
                      {React.cloneElement(item.icon, {
                        style: { fontSize: 20, marginRight: 7 },
                      })}
                      {item.label}
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
