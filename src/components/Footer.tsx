"use client";

// import { useState } from "react";
import { Inter } from "next/font/google";
// import "/app/globals.css";
import Image from "next/image";
import React from "react";
import {
  TwitterOutlined,
  GithubOutlined,
  FacebookOutlined,
  DiscordFilled,
} from "@ant-design/icons";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

const Footer = () => {
  return (
    <footer className="w-full bg-[#0B0B0B]">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-5">
          <div>
            <Image
              src="/images/logo.png"
              alt="Nimelist_logo"
              width={40}
              height={40}
              className="flex ml-10 mb-5 sm:justify-center md:mt-0 filter brightness-0 invert select-none"
              priority
            />
            <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <FacebookOutlined width={20} height={20} />
                <span className="sr-only">Facebook page</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <DiscordFilled />
                <span className="sr-only">Discord community</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <TwitterOutlined />
                <span className="sr-only">Twitter page</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <GithubOutlined />
                <span className="sr-only">GitHub account</span>
              </Link>
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Navigation
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link href="#" className=" hover:underline">
                  Browse Popular
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  New Release
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Search
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Brand Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Connect with us
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link href="#" className=" hover:underline">
                  Discord Server
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Twitter
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Facebook
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Licensing
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Account
            </h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Log in
                </Link>
              </li>
              <li className="mb-4">
                <Link href="#" className="hover:underline">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="px-4 py-6 bg-transparent dark:bg-transparent md:flex md:items-center md:justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-150 sm:text-center">
            © 2024 <Link href="https://localhost.3000/">NimeList™</Link>. All
            Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
