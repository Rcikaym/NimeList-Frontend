import { Button } from "@nextui-org/react";
import CrossfadeCarousel from "./CrossfadeCarousel";
import MostPopular from "./MostPopularComponents";
import Recommended from "./RecommendedComponents";
import Link from "next/link";
import NewlyArrived from "./NewlyArrivedComponent";
export default function Home() {
  return (
    <main>
      <section className="flex flex-col px-4 lg:px-8 mb-8 lg:flex-row min-h-screen mx-auto text-white">
        <CrossfadeCarousel interval={10000} />
      </section>

      <section className="w-full h-full max-h-svh mt-[5rem] mx-auto">
        <div className="w-full h-full">
          <h1 className="w-fit font-jakarta ml-10 text-3xl font-black select-none p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
            Recommendation
          </h1>
          <Recommended />
          <ul className="flex"></ul>
        </div>
      </section>

      <section className="w-full h-full max-h-svh mt-20 mx-auto">
        <div className="w-full h-full">
          <div className="flex justify-between">
            <h1 className="w-fit font-jakarta ml-10 text-3xl select-none font-black p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
              Most Popular
            </h1>
            <Link href="/most_popular">
              <Button
                variant="ghost"
                color="primary"
                className="font-jakarta font-bold m-8 mr-16"
              >
                View More
              </Button>
            </Link>
          </div>
          <MostPopular />
        </div>
      </section>

      <section className="w-full h-full max-h-svh mt-20 mx-auto">
        <div className="w-full h-full bg-gradient-to-r from-[#0f0f0f] to-[#008576b7]">
          <h1 className="w-fit font-jakarta ml-10 text-3xl select-none font-black pl-8 bg-gradient-to-r from-[#05E1C6] to-[#009e10] bg-clip-text text-transparent">
            Newly Arrived
          </h1>
          <p className="ml-10 font-jakarta w-fit pl-8">
            Epic Adventures Await: Dive into the Hottest New Anime Releases of
            the Season!
          </p>
          {/* <NewlyArrived/> */}
        </div>
      </section>
    </main>
  );
}
