import { Button } from "@nextui-org/react";
import CrossfadeCarousel from "./CrossfadeCarousel";
import MostPopular from "./MostPopularComponents";
import Recommended from "./RecommendedComponents";
import Link from "next/link";
import { MdPlayArrow } from "react-icons/md";
import NewlyArrived from "./NewlyArrivedComponent";
export default function Home() {
  return (
    <main>
      <section className="flex flex-col px-4 lg:px-8 mb-8 lg:flex-row min-h-screen mx-auto text-white">
        <CrossfadeCarousel interval={10000} />
      </section>

      <section className="w-full h-[56.2vh] mt-[5rem] mx-auto">
        <div className="w-full h-full">
          <h1 className="w-fit font-jakarta ml-10 text-3xl font-black select-none p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent sm:text-2xl md:text-3xl lg:text-3xl">
            Recommendation
          </h1>
          <Recommended />
        </div>
      </section>

      <section className="w-full h-[56.2vh] mt-20 mx-auto">
        <div className="w-full h-full">
          <div className="flex flex-wrap justify-between">
            <h1 className="w-fit font-jakarta ml-10 text-3xl select-none font-black p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent sm:text-2xl md:text-3xl lg:text-3xl">
              Most Popular
            </h1>
            <Link href="/most_popular">
              <Button
                variant="ghost"
                color="primary"
                className="font-jakarta font-bold m-8 mr-16 text-indigo-50 sm:mr-8 md:mr-10 lg:mr-16"
              >
                View More
              </Button>
            </Link>
          </div>
          <MostPopular />
        </div>
      </section>

      <section className="w-full h-h-[56.2vh] mt-20 mx-auto">
        <div className="w-full h-full bg-gradient-to-r from-[#050505] via-[#050505] to-[#009951] bg-[length:100%_30%]">
          <div className="flex justify-between">
            <div>
              <h1 className="w-fit font-jakarta ml-10 text-3xl select-none font-black pl-8 bg-gradient-to-r from-[#05E1C6] to-[#009e10] bg-clip-text text-transparent">
                Newly Arrived
              </h1>
              <p className="ml-10 mb-0 font-jakarta w-fit pl-8">
                Epic Adventures Await: Dive into the Hottest New Anime Releases
                of the Season!
              </p>
            </div>
            <Link href="/newly_arrived">
              <Button
                variant="light"
                color="primary"
                className="font-jakarta font-bold m-8 mr-16 text-indigo-50 "
                endContent={<MdPlayArrow />}
              >
                VIEW ALL
              </Button>
            </Link>
          </div>
          <div className="mt-2">
            <NewlyArrived />
          </div>
        </div>
      </section>

      <section className="w-full h-[56.2vh] mt-5 mx-auto">
        <div className="w-full h-full grid place-content-center">
          <div className="justify-center text-center place-items-center">
            <img
              src="/images/tired-avatar.png"
              alt="man"
              className="select-none"
            />
            <p className="font-jakarta text-center font-semibold justify-center">
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
