"use client";
// File: src/layout/Layout.tsx

import React from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <header className="bg-[#005B50] p-4 text-white flex justify-end items-center fixed top-0 left-64 right-0 z-10">
          <div className="flex items-center">
            <span className="mr-3">Barr77</span>
            <img
              src="/images/logo-admin.jpeg"
              alt="User Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-gray-50 flex-grow mt-16">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
