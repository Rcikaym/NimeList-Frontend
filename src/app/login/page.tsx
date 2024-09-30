
import { Button, Input } from "@nextui-org/react";
import React from "react";
import BoxReveal from "@/components/magicui/BoxReveal";
// import { BorderBeam } from "@/components/magicui/Borderbeam";
// import { BiHide, BiShow, BiRightArrowAlt } from "react-icons/bi";
import NumberTicker from "@/components/magicui/NumberTicker";
// import ShinyButton from "@/components/magicui/ShinyButton";
import LoginForm from "@/components/LoginForm";

export default function Login() {
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
              <Button href="/home" className="mt-[1.6rem] bg-[#014A42] text-[#f5f5f5]">
                Explore
              </Button>
            </BoxReveal>
          </div>

          {/* <div className="w-[447px] h-[574px] relative rounded-[32px] p-[2px] bg-[#fff6f628]"> */}
          <BoxReveal boxColor="#014A42" duration={0.5}>
            <LoginForm/>
          </BoxReveal>
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
