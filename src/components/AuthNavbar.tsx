"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import React from "react";
import { BiChevronDown, BiLogOut } from "react-icons/bi";
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
import { removeAccessToken } from "@/utils/auth";
import { message } from "antd";

const inter = Inter({ subsets: ["latin"] });
const url =
  "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

const items = [
  {
    label: (
      <Link className="text-white" href="/action">
        Action
      </Link>
    ),
    key: "1",
  },
  {
    label: (
      <Link className="text-white" href="/adventure">
        Adventure
      </Link>
    ),
    key: "2",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Avant Garde
      </Link>
    ),
    key: "3",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Comedy
      </Link>
    ),
    key: "4",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Drama
      </Link>
    ),
    key: "5",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Isekai
      </Link>
    ),
    key: "6",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Josei
      </Link>
    ),
    key: "7",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Magic
      </Link>
    ),
    key: "8",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Martial Arts
      </Link>
    ),
    key: "9",
  },
  {
    label: (
      <Link className="text-white" href="#">
        Mecha
      </Link>
    ),
    key: "10",
  },
];

const menuItems = [
  {
    key: "0",
    label: <p className="opacity-75 font-bold text-2xl:">Menu</p>,
  },
  {
    key: "1",
    label: (
      <Link className="text-white hover:underline" href="/membership">
        Membership
      </Link>
    ),
  },
  {
    key: "2",
    label: (
      <Link className="text-white hover:underline" href="/favorites">
        Your Favorites
      </Link>
    ),
  },
  {
    key: "3",
    label: (
      <Link className="text-white hover:underline" href="/search">
        Search Anime
      </Link>
    ),
  },
];
const AuthNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [username, setUsername] = useState("Guest");
  const [description, setDescription] = useState("guest@gmail.com");
  const router = useRouter();

  // Ensure dynamic content only renders on the client
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // console.log("Token:", token);

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedToken.username);
      setDescription(decodedToken.email);
    }
  }, []);

  const handleLogout = async () => {
    const res = await removeAccessToken();

    if (res.status === 200) {
      message.success(res.message);
      router.push("/home");
      setTimeout(() => {
        window.location.reload();
      }, 100); // Refresh after 100 milliseconds
    } else {
      message.error(res.message);
    }
  };

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="bg-transparent pt-3"
        maxWidth="full"
      >
        <NavbarContent justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarItem className="ml-7">
            <Link
              href="/"
              className="flex items-center justify-center w-12 h-7 cursor-pointer"
            >
              <Image
                src="/images/logo.png"
                alt="logo"
                width={48}
                height={28}
                className="block"
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
                itemClasses={{
                  base: [
                    "data-[hover=true]:bg-teal-500",
                    "dark:data-[hover=true]:bg-teal-700",
                  ],
                }}
              >
                {/* Map through the items array and create DropdownItem for each */}
                {items.map((item) => (
                  <DropdownItem key={item.key} className="opacity-100">
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="flex items-center space-x-6" justify="end">
          <ul className="hidden md:flex items-center space-x-[50px]">
            <li>
              <Link href="/membership" className="block">
                <Image
                  src="/images/crown.svg"
                  alt="membership"
                  width={29}
                  height={32}
                  priority
                  className="cursor-pointer"
                />
              </Link>
            </li>
            <li>
              <Link href="/favorites">
                <Image
                  src="/images/bookmark.svg"
                  alt="bookmark"
                  width={29}
                  height={32}
                  priority
                  className="cursor-pointer"
                />
              </Link>
            </li>
            <li>
              <Link href="/search">
                <Image
                  src="/images/magnifying.svg"
                  alt="search"
                  width={29}
                  height={32}
                  priority
                  className="cursor-pointer"
                />
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
                    name={username}
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
                <DropdownItem
                  key="logout"
                  onClick={handleLogout}
                  className="opacity-75 text-white dark hover:opacity-100 hover:text-white"
                >
                  <p className=" flex items-center font-semibold">
                    <BiLogOut className="w-5 h-5 mr-2" />
                    Log Out
                  </p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarContent>
        <NavbarMenu className={`${isMenuOpen ? "bg-black" : ""}`}>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.key}>{item.label}</NavbarMenuItem>
          ))}
          <Accordion
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
            <AccordionItem className="text-white opacity-100" title="Genre">
              {items.map((item) => (
                <p key={item.key} className="opacity-75">
                  {item.label}
                </p>
              ))}
            </AccordionItem>
          </Accordion>
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default AuthNavbar;
