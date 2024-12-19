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
      </div>
    </>
  );
}
