"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { BorderBeam } from "@/components/magicui/Borderbeam";
import { BiHide, BiShow, BiRightArrowAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Function to handle login
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token (you can choose localStorage, cookie, or other storage)
        const { exp } = jwtDecode(data.access_token);
        setAccessToken(data.access_token, exp);
        // Redirect to the dashboard or protected page after successful login
        router.push("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="relative w-full max-w-[447px] bg-[#050505] border-[#97979733] border-1 rounded-[32px] flex flex-col items-center justify-center p-6 sm:p-8 md:p-10">
      <div className="w-full text-left mb-6 mt-4 px-4">
        <p className="font-bold text-4xl sm:text-5xl mb-0 pb-2 bg-gradient-to-r from-[#05E5CB] to-[#014A42] bg-clip-text text-transparent">
          Log in
        </p>
        <span className="font-semibold text-xs sm:text-sm text-gray-400">For better experience.</span>
      </div>
      <form className="w-full flex flex-col items-center justify-center gap-4" onSubmit={handleLogin}>
        <div className="w-full flex justify-center px-4">
          <Input
            className="w-full max-w-[368px] select-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            label="Email"
            labelPlacement="inside"
            description="Enter your email"
          />
        </div>
        <div className="w-full flex justify-center px-4">
          <Input
            className="w-full max-w-[368px] select-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            labelPlacement="inside"
            description="Enter your password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <BiHide className="text-[#050505] w-[24px] h-[24px] my-auto mx-auto pointer-events-none" />
                ) : (
                  <BiShow className="text-[#050505] w-[24px] h-[24px] my-auto mx-auto pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="w-full flex justify-center px-4">
          <Button
            className="w-full max-w-[368px] bg-[#014A42] h-[60px]"
            size="lg"
            color="primary"
            type="submit"
          >
            <p className="font-semibold text-xl sm:text-2xl m-0 mb-1">Log in </p>
            <BiRightArrowAlt className="w-[24px] h-[24px]" />
          </Button>
        </div>
        <div className="w-full text-center mt-4 mb-4">
          <p className="text-[#f5f5f5] text-sm m-0">
            Didn't have an account yet?{" "}
            <span>
              <a href="/register" className="text-[#05E1C6] hover:underline">
                Register Here{" "}
              </a>
            </span>
          </p>
        </div>
      </form>
      <BorderBeam size={200} duration={15} delay={9} borderWidth={4} />
    </div>
  );
};

export default LoginForm;