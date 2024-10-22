"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  AiOutlineCrown,
  AiOutlineDollar,
  AiOutlinePicRight,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDashboardData() {
  try {
    const [
      topicsResponse,
      membersResponse,
      transactionResponse,
      incomeResponse,
    ] = await Promise.all([
      fetch(`${api}/dashboard/total-topic`, { method: "GET" }),
      fetch(`${api}/dashboard/total-premium`, { method: "GET" }),
      fetch(`${api}/dashboard/total-transaction`, { method: "GET" }),
      fetch(`${api}/dashboard/total-income`, { method: "GET" }),
    ]).then((responses) => Promise.all(responses.map((r) => r.json())));

    return {
      totalTopics: topicsResponse.totalTopic,
      totalMembers: membersResponse.totalUserPremium,
      totalTransaction: transactionResponse.total,
      totalIncome: incomeResponse.total,
      loading: false,
    };
  } catch (error) {
    return {
      totalTopics: null,
      totalMembers: null,
      totalTransaction: null,
      totalIncome: null,
      loading: true,
    };
  }
}

const CardDashboard = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    async function CardDashboard() {
      setData(await fetchDashboardData());
    }

    CardDashboard();
  }, []);
  const sizeIcon = 37;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Card total members */}
        <div className="bg-emerald-700 rounded-lg px-6 py-4 shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white rounded-lg mr-4 p-3 shadow-emerald-800 shadow-md transition-all duration-300 ease-in-out transform hover:scale-90">
              <div className="text-emerald-700">
                <AiOutlineCrown style={{ fontSize: sizeIcon }} />
              </div>
            </div>
            <div>
              <div className="mt-4 text-white">
                <h3 className="text-lg mb-1">Members</h3>
                {data.loading ? (
                  <LoadingOutlined />
                ) : (
                  <p className="text-lg font-bold ">{data.totalMembers}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card total topics */}
        <div className="bg-emerald-700 px-6 py-4 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white rounded-lg mr-4 p-3 shadow-md shadow-emerald-800 transition-all duration-300 ease-in-out transform hover:scale-90">
              <div className="text-emerald-700">
                <AiOutlinePicRight style={{ fontSize: sizeIcon }} />
              </div>
            </div>
            <div>
              <div className="mt-4 text-white">
                <h3 className="text-lg mb-1">Topics</h3>
                {data.loading ? (
                  <LoadingOutlined />
                ) : (
                  <p className="text-lg font-bold">{data.totalTopics}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card total transaction */}
        <div className="bg-emerald-700 px-6 py-4 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white rounded-lg mr-4 p-3 shadow-md shadow-emerald-800 transition-all duration-300 ease-in-out transform hover:scale-90">
              <div className="text-emerald-700">
                <AiOutlineShoppingCart style={{ fontSize: sizeIcon }} />
              </div>
            </div>
            <div>
              <div className="mt-4 text-white">
                <h3 className="text-lg mb-1">Transactions</h3>
                {data.loading ? (
                  <LoadingOutlined />
                ) : (
                  <p className="text-lg font-bold">{data.totalTransaction}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card total earning */}
        <div className="bg-emerald-700 px-6 py-4 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white rounded-lg mr-4 p-3 shadow-md shadow-emerald-800 transition-all duration-300 ease-in-out transform hover:scale-90">
              <div className="text-emerald-700">
                <AiOutlineDollar style={{ fontSize: sizeIcon }} />
              </div>
            </div>
            <div>
              <div className="mt-4 text-white">
                <h3 className="text-lg mb-1">Income</h3>
                {data.loading ? (
                  <LoadingOutlined />
                ) : (
                  <p className="text-lg font-bold">
                    {`Rp. ${new Intl.NumberFormat("id-ID").format(
                      data.totalIncome
                    )}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardDashboard;
