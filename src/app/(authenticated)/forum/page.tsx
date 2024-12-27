"use client";

import { checkAdminRole } from "@/utils/adminRole";
import { checkPremium } from "@/utils/premiumStatus";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TitlePage from "@/components/TitlePage";
import { Input } from "@nextui-org/react";
import { IoIosSearch, IoMdChatboxes } from "react-icons/io";
import TopicComponents from "./TopicComponents";

export default function ForumPage() {
  const router = useRouter();

  const handleCheckEnableAccess = async () => {
    try {
      const isPremium = await checkPremium();
      const isAdmin = checkAdminRole();

      if (!isPremium && !isAdmin) {
        router.push("/membership");
      }

      return;
    } catch (error) {
      router.push("/membership");
    }
  };

  useEffect(() => {
    handleCheckEnableAccess();
  }, []);

  return (
    TitlePage({ title: "NimeList - Forum" }),
    (
      <>
        <div className="min-h-screen">
          <header className="py-12 mt-9">
            <div className="px-4 sm:px-6 text-center lg:px-8">
              <h1 className="bg-gradient-to-r mb-3 from-[#009951] to-[#00FF75] bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl font-bold">
                Community Forum Hub
              </h1>
              <h2 className="text-sm sm:text-base md:text-lg font-medium">
                Join discussions and connect with our community.
              </h2>
              <div className="mt-7 flex justify-center px-2">
                <Input
                  className="w-full max-w-lg sm:max-w-md md:max-w-lg"
                  radius="full"
                  type="text"
                  placeholder="Find Discussion Here..."
                  endContent={<IoIosSearch className="text-black text-xl" />}
                />
              </div>
            </div>
            <div className="mt-32 text-justify px-4 sm:px-6 lg:px-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-500">
                Welcome to Our Community Forum Hub!
              </h3>
              <p className="text-sm sm:text-base md:text-lg mt-2 text-gray-300 leading-relaxed">
                We're thrilled to have you here. Our forum is a place where
                members can connect, share insights, and engage in meaningful
                discussions. Whether you're here to seek advice, share your
                expertise, or simply connect with like-minded individuals. To
                ensure a positive and respectful environment for everyone,
                please keep the following guidelines in mind:{" "}
                <a
                  href="/community-guidelines"
                  className="text-green-500 font-semibold underline hover:text-green-400"
                >
                  View Community Guidelines
                </a>
              </p>
            </div>
          </header>
          <section className="bg-black text-white py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
                  <IoMdChatboxes className="mr-2" /> Fresh Conversations
                </h1>
                {/* <button className="flex items-center bg-green-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition">
                  Sort By <span className="ml-2">➤</span>
                </button> */}
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Topics List */}
                <div className="lg:col-span-3 space-y-6">
                  <TopicComponents />
                </div>

                {/* Sidebar */}
                <div className="bg-black">
                  <button className="w-full bg-green-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition mb-6">
                    Create New Topic
                  </button>
                  <div className="p-4 border border-green-500 rounded-lg"> 
                    <h2 className="text-xl font-bold mb-4 text-center">
                      Top Trending Topics of the Month
                    </h2>
                    {/* <ul className="list-decimal list-inside space-y-1 text-sm">
                    {Array(20)
                      .fill("We supply a series of design principles...")
                      .map((item, index) => (
                        <li
                          key={index}
                          className="truncate hover:underline cursor-pointer"
                        >
                          {item}
                        </li>
                      ))}
                  </ul> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  );
}
