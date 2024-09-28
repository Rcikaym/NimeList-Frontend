"use client";

import React from "react";
import { Input } from "@nextui-org/react";
import { BiHide, BiShow } from "react-icons/bi";

const PasswordInput: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      className="w-[368px] m-8 select-none"
      key="password"
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
  );
};

export default PasswordInput;
