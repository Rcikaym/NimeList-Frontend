export default function Home() {
  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        {/* Left Image Section */}
        <div className="relative w-1/2">
          <img
            src="images.jpg" // Replace with your image path
            alt="Movie Scene"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        {/* Right Content Section */}
        <div className="flex flex-col justify-center w-1/2 p-10">
          <h1 className="text-5xl font-bold mb-2">The Title of The Movies</h1>
          <p className="text-sm mb-4">
            <span className="font-semibold">Action, Romance, Drama</span>
          </p>
          <p className="text-gray-300 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nibh
            tellus, ultricies venenatis, ut id hendrerit mi. Nunc condimentum
            velit non incidunt fermentum. Phasellus ac est eget dolor suscipit.
            Donec sit amet justo.
          </p>

          <div className="flex items-center mb-6">
            <button className="bg-[#05E1C6] text-black py-2 px-4 rounded-lg hover:bg-[#00BFA3] transition duration-300">
              WATCH THE TRAILER
            </button>
            <span className="mx-4 text-gray-400">|</span>
            <button className="bg-transparent border border-[#05E1C6] text-[#05E1C6] py-2 px-4 rounded-lg hover:bg-[#05E1C6] hover:text-black transition duration-300">
              ADD TO WATCHLIST
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
