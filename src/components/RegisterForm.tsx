"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { BorderBeam } from "@/components/magicui/Borderbeam";
import { BiHide, BiShow, BiRightArrowAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Function to handle login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (data.token) {
      // Simpan token di localStorage
      localStorage.setItem("token", data.token);
      alert("Registration successful");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[447px] bg-[#050505] border-[#97979733] border-1 rounded-[32px] items-center justify-center py-10">
      <div className="w-full mb-6 mt-4 ml-[4rem] ">
        <p className="font-bold text-5xl mb-0 pb-4 bg-gradient-to-r from-[#05E5CB] to-[#014A42] bg-clip-text text-transparent">
          Register
        </p>
        <span className="font-semibold text-sm">Create your profile and join the fun.</span>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <Input
          className="w-[368px] m-8 mt-2 select-none"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          type="text"
          label="Username"
          labelPlacement="inside"
          description="Enter your username"
        />

        <Input
          className="w-[368px] m-8 mt-2 select-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="text"
          label="Email"
          labelPlacement="inside"
          description="Enter your Email"
        />

        <Input
          className="w-[368px] m-8 mt-2 select-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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

        <Input
          className="w-[368px] m-8 mt-2 select-none"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          label="Confirm Password"
          labelPlacement="inside"
          description="Re-enter your password"
          type="password"
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <Button
          className="w-[368px] m-8 mb-2 mt-3 bg-[#014A42] h-[60px]"
          size="lg"
          color="primary"
          onClick={handleSubmit}
        >
          <p className="font-semibold text-2xl m-0 mb-1">Register </p>
          <BiRightArrowAlt className="w-[24px] h-[24px]" />
        </Button>

        <div className="w-full text-center mb-10">
          <p className="text-[#f5f5f5] text-sm m-0">
            Already have an account?{" "}
            <span>
              <a href="/login" className="text-[#05E1C6]">
                Log in Here{" "}
              </a>
            </span>
          </p>
        </div>
      </div>
      <BorderBeam size={200} duration={15} delay={9} borderWidth={4} />
    </div>
  );
};

export default RegisterForm;
