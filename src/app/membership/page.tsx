import AuthNavbar from "@/components/AuthNavbar";
import DisplayLongText from "@/components/DisplayLongText";
import { RiMedalFill } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import PageTitle from "@/components/TitlePage";
import MembershipPlans from "./MembershipPlans";

export default function Membership() {
  return (
    <>
      <PageTitle title={`NimeList - Membership`} />
      <div className="min-h-screen bg-gradient-to-b from-[#009951] via-[#050505] via-70% to-[#050505]">
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
          <div className="w-full px-9 py-8 lg:py-12 lg:px-36 flex flex-col lg:flex-row justify-between items-center lg:items-start">
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
              <div className="w-80 h-32 bg-black rounded-3xl border border-gray-300 p-4 flex items-center">
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
                    👑 Yearly Champion
                  </p>
                  <div className="w-full h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
