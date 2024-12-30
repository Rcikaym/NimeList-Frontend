"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import React from "react";
import { BiChevronDown, BiLogIn, BiLogOut } from "react-icons/bi";
import {
  FaCrown,
  FaMagnifyingGlass,
  FaStar,
  FaRegHeart,
} from "react-icons/fa6";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
  Button,
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
import { useRouter } from "next/navigation";
import { getAccessToken, logout } from "@/utils/auth";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { MdOutlineForum } from "react-icons/md";
import apiUrl from "@/hooks/api";
import { s } from "framer-motion/client";

const inter = Inter({ subsets: ["latin"] });
const url =
  "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";
const menuItems = [
  {
    key: "0",
    label: <p className="opacity-75 font-bold text-2xl:">Menu</p>,
  },
  {
    key: "1",
    label: (
      <div className="flex">
        <FaCrown className="m-2 text-yellow-600 w-5 h-4" />
        <Link className="text-white hover:underline" href="/membership">
          Membership
        </Link>
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <div className="flex">
        <FaStar className="m-2 text-yellow-600 w-5 h-5" />
        <Link className="text-white hover:underline" href="/favorites">
          Your Favorites
        </Link>
      </div>
    ),
  },
  {
    key: "3",
    label: (
      <div className="flex">
        <FaMagnifyingGlass className="m-2 w-5 h-5" />
        <Link className="text-white hover:underline" href="/search">
          Search Anime
        </Link>
      </div>
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

  const fetchPremiumStatus = async () => {
    const response = await apiUrl.get(`/user/check-premium`);

    setIsPremium(await response.data);
  };

  // Ensure dynamic content only renders on the client
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const decodedToken: {
        username: string;
        email: string;
        name: string;
        role: string;
      } = jwtDecode(token);

      if (decodedToken.role === "admin") {
        setIsAdmin(true);
      }

      setIsLogin(true);
      setUsername(decodedToken.username);
      setName(decodedToken.name);
      setDescription(decodedToken.email);
      setIsLogin(true);
      fetchPremiumStatus();
    }

    const fetchGenres = async () => {
      try {
        const response = await fetch(`${api}/genre/get-all`);
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
        className="bg-transparent pt-3 overflow-hidden backdrop-blur-sm z-50"
        maxWidth="full"
      >
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
                style={{ width: "auto", height: "auto" }} // Adds CSS to maintain aspect ratio
              />
            </Link>
          </NavbarItem>
          <NavbarItem className="hidden md:flex">
            <Dropdown
              backdrop="blur"
              placement="bottom-start"
              classNames={{
                content: "bg-[#00554B]",
              }}
            >
              <DropdownTrigger className="text-white font-semibold">
                <Button variant="light" size="lg">
                  Browse
                  <BiChevronDown style={{ fontSize: "20px", color: "white" }} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                className="max-h-[300px] overflow-y-auto scrollbar-hide grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                itemClasses={{
                  base: [
                    "data-[hover=true]:bg-teal-500",
                    "dark:data-[hover=true]:bg-teal-700",
                  ],
                }}
              >
                {/* Map through the items array and create DropdownItem for each */}
                {genres.map((item) => (
                  <DropdownItem
                    key={`${item.name}-${item.id}`}
                    className="opacity-100"
                  >
                    <Link href={`/anime/genre/${item.name}`}>{item.name}</Link>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="flex items-center space-x-6" justify="end">
          <ul className="hidden md:flex items-center space-x-[50px]">
            <li>
              {IsPremium ? (
                <Link href="/forum" className="block">
                  <MdOutlineForum className="cursor-pointer w-7 h-8" />
                </Link>
              ) : (
                <Link href="/membership" className="block">
                  <FaCrown className="cursor-pointer w-7 h-8 text-yellow-500" />
                </Link>
              )}
            </li>
            <li>
              <Link href="/favorites">
                <FaRegHeart className="cursor-pointer w-6 h-6" />
              </Link>
            </li>
            <li>
              <Link href="/search">
                <FaMagnifyingGlass className="cursor-pointer w-6 h-6" />
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
                  className="transition-transform"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                style={{ userSelect: "none" }}
                itemClasses={{
                  base: [
                    "data-[hover=true]:bg-teal-500",
                    "dark:data-[hover=true]:bg-teal-700",
                  ],
                }}
              >
                <DropdownItem
                  key="profile1"
                  isReadOnly
                  className="h-14 gap-2 opacity-100 "
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
                  className="dark:hover:text-white "
                  href="/profile/favorites"
                >
                  My Favorites
                  <Divider orientation="horizontal" className="mt-2" />
                </DropdownItem>
                <>
                  {isLogin && isAdmin ? (
                    <DropdownItem
                      key="dashboard"
                      className="dark:hover:text-white"
                      href="/dashboard"
                    >
                      <>
                        Dashboard
                        <Divider orientation="horizontal" className="mt-2" />
                      </>
                    </DropdownItem>
                  ) : (
                    ""
                  )}
                </>
                <DropdownItem
                  key="logout"
                  className="opacity-75 text-white dark hover:opacity-100 hover:text-white"
                >
                  {isLogin ? (
                    <p
                      className=" flex items-center font-semibold"
                      onClick={logout}
                    >
                      <BiLogOut className="w-5 h-5 mr-2" />
                      Log Out
                    </p>
                  ) : (
                    <Link href="/login">
                      <p className=" flex items-center font-semibold">
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
        <NavbarMenu className={`${isMenuOpen ? "bg-transparent" : ""}`}>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.key}>{item.label}</NavbarMenuItem>
          ))}
          <Accordion
            itemClasses={{
              title: "opacity-100 text-white",
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
                    opacity: {
                      easings: "ease",
                      duration: 1,
                    },
                  },
                },
                exit: {
                  y: -10,
                  opacity: 0,
                  height: 0,
                  transition: {
                    height: {
                      easings: "ease",
                      duration: 0.25,
                    },
                    opacity: {
                      easings: "ease",
                      duration: 0.3,
                    },
                  },
                },
              },
            }}
          >
            <AccordionItem className="text-white" title="Genre">
              {genres.map((item) => (
                <Link href={`/anime/genre/${item.name}`} key={item.id}>
                  <p className="opacity-100">{item.name}</p>
                </Link>
              ))}
            </AccordionItem>
          </Accordion>
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default AuthNavbar;
