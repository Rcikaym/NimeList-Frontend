"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { BorderBeam } from "@/components/magicui/Borderbeam";
import { BiHide, BiShow, BiRightArrowAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ username, password }),
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
    <div className="w-full h-full max-w-[447px] max-h-[574px] bg-[#050505] border-[#97979733] border-1 rounded-[32px] flex items-center justify-center">
      <div className="absolute top-0 left-0 m-8 mb-6 mt-10">
        <p className="font-bold text-5xl mb-0 pb-4 bg-gradient-to-r from-[#05E5CB] to-[#014A42] bg-clip-text text-transparent">
          Log in
        </p>
        <span className="font-semibold text-sm">For better experience.</span>
      </div>
      <form className="w-[447px] h-[574px] items-center justify-center pt-[9rem]" onSubmit={handleLogin}>
        <Input
          className="w-[368px] m-8 select-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          label="Username"
          labelPlacement="inside"
          description="Enter your username"
        />
        <Input
          className="w-[368px] m-8 select-none"
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
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Button
          className="w-[368px] m-8 mb-2 bg-[#014A42] h-[60px]"
          size="lg"
          color="primary"
          type="submit"
        >
          <p className="font-semibold text-2xl m-0 mb-1">Log in </p>
          <BiRightArrowAlt className="w-[24px] h-[24px]" />
        </Button>
        <div className="w-full text-center mb-10">
          <p className="text-[#f5f5f5] text-sm m-0">
            Didn't have an account yet?{" "}
            <span>
              <a href="/register" className="text-[#05E1C6]">
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