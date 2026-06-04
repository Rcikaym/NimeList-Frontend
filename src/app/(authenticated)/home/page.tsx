"use client";

import { Button } from "@nextui-org/react";
import CrossfadeCarousel from "./CrossfadeCarousel";
import MostPopular from "./MostPopularComponents";
import Recommended from "./RecommendedComponents";
import Link from "next/link";
import { MdPlayArrow } from "react-icons/md";
import NewlyArrived from "./NewlyArrivedComponent";
export default function Home() {
  return (
    <main className="w-full">
      <section className="flex flex-col px-4 lg:px-8 mb-8 lg:flex-row min-h-screen mx-auto text-white">
        <CrossfadeCarousel interval={10000} />
      </section>

      <section className="w-full h-auto mt-12 md:mt-20 mx-auto px-4 md:px-8 overflow-hidden">
        <div className="w-full h-full">
          <h1 className="w-fit font-jakarta text-2xl md:text-3xl font-black select-none px-4 md:px-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
            Recommendation
          </h1>
          <Recommended />
        </div>
      </section>

      <section className="w-full h-auto mt-12 md:mt-20 mx-auto px-4 md:px-8 overflow-hidden">
        <div className="w-full h-full">
          <div className="flex flex-wrap justify-between items-center px-4 md:px-8 gap-4">
            <h1 className="w-fit font-jakarta text-2xl md:text-3xl select-none font-black bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
              Most Popular
            </h1>
            <Link href="/most_popular">
              <Button
                variant="ghost"
                color="primary"
                className="font-jakarta font-bold text-indigo-50"
              >
                View More
              </Button>
            </Link>
          </div>
          <MostPopular />
        </div>
      </section>

      <section className="w-full h-auto mt-12 md:mt-20 mx-auto overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-[#050505] via-[#050505] to-[#009951] bg-[length:100%_30%] px-4 md:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 md:px-8 gap-4">
            <div>
              <h1 className="w-fit font-jakarta text-2xl md:text-3xl select-none font-black bg-gradient-to-r from-[#05E1C6] to-[#009e10] bg-clip-text text-transparent">
                Newly Arrived
              </h1>
              <p className="mt-2 font-jakarta text-sm lg:text-base w-full lg:w-fit text-gray-300">
                Epic Adventures Await: Dive into the Hottest New Anime Releases
                of the Season!
              </p>
            </div>
            <Link href="/newly_arrived">
              <Button
                variant="light"
                color="primary"
                className="font-jakarta font-bold text-indigo-50 mt-2 lg:mt-0"
                endContent={<MdPlayArrow />}
              >
                VIEW ALL
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <NewlyArrived />
          </div>
        </div>
      </section>

      <section className="w-full h-auto py-16 mt-12 mx-auto">
        <div className="w-full h-full grid place-content-center">
          <div className="justify-center text-center place-items-center px-4">
            <img
              src="/images/tired-avatar.png"
              alt="man"
              className="select-none mx-auto mb-4"
            />
            <p className="font-jakarta text-center font-semibold justify-center mb-4 text-gray-300">
              Haven't found what you're looking for?
              <br />
              Explore our full library for more!
            </p>
            <Button
              className="font-jakarta font-bold text-indigo-50"
              color="primary"
              size="md"
              variant="ghost"
              href="/explore"
            >
              Dive More
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
