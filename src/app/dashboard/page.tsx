"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AiFillStar,
  AiOutlineBarChart,
  AiOutlineCrown,
  AiOutlineDollar,
  AiOutlinePicRight,
  AiOutlineShoppingCart,
  AiOutlineTrophy,
} from "react-icons/ai";
import { Table } from "antd";
import { BiBarChart } from "react-icons/bi";
import { AppstoreFilled, LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import PageTitle from "@/components/TitlePage";

export default function Dashboard() {
  const [totalTopics, setTotalTopics] = useState<number | null>(null);
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [animeTop, setAnimeTop] = useState([]);
  const [loading, setLoading] = useState<boolean>();

  const columnsAnimeTop = useMemo(
    () => [
      {
        title: "No.",
        dataIndex: "no",
        render: (text: string, record: any, index: number) => {
          return (
            <>
              <span>{index + 1}.</span>
            </>
          );
        },
      },
      {
        title: "Title",
        dataIndex: "title",
      },
      {
        title: "Total Review",
        dataIndex: "totalReview",
        render: (totalReview: number) => {
          return (
            <>
              <span>{totalReview} Reviews</span>
            </>
          );
        },
      },
      {
        title: "Rating",
        dataIndex: "rating",
        render: (rating: number) => {
          return (
            <>
              <span className="gap-1 flex items-center">
                {rating}
                <AiFillStar style={{ color: "#fadb14" }} />
              </span>
            </>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topicsResponse, membersResponse, animeTopResponse] =
          await Promise.all([
            axios.get("http://localhost:4321/dashboard/total-topic"),
            axios.get("http://localhost:4321/dashboard/total-premium"),
            axios.get("http://localhost:4321/dashboard/anime-top"),
          ]);
        setTotalTopics(topicsResponse.data.totalTopic);
        setTotalMembers(membersResponse.data.totalUserPremium);
        setAnimeTop(animeTopResponse.data);
        setLoading(false);
      } catch (error) {
        setTotalTopics(null);
        setTotalMembers(null);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageTitle title="NimeList - Dashboard" />
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300">
            <AppstoreFilled style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">Dashboard</h2>
            <h2 className="text-black text-sm">
              Short information about existing data{" "}
            </h2>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard">
            <div className="text-black hover:text-emerald-700">
              <AppstoreFilled style={{ fontSize: 18 }} />
            </div>
          </Link>
          <span className="text-black"> / </span>
          <Link href="/dashboard">
            <h2 className="text-black text-lg font-regular hover:text-emerald-700 mt-2">
              Dashboard
            </h2>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Card total members */}
          <div className="bg-emerald-700 rounded-lg px-6 py-5 shadow-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-lg mr-4 p-3 shadow-emerald-800 shadow-md transition-all duration-300 ease-in-out transform hover:scale-90">
                <div className="text-emerald-700">
                  <AiOutlineCrown style={{ fontSize: 40 }} />
                </div>
              </div>
              <div>
                <div className="mt-4">
                  <h3 className="text-lg text-white mb-1">Total Members</h3>
                  {loading ? (
                    <LoadingOutlined />
                  ) : (
                    <p className="text-lg text-white font-bold ">
                      {totalMembers !== null ? totalMembers : "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card total topics */}
          <div className="bg-emerald-700 px-6 py-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-lg mr-4 p-3 shadow-md shadow-emerald-800 transition-all duration-300 ease-in-out transform hover:scale-90">
                <div className="text-emerald-700">
                  <AiOutlinePicRight style={{ fontSize: 40 }} />
                </div>
              </div>
              <div>
                <div className="mt-4">
                  <h3 className="text-lg text-white mb-1">Total Topics</h3>
                  {loading ? (
                    <LoadingOutlined />
                  ) : (
                    <p className="text-lg text-white font-bold">
                      {totalTopics !== null ? totalTopics : "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card total transaction */}
          <div className="bg-emerald-700 px-6 py-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-lg mr-4 p-3 shadow-md shadow-emerald-800 transition-all duration-300 ease-in-out transform hover:scale-90">
                <div className="text-emerald-700">
                  <AiOutlineShoppingCart style={{ fontSize: 40 }} />
                </div>
              </div>
              <div>
                <div className="mt-4">
                  <h3 className="text-lg text-white mb-1">
                    Total Transactions
                  </h3>
                  <p className="text-lg text-white font-bold">6.969</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card total earning */}
          <div className="bg-emerald-700 px-6 py-5 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-lg mr-4 p-3 shadow-md shadow-emerald-800 transition-all duration-300 ease-in-out transform hover:scale-90">
                <div className="text-emerald-700">
                  <AiOutlineDollar style={{ fontSize: 40 }} />
                </div>
              </div>
              <div>
                <div className="mt-4">
                  <h3 className="text-lg text-white mb-1">Total Income</h3>
                  <p className="text-lg text-white font-bold">Rp. 6.969.696</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-md shadow-md mb-6">
          <div className="mb-4 p-3 flex items-center gap-5">
            <div className="flex items-center rounded-md shadow-gray-400 shadow-sm w-fit p-3 text-emerald-700">
              <AiOutlineBarChart style={{ fontSize: 30 }} />
            </div>
            <div>
              <h3 className="text-black font-regular text-lg font-semibold">
                Income Report
              </h3>
              <span className="text-gray-600 font-regular">
                Here are this year's earnings data
              </span>
            </div>
          </div>
          <div className="p-3 h-[100px]">
            <BiBarChart />
          </div>
        </div>

        {/* List Top Anime */}
        <div className="shadow-md bg-white p-4 rounded-md">
          <Table
            dataSource={animeTop}
            columns={columnsAnimeTop}
            pagination={{ position: ["none"] }}
            loading={loading}
            title={() => (
              <h3 className="text-black font-regular font-semibold text-lg flex items-center gap-2">
                Top 10 Anime of All Time{" "}
                <div className="shadow-sm shadow-gray-400 rounded-md p-1">
                  <AiOutlineTrophy
                    style={{ fontSize: 20 }}
                    className="text-emerald-700"
                  />
                </div>
              </h3>
            )}
          />
        </div>
      </div>
    </>
  );
}
