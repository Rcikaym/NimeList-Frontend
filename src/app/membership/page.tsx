export const dynamic = 'force-dynamic'

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
      <div className="relative min-h-screen bg-gradient-to-b from-[#009951] via-[#050505] via-45% to-[#050505] text-white overflow-hidden">
        {/* Ambient background glows - optimized using hardware-accelerated radial gradients instead of heavy CPU filters */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,153,81,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu" />
        <div className="absolute top-[35%] left-[-150px] w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.04)_0%,transparent_70%)] pointer-events-none transform-gpu" />
        <div className="absolute bottom-[25%] right-[-150px] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)] pointer-events-none transform-gpu" />

        <AuthNavbar />
        
        <header className="relative py-12 text-center mt-9 z-10">
          <div className="text-center mt-10 px-4 sm:px-8 md:px-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-green-400">
              NimeList Membership
            </h1>
            <div className="mt-8 md:mt-12">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white/95">
                Experience the Benefits of Community Membership
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg tracking-wide leading-relaxed mx-auto max-w-screen-md text-zinc-400">
                Join our vibrant community and enjoy exclusive benefits, connect
                with like-minded individuals, and stay updated with the latest
                community discussions. Sign up today and be a part of something
                great!
              </p>
            </div>
          </div>
          
          {/* Benefits Grid - optimized with transform-gpu and backdrop-blur-sm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
            <div className="group relative flex flex-col items-center text-center p-8 bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm transform-gpu rounded-2xl hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.05)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full scale-75 group-hover:scale-110 transition duration-300" />
                <RiMedalFill className="relative w-16 h-16 md:w-20 md:h-20 text-yellow-500 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Exclusive Badges</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Have the opportunity to earn exclusive badges that showcase your
                engagement and contributions.
              </p>
            </div>
            
            <div className="group relative flex flex-col items-center text-center p-8 bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm transform-gpu rounded-2xl hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(0,153,81,0.08)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#009951]/10 blur-xl rounded-full scale-75 group-hover:scale-110 transition duration-300" />
                <IoCreate className="relative w-16 h-16 md:w-20 md:h-20 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Forum Creation</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Gain the exclusive ability to create new topic discussions in
                our forums. Lead conversations on topics that matter to you,
                share insights, and engage the community in meaningful dialogues.
              </p>
            </div>
            
            <div className="group relative flex flex-col items-center text-center p-8 bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm transform-gpu rounded-2xl hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full scale-75 group-hover:scale-110 transition duration-300" />
                <BsFillPeopleFill className="relative w-16 h-16 md:w-20 md:h-20 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Private Community</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Gain exclusive access to our members-only forum. Enjoy community
                discussions, start new topics, and connect with other dedicated members.
              </p>
            </div>
          </div>
        </header>
        <section className="relative mt-48 z-10">
          <div className="text-center px-4 sm:px-8 md:px-12">
            <span className="text-[#009951] text-xs sm:text-sm uppercase tracking-widest font-black block mb-3">Subscription Plans</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Choose Your Membership Plan
            </h1>
            <div className="mt-16 md:mt-24 max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center">
                <MembershipPlans />
              </div>
            </div>
          </div>
        </section>

        <section className="relative mt-48 z-10 max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 space-y-36">
          {/* Section 1 - Badges */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 lg:max-w-lg text-center lg:text-left">
              <span className="text-yellow-500 text-xs sm:text-sm uppercase tracking-widest font-black block mb-3">Exclusive Rewards</span>
              <h1 className="font-extrabold text-3xl sm:text-4xl mb-4">
                Earn Your Exclusive Badges
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                You can earn unique, anime-inspired badges that show support for
                our platform. Display these badges proudly on your profile to
                highlight your journey. Collect them all and let your
                achievements shine!
              </p>
            </div>
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="w-full max-w-[22rem] bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 p-5 flex items-center shadow-2xl hover:border-yellow-500/20 hover:scale-[1.03] transition-all duration-300 transform-gpu">
                {/* Badge Icon */}
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-500/40 p-0.5 bg-zinc-900 flex-shrink-0">
                  <img
                    src="/images/shikiya.jpg"
                    alt="Badge Icon"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Badge Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-yellow-400 font-extrabold text-sm mb-1">
                    <FaCrown className="w-4 h-4 inline" /> Yearly Champion
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mb-1">Unlocked by @Shikiya</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2.5 py-0.5 rounded-full font-bold border border-yellow-500/20">Ultra Rare</span>
                    <span className="text-[10px] text-zinc-500 font-semibold">Tier 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Discussions */}
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              <div className="w-full max-w-[20rem] bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 p-5 shadow-2xl hover:border-green-500/20 hover:scale-[1.03] transition-all duration-300 transform-gpu">
                <div className="w-full mb-4 flex items-center gap-3">
                  <label
                    htmlFor="title"
                    className="text-white text-xs block font-bold"
                  >
                    Title
                  </label>
                  <div className="relative flex-grow">
                    <input
                      id="title"
                      type="text"
                      disabled
                      placeholder="Enter discussion title..."
                      className="w-full h-9 px-3 text-xs rounded bg-zinc-900/50 border border-green-600/40 text-white focus:outline-none"
                    />
                    <FaMousePointer className="absolute -bottom-3 right-4 w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-bounce pointer-events-none" />
                  </div>
                </div>
                <div className="w-full flex gap-1 border border-b-0 rounded-t border-zinc-800 bg-zinc-900/30 p-1">
                  <button className="w-7 h-7 flex justify-center items-center text-zinc-500 hover:text-white rounded transition text-xs">
                    <FaBold />
                  </button>
                  <button className="w-7 h-7 flex justify-center items-center text-zinc-500 hover:text-white rounded transition text-xs">
                    <FaItalic />
                  </button>
                  <button className="w-7 h-7 flex justify-center items-center text-zinc-500 hover:text-white rounded transition text-xs">
                    <FaImages />
                  </button>
                </div>
                <textarea
                  disabled
                  className="resize-none w-full h-20 px-3 py-2 rounded-b border border-zinc-800 bg-zinc-900/20 text-white text-xs focus:outline-none"
                  placeholder="Type something here..."
                ></textarea>
              </div>
            </div>
            {/* Right Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <span className="text-green-500 text-xs sm:text-sm uppercase tracking-widest font-black block mb-3">Topic Creator</span>
              <h1 className="font-extrabold text-3xl sm:text-4xl mb-4">
                Start Your Own Discussions
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                Gain the exclusive ability to create new topic discussions in
                our forums. Lead conversations on topics that matter to you,
                share your insights, and engage the community in meaningful
                dialogues.
              </p>
            </div>
          </div>

          {/* Section 3 - Member Discussions */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 lg:max-w-lg text-center lg:text-left">
              <span className="text-cyan-500 text-xs sm:text-sm uppercase tracking-widest font-black block mb-3">Private Forum</span>
              <h1 className="font-extrabold text-3xl sm:text-4xl mb-4">
                Join Members-Only Discussions
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                Unlock access to our members-only forum where you can join
                private discussions, start new topics, and connect with fellow
                premium members. Dive into a world of exclusive content and
                engage in meaningful conversations with a community of dedicated
                users.
              </p>
            </div>
            {/* Right Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4 max-w-[26rem] lg:ml-auto">
              {/* Comment 1 */}
              <div className="w-[88%] bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 flex items-start self-start shadow-lg hover:border-zinc-700/80 hover:scale-[1.02] transition-all duration-300 transform-gpu">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-zinc-800 flex-shrink-0 bg-zinc-900">
                  <img
                    src="/images/avatar.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold">@Nadia</p>
                  <p className="text-zinc-300 text-sm mt-1 leading-snug">
                    Wow...That’s cool!!!
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-2 font-bold flex items-center gap-1">
                    <span>1.3k</span> <span>👍</span>
                  </p>
                </div>
              </div>
              {/* Comment 2 (Threaded Reply) */}
              <div className="w-[88%] bg-zinc-950/90 border border-zinc-800 border-l-2 border-l-[#009951] rounded-2xl p-4 flex items-start self-end shadow-xl hover:border-green-500/20 hover:scale-[1.02] transition-all duration-300 transform-gpu">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-zinc-800 flex-shrink-0 bg-zinc-900">
                  <img
                    src="/images/avatar.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-green-400 text-xs font-bold flex items-center gap-1">
                    @Yunli <span className="bg-green-500/10 text-green-400 text-[9px] px-1.5 py-0.2 rounded font-bold border border-green-500/20">Yearly</span>
                  </p>
                  <p className="text-zinc-200 text-sm mt-1 leading-snug">
                    IT IS!!!!!!
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-2 font-bold flex items-center gap-1">
                    <span>1.1k</span> <span>👍</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-36 relative z-10">
          <div className="mx-auto px-6 sm:px-10 lg:px-16 py-8">
            <hr className="border-zinc-800" />
            <p className="text-zinc-500 text-xs mt-6 text-center sm:text-left">
              © {new Date().getFullYear()} Nimelist. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
