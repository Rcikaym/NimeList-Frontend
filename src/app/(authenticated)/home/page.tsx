import CrossfadeCarousel from "./CrossfadeCarousel";
import MostPopular from "./MostPopularComponents";
export default function Home() {
  return (
    <main>
      <section className="flex flex-col px-4 lg:px-8 lg:flex-row min-h-screen mx-auto text-white">
        <CrossfadeCarousel interval={10000} />
      </section>

      <section className="w-full max-h-96 mt-[5rem] mx-auto min-h-svh">
        <div className="w-full h-full">
          <h1 className="w-fit font-jakarta ml-10 text-3xl font-black select-none p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
            Recommendation
          </h1>
          <ul className="flex"></ul>
        </div>
      </section>

      <section className="w-full min-h-svh max-h-96 mt-20 mx-auto">
        <div className="w-full h-full">
          <h1 className="w-fit font-jakarta ml-10 text-3xl select-none font-black p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
            Most Popular
          </h1>
          <MostPopular />
        </div>
      </section>
    </main>
  );
}
