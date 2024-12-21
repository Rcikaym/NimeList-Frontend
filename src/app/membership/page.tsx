import AuthNavbar from "@/components/AuthNavbar";
import { RiMedalFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import PageTitle from "@/components/TitlePage";
import MembershipPlans from "./MembershipPlans";
import {
  FaItalic,
  FaBold,
  FaImages,
  FaMousePointer,
  FaCrown,
} from "react-icons/fa";

export default function Membership() {
  return (
    <>
      <PageTitle title={`NimeList - Membership`} />
      <div className="min-h-screen bg-gradient-to-b from-[#009951] via-[#050505] via-45% to-[#050505]">
        <AuthNavbar />
        <header className="py-12 text-center mt-9">
          <div className="text-center mt-10 px-4 sm:px-8 md:px-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              NimeList Membership.
            </h1>
            <div className="mt-10 md:mt-14">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Experience the Benefits of Community Membership.
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg tracking-wide leading-relaxed mx-auto max-w-screen-md">
                Join our vibrant community and enjoy exclusive benefits, connect
                with like-minded individuals, and stay updated with the latest
                community discussion. Sign up today and be a part of something
                great!
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between space-y-10 md:space-y-0 md:space-x-20 mt-32 px-8 md:px-16 lg:px-44">
            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <RiMedalFill className="w-20 h-20 mb-4 md:w-24 md:h-24 transition-transform duration-300 hover:transform hover:scale-110" />
              <p>
                Have the opportunity to earn exclusive badges that showcase your
                engagement and contributions.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <IoCreate className="w-20 h-20 mb-4 md:w-24 md:h-24 transition-transform duration-300 hover:transform hover:scale-110" />
              <p>
                Gain the exclusive ability to create new topic discussions in
                our forums. Lead conversations on topics that matter to you,
                share your insights, and engage the community in meaningful
                dialogues.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <BsFillPeopleFill className="w-20 h-20 mb-4 md:w-24 md:h-24 transition-transform duration-300 hover:transform hover:scale-110" />
              <p>
                Gain exclusive access to our members-only forum. Enjoy community
                discussions, start new topics, and connect with other dedicated
                members.
              </p>
            </div>
          </div>
        </header>
        <section className="mt-48">
          <div className="text-center mt-10 px-4 sm:px-8 md:px-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              Choose Your Membership Plan
            </h1>
            <div className="mt-24 md:mt-32 flex flex-wrap md:flex-row gap-10 justify-center">
              <MembershipPlans />
            </div>
          </div>
        </section>
        <section className="mt-48">
          {/* Section 1 - Badges */}
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 flex flex-col lg:flex-row justify-between items-center lg:items-start">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 lg:max-w-lg text-justify">
              <h1 className="font-bold text-2xl lg:text-3xl mb-4">
                Earn Your Exclusive Badges
              </h1>
              <p className="text-white text-opacity-80 leading-relaxed">
                You can earn unique, anime-inspired badges that show support to
                our web. Display these badges proudly on your profile to
                highlight your journey. Collect them all and let your
                achievements shine!
              </p>
            </div>
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex justify-end mt-8 lg:mt-0">
              <div className="w-[21.875rem] h-[9.063rem] bg-black rounded-3xl border border-gray-300 p-4 flex items-center">
                {/* Badge Icon */}
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img
                    src="/images/shikiya.jpg"
                    alt="Badge Icon"
                    className="w-full h-full object-cover blur-sm"
                  />
                </div>
                {/* Badge Content */}
                <div className="flex-1">
                  <p className="text-yellow-400 font-bold text-sm mb-2">
                    <FaCrown className="w-4 h-4 inline mb-1 mr-1" /> Yearly
                    Champion
                  </p>
                  <div className="w-full h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Discussions */}
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 lg:max-w-lg text-justify">
              <div className="max-w-xs bg-black rounded-3xl border border-gray-300 p-4">
                <div className="w-full mb-4 flex gap-5">
                  <label
                    htmlFor="title"
                    className="text-white text-sm block font-bold my-auto"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    disabled
                    placeholder="Enter a discussion title..."
                    className="w-full h-10 px-4 text-sm rounded bg-transparent border-green-600 border-3 text-white focus:outline-none"
                  />
                  <FaMousePointer className="absolute w-8 h-8 ml-52 mt-6 text-white" />
                </div>
                <div className="w-full flex gap-2 border-1 rounded-t border-gray-400">
                  <button className="w-8 h-8 flex justify-center items-center text-white">
                    <FaBold />
                  </button>
                  <button className="w-8 h-8 flex justify-center items-center text-white">
                    <FaItalic />
                  </button>
                  <button className="w-8 h-8 flex justify-center items-center text-white">
                    <FaImages />
                  </button>
                </div>
                <textarea
                  disabled
                  className="resize-none w-full h-20 px-4 py-2 rounded-b border border-gray-400 bg-transparent text-white text-sm focus:outline-none"
                  placeholder="Type something here..."
                ></textarea>
              </div>
            </div>
            {/* Right Content */}
            <div className="w-full lg:w-1/2 text-justify mb-4 my-auto">
              <h1 className="font-bold text-2xl lg:text-3xl mb-4">
                Start Your Own Discussions
              </h1>
              <p className="text-white text-opacity-80 leading-relaxed">
                Gain the exclusive ability to create new topic discussions in
                our forums. Lead conversations on topics that matter to you,
                share your insights, and engage the community in meaningful
                dialogues.
              </p>
            </div>
          </div>

          {/* Section 3 - Member Discussions */}
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 flex flex-col lg:flex-row justify-between items-center lg:items-start">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 lg:max-w-lg text-justify">
              <h1 className="font-bold text-2xl lg:text-3xl mb-4">
                Join Members-Only Discussions
              </h1>
              <p className="text-white text-opacity-80 leading-relaxed">
                Unlock access to our members-only forum where you can join
                private discussions, start new topics, and connect with fellow
                premium members. Dive into a world of exclusive content and
                engage in meaningful conversations with a community of dedicated
                users.
              </p>
            </div>
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-5 mt-8 lg:mt-0 lg:ml-auto">
              {/* Comment 1 */}
              <div className="w-[19rem] lg:w-[23.75rem] bg-black rounded-3xl border border-gray-300 p-4 flex items-start self-end">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="/images/avatar.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">@Nadia</p>
                  <p className="text-white text-opacity-80 text-sm mt-1">
                    Wow...That’s cool!!!
                  </p>
                  <p className="text-white text-opacity-60 text-xs mt-2">
                    1.3k 👍
                  </p>
                </div>
              </div>
              {/* Comment 2 */}
              <div className="w-[19rem] lg:w-[23.75rem] bg-black rounded-3xl border border-gray-300 p-4 flex items-start self-end">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="/images/avatar.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">@Yuni</p>
                  <p className="text-white text-opacity-80 text-sm mt-1">
                    IT IS!!!!!!
                  </p>
                  <p className="text-white text-opacity-60 text-xs mt-2">
                    1.1k 👍
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="mt-24">
          <div className="mx-auto px-4 sm:px-6 lg:px-12 py-8 justify start">
            <hr className="border-gray-400" />
            <p className="text-white text-opacity-80 text-sm mt-5 ml-4">
              © Nimelist{" "}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
