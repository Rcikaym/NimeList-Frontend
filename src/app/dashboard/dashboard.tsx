// import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { AppstoreFilled } from "@ant-design/icons";
import Link from "next/link";
import BarChart from "@/app/dashboard/barChartDashboard";
import CardDashboard from "@/app/dashboard/cardDashboard";
import PageTitle from "@/components/TitlePage";
import TableTop10Anime from "@/app/dashboard/top10AnimeTable";

const Dashboard = () => {
  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AppstoreFilled style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">Dashboard</h2>
            <span className="text-black text-sm">
              Short information about existing data{" "}
            </span>
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
        <CardDashboard />

        {/* Chart Section */}
        <div className="bg-white rounded-md shadow-md mb-6">
          <div className="mb-3 p-3 flex items-center gap-5">
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
          <div className="p-3">
            <BarChart />
          </div>
        </div>

        {/* List Top Anime */}
        <div className="shadow-md bg-white p-4 rounded-md">
          <TableTop10Anime />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
