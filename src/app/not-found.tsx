// import { Home } from ";
"use client";
import { FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${
              mousePosition.y * -0.02
            }px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        />
      </div>

      {/* Content container with glass effect */}
      <div className="relative z-10 text-center space-y-6 max-w-lg p-8 rounded-2xl bg-black/50 backdrop-blur-xl borde shadow-2xl">
        {/* Animated 404 Number with enhanced glow */}
        <div className="relative">
          <h1 className="text-8xl font-bold text-gray-200 animate-bounce">
            <span className="relative inline-block after:absolute after:inset-0 after:blur-md after:bg-blue-500/20 after:animate-pulse">
              4
            </span>
            <span className="relative inline-block text-blue-500 after:absolute after:inset-0 after:blur-lg after:bg-blue-500/50 after:animate-pulse">
              0
            </span>
            <span className="relative inline-block after:absolute after:inset-0 after:blur-md after:bg-blue-500/20 after:animate-pulse">
              4
            </span>
          </h1>
        </div>

        {/* Main heading with enhanced gradient */}
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
          Page Not Found
        </h2>

        {/* Description with subtle glow */}
        <div className="relative">
          <span className="text-gray-300 text-lg block">
            Oops! The page you're looking for has drifted into the digital
            abyss.
          </span>
          <div className="absolute inset-0 blur-3xl bg-blue-500/5" />
        </div>

        {/* Enhanced glowing button */}
        <div className="pt-4">
          <button
            onClick={() => (window.location.href = "/home")}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg relative group transition-all duration-200 hover:scale-105 transform active:scale-95"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            <div className="relative flex items-center">
              <FaHome className="mr-2 h-5 w-5" />
              Back to Home
            </div>
          </button>
        </div>

        {/* Additional helper text with subtle glow */}
        <div className="relative mt-8">
          <span className="text-sm text-gray-400 block">
            If you believe this is a mistake, please contact our support team.
          </span>
          <div className="absolute inset-0 blur-2xl bg-blue-500/5" />
        </div>
      </div>
    </div>
  );
}
