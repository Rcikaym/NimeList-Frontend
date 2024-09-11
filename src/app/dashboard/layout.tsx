"use client";
// File: src/layout/Layout.tsx

import React from "react";
import Sidebar from "./sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHome from "../dashboard/page"; // Halaman Dashboard
import Users from "./users/page"; // Halaman Users
import Anime from "./anime/page"; // Halaman Anime
import Genre from "./anime/genre/page"; // Halaman Genre
import Review from "./anime/review/page"; // Halaman Review
import AnimeDetails from "./anime/[id]/animeDetails"; // Komponen Detail Anime

const Layout: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          {/* Navbar */}
          <header className="bg-emerald-700 p-4 text-white flex justify-end items-center fixed top-0 left-64 right-0 z-10">
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
          <main className="p-6 bg-gray-50 flex-grow mt-16">
            {/* Routes untuk konten */}
            <Routes>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/anime" element={<Anime />} />
              <Route path="/dashboard/anime/genre" element={<Genre />} />
              <Route path="/dashboard/anime/review" element={<Review />} />
              <Route
                path="/dashboard/anime/:id"
                element={<AnimeDetails />}
              />{" "}
              {/* Route Dinamis */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Layout;
