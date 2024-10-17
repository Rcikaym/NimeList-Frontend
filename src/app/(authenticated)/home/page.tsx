import CrossfadeCarousel from "./CrossfadeCarousel";
export default function Home() {
  return (
    <>
      <section className="flex flex-col px-4 lg:px-8 lg:flex-row min-h-screen mx-auto bg-black text-white">
        {/* Left Image Section */}
        <CrossfadeCarousel interval={10000} />
        {/* Right Content Section */}
      
      </section>
    </>
  );
}
