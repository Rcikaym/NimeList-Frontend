"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import React from "react";
import { BiChevronDown, BiLogIn, BiLogOut } from "react-icons/bi";
import {
  FaCrown,
  FaMagnifyingGlass,
  FaRegHeart,
} from "react-icons/fa6";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
  Avatar,
  User,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import Link from "next/link";
import { getAccessToken, logout } from "@/utils/auth";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { MdOutlineForum } from "react-icons/md";
import apiUrl from "@/hooks/api";
import { AnimatePresence, motion } from "framer-motion";


const menuItems = [
  {
    key: "1",
    label: (
      <Link
        href="/membership"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/15 group-hover:bg-yellow-500/25 transition-colors duration-200">
          <FaCrown className="text-yellow-500 w-4 h-4" />
        </span>
        <span className="font-medium text-sm">Membership</span>
      </Link>
    ),
  },
  {
    key: "2",
    label: (
      <Link
        href="/favorites"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/15 group-hover:bg-pink-500/25 transition-colors duration-200">
          <FaRegHeart className="text-pink-500 w-4 h-4" />
        </span>
        <span className="font-medium text-sm">Your Favorites</span>
      </Link>
    ),
  },
  {
    key: "3",
    label: (
      <Link
        href="/search"
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-200">
          <FaMagnifyingGlass className="text-white/70 w-4 h-4" />
        </span>
        <span className="font-medium text-sm">Search Anime</span>
      </Link>
    ),
  },
];

interface DataGenre {
  id: string;
  name: string;
}

const AuthNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [genres, setGenres] = useState<DataGenre[]>([]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("Guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [description, setDescription] = useState("guest@gmail.com");
  const [isLogin, setIsLogin] = useState(false);
  const [IsPremium, setIsPremium] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchPremiumStatus = async () => {
    const response = await apiUrl.get(`/user/check-premium`);
    setIsPremium(await response.data);
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const decodedToken: {
        username: string;
        email: string;
        name: string;
        role: string;
      } = jwtDecode(token);

      if (decodedToken.role === "admin") setIsAdmin(true);

      setIsLogin(true);
      setUsername(decodedToken.username);
      setName(decodedToken.name);
      setDescription(decodedToken.email);
      fetchPremiumStatus();
    }

    const fetchGenres = async () => {
      try {
        const response = await fetch(`${api}/genre/get/24`);
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        message.error("Failed to fetch genres");
      }
    };

    fetchGenres();
  }, []);

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="bg-transparent pt-3 backdrop-blur-sm z-50 text-white"
        maxWidth="full"
      >
        {/* Left: Logo + Browse */}
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarItem className="ml-7">
            <Link
              href="/home"
              className="flex items-center justify-center cursor-pointer"
            >
              <Image
                src="/images/logo.png"
                alt="logo"
                width={48}
                height={28}
                className="block"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </NavbarItem>

          <NavbarItem className="hidden sm:flex">
            <div ref={browseRef} className="relative">
              <button
                onClick={() => setBrowseOpen((prev) => !prev)}
                className="flex items-center gap-1 text-white font-semibold text-base px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Browse
                <BiChevronDown
                  style={{
                    fontSize: "20px",
                    color: "white",
                    transition: "transform 0.2s",
                    transform: browseOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <AnimatePresence>
                {browseOpen && (
                  <>
                    {/* Page blur overlay — sits behind dropdown, above page content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 top-[72px] z-[9998]"
                      style={{
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        background: "rgba(0,0,0,0.35)",
                      }}
                      onClick={() => setBrowseOpen(false)}
                    />

                    {/* Dropdown panel */}
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="fixed top-[72px] z-[9999] border border-white/10 flex rounded-bl-lg rounded-br-lg overflow-hidden"
                      style={{
                        left: "2%",
                        right: "2%",
                        background:
                          "linear-gradient(135deg, transparent 0%,rgba(0,85,75,0.75) 100% )",
                        backdropFilter: "blur(32px) saturate(200%)",
                        WebkitBackdropFilter: "blur(32px) saturate(200%)",
                        maxHeight: "340px",
                      }}
                    >
                      {/* Left panel — navigation links */}
                      <div className="flex flex-col justify-start gap-1 px-6 py-6 border-r border-white/10 min-w-[200px]">
                        <Link
                          href="/anime"
                          onClick={() => setBrowseOpen(false)}
                          className="px-4 py-3 rounded-lg text-sm font-semibold text-white/70 transition-all duration-200 ease-out hover:text-white hover:bg-white/10 hover:translate-x-1 block"
                        >
                          Browse All (A-Z)
                        </Link>
                        {/* can add more nav links here later */}
                      </div>

                      {/* Right panel — genres grid */}
                      <div className="flex-1 px-8 py-6 overflow-y-auto scrollbar-hide">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-4">
                          Genres
                        </p>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-0.5">
                          {genres.map((item) => (
                            <Link
                              key={item.id}
                              href={`/anime/genre/${item.name}`}
                              onClick={() => setBrowseOpen(false)}
                              className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 transition-all duration-200 ease-out hover:text-white hover:bg-white/10 hover:translate-x-1 block"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </NavbarItem>
        </NavbarContent>

        {/* Right: User actions + Avatar */}
        <NavbarContent className="flex items-center space-x-6" justify="end">
          <ul className="hidden md:flex items-center space-x-[50px]">
            <li>
              {IsPremium ? (
                <Link href="/forum" className="block">
                  <MdOutlineForum className="cursor-pointer w-7 h-8 text-white hover:text-teal-300 transition-colors duration-200" />
                </Link>
              ) : (
                <Link href="/membership" className="block">
                  <FaCrown className="cursor-pointer w-7 h-8 text-yellow-500 hover:text-yellow-400 transition-colors duration-200" />
                </Link>
              )}
            </li>
            <li>
              <Link href="/favorites">
                <FaRegHeart className="cursor-pointer w-6 h-6 text-white hover:text-teal-400 hover:scale-110 transition-all duration-200" />
              </Link>
            </li>
            <li>
              <Link href="/search">
                <FaMagnifyingGlass className="cursor-pointer w-6 h-6 text-white hover:text-teal-400 hover:scale-110 transition-all duration-200" />
              </Link>
            </li>
          </ul>

          <div className="flex pr-10 pl-10">
            <Dropdown
              placement="bottom-end"
              backdrop="blur"
              classNames={{ content: "bg-[#00554B]" }}
            >
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:scale-105"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                style={{ userSelect: "none" }}
                itemClasses={{
                  base: [
                    "data-[hover=true]:bg-teal-500/30",
                    "dark:data-[hover=true]:bg-teal-700/40",
                    "rounded-lg",
                    "transition-all",
                    "duration-150",
                  ],
                }}
              >
                <DropdownItem
                  key="profile1"
                  isReadOnly
                  className="h-14 gap-2 opacity-100"
                >
                  <User
                    name={name}
                    description={description}
                    classNames={{
                      name: "text-white",
                      description: "text-white opacity-50",
                    }}
                    avatarProps={{
                      size: "sm",
                      src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                    }}
                  />
                </DropdownItem>
                <DropdownItem
                  key="profile2"
                  className="dark:hover:text-white"
                  href="/profile"
                >
                  My Profile
                  <Divider orientation="horizontal" className="mt-2" />
                </DropdownItem>
                <DropdownItem
                  key="my_favorites"
                  className="dark:hover:text-white"
                  href="/profile/favorites"
                >
                  My Favorites
                  <Divider orientation="horizontal" className="mt-2" />
                </DropdownItem>
                {isLogin && isAdmin ? (
                  <DropdownItem
                    key="dashboard"
                    className="dark:hover:text-white"
                    href="/dashboard"
                  >
                    Dashboard
                    <Divider orientation="horizontal" className="mt-2" />
                  </DropdownItem>
                ) : null}
                <DropdownItem
                  key="logout"
                  className="opacity-75 text-white hover:opacity-100 hover:text-white"
                >
                  {isLogin ? (
                    <p
                      className="flex items-center font-semibold"
                      onClick={logout}
                    >
                      <BiLogOut className="w-5 h-5 mr-2" />
                      Log Out
                    </p>
                  ) : (
                    <Link href="/login">
                      <p className="flex items-center font-semibold">
                        <BiLogIn className="w-5 h-5 mr-2" />
                        Login
                      </p>
                    </Link>
                  )}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-[#00554B]/95 backdrop-blur-md pt-6 gap-1">
          {/* Section label */}
          <NavbarMenuItem key="label">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-white/40 px-3 mb-1">
              Navigation
            </p>
          </NavbarMenuItem>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.key}>{item.label}</NavbarMenuItem>
          ))}
          {/* Divider */}
          <NavbarMenuItem key="divider">
            <div className="h-px bg-white/10 my-3 mx-3" />
          </NavbarMenuItem>
          {/* Genre accordion */}
          <NavbarMenuItem key="genre">
            <Accordion
              itemClasses={{
                title:
                  "opacity-100 text-white/40 hover:text-white uppercase text-[11px] font-semibold tracking-widest",
                trigger: "px-3 py-0",
                content: "pt-1 pb-2",
              }}
              motionProps={{
                variants: {
                  enter: {
                    y: 0,
                    opacity: 1,
                    height: "auto",
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        duration: 1,
                      },
                      opacity: { easings: "ease", duration: 1 },
                    },
                  },
                  exit: {
                    y: -10,
                    opacity: 0,
                    height: 0,
                    transition: {
                      height: { easings: "ease", duration: 0.25 },
                      opacity: { easings: "ease", duration: 0.3 },
                    },
                  },
                },
              }}
            >
              <AccordionItem title="Genre">
                {/* 2-column grid for genres */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {genres.map((item) => (
                    <Link
                      href={`/anime/genre/${item.name}`}
                      key={item.id}
                      className={[
                        "relative flex items-center gap-2 px-3 py-2 rounded-lg",
                        "text-white/65 text-sm font-medium",
                        "transition-all duration-200 ease-out",
                        "hover:text-teal-300 hover:bg-teal-400/10",
                        "hover:translate-x-1",
                        // Left accent bar via border
                        // "border-l-2 border-transparent",
                        // "hover:border-teal-400",
                      ].join(" ")}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default AuthNavbar;
