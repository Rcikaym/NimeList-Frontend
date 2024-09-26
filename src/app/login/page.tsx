"use client";

import { button, Button, Input } from "@nextui-org/react";
import React from "react";
import BoxReveal from "@/components/magicui/BoxReveal";
import { BorderBeam } from "@/components/magicui/Borderbeam";
import { BiHide, BiShow, BiRightArrowAlt } from "react-icons/bi";
import NumberTicker from "@/components/magicui/NumberTicker";
import ShinyButton from "@/components/magicui/ShinyButton";

export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <div className="container flex mx-auto min-h-screen items-center justify-center">
        <div className="flex justify-center space-x-48 mr-3">
          <div className="h-full w-full max-w-[32rem] items-center justify-center overflow-hidden mt-8 ml-8">
            <BoxReveal boxColor={"#014A42"} duration={0.5}>
              <p className="text-[3.5rem] font-semibold">
                NimeList<span className="text-[#05E1C6]">.</span>
              </p>
            </BoxReveal>

            <BoxReveal boxColor={"#014A42"} duration={0.5}>
              <h2 className="mt-[.5rem] text-[1rem]">
                Dive into the world of anime with{" "}
                <span className="text-[#05E1C6]">NimeList</span>.
              </h2>
            </BoxReveal>

            <BoxReveal boxColor={"#014A42"} duration={0.5}>
              <div className="mt-[1.5rem]">
                <p>
                  Discover handpicked anime{" "}
                  <span className="font-semibold text-[#05E1C6]">
                    just for you
                  </span>
                  . <br />
                  Share your opinions, rate shows, and{" "}
                  <span className="font-semibold text-[#05E1C6]">
                    join the conversation
                  </span>
                  . <br />
                  Stay on top of your favorite series with{" "}
                  <span className="font-semibold text-[#05E1C6]">
                    personalized watchlists
                  </span>
                  . <br />
                  Connect with fellow fans and{" "}
                  <span className="font-semibold text-[#05E1C6]">
                    explore new stories together
                  </span>
                  .
                </p>
              </div>
            </BoxReveal>

            <BoxReveal boxColor={"#014A42"} duration={0.5}>
              <p className="mt-[1.5rem] text-center">
                Join over{" "}
                <span>
                  <NumberTicker
                    className="font-semibold text-xl dark:text-[#05E1C6]"
                    value={10000}
                  />
                </span>{" "}
                anime enthusiasts who have already registered!
              </p>
            </BoxReveal>

            <BoxReveal boxColor={"#014A42"} duration={0.5}>
              <Button className="mt-[1.6rem] bg-[#014A42] text-[#f5f5f5]">
                Explore
              </Button>
            </BoxReveal>
          </div>

          {/* <div className="w-[447px] h-[574px] relative rounded-[32px] p-[2px] bg-[#fff6f628]"> */}
          <BoxReveal boxColor="#014A42" duration={0.5}>
            <div className="w-full h-full max-w-[447px] max-h-[574px] bg-[#050505] border-[#97979733] border-1 rounded-[32px] flex items-center justify-center">
              <div className="absolute top-0 left-0 m-8 mb-6 mt-10">
                <p className="font-bold text-5xl mb-0 pb-4 bg-gradient-to-r from-[#05E5CB] to-[#014A42] bg-clip-text text-transparent">
                  Log in
                </p>
                <span className="font-semibold text-sm">
                  For better experience.
                </span>
              </div>
              <div className="w-[447px] h-[574px] items-center justify-center pt-[9rem]">
                <Input
                  className="w-[368px] m-8 select-none"
                  key="username"
                  type="username"
                  label="Username"
                  labelPlacement="inside"
                  description="Enter your username"
                />
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
                <Button
                  className="w-[368px] m-8 mb-2 bg-[#014A42] h-[60px]"
                  size="lg"
                  color="primary"
                >
                  <p className="font-semibold text-2xl m-0 mb-1">Log in </p>{" "}
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
              </div>
              <BorderBeam size={200} duration={15} delay={9} borderWidth={4} />
            </div>
          </BoxReveal>
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
