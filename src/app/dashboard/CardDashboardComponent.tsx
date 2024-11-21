"use client";

import apiUrl from "@/hooks/api";
import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useEffect, useState } from "react";
import {
  AiOutlineCrown,
  AiOutlineDollar,
  AiOutlinePicRight,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const api = process.env.NEXT_PUBLIC_API_URL;

interface CardDashboardProps {
  totalTopics: number;
  totalMembers: number;
  totalTransaction: number;
  totalIncome: number;
  loading: boolean;
}

export async function fetchDashboardData() {
  try {
    const [
      topicsResponse,
      membersResponse,
      transactionResponse,
      incomeResponse,
    ] = await Promise.all([
      apiUrl.get(`${api}/dashboard/total-topic`, { method: "GET" }),
      apiUrl.get(`${api}/dashboard/total-premium`, { method: "GET" }),
      apiUrl.get(`${api}/dashboard/total-transaction`, { method: "GET" }),
      apiUrl.get(`${api}/dashboard/total-income`, { method: "GET" }),
    ]).then((responses) => Promise.all(responses.map((res) => res.data)));

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
  const [data, setData] = useState({} as CardDashboardProps);
  const sizeIcon = 37;
  const [loading, setLoading] = useState(true);

  async function CardDashboard() {
    try {
      setLoading(true);
      setData(await fetchDashboardData());
      setLoading(data.loading);
    } catch (error) {
      message.error("Gagal mengambil data dashboard.");
      setLoading(true);
    }
  }

  if (data.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined />
      </div>
    );
  }

  // Panggil fungsi CardDashboard saat komponen di-mount
  useEffect(() => {
    CardDashboard();
  }, []);

  const cardData = [
    {
      title: "Total Members",
      value: data.totalMembers,
      icon: <AiOutlineCrown style={{ fontSize: sizeIcon }} />,
    },
    {
      title: "Total Topics",
      value: data.totalTopics,
      icon: <AiOutlinePicRight style={{ fontSize: sizeIcon }} />,
    },
    {
      title: "Total Transactions",
      value: data.totalTransaction,
      icon: <AiOutlineShoppingCart style={{ fontSize: sizeIcon }} />,
    },
    {
      title: "Total Income",
      value: `Rp${new Intl.NumberFormat("id-ID").format(
        data.totalIncome || 0
      )}`,
      icon: <AiOutlineDollar style={{ fontSize: sizeIcon }} />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-emerald-700 rounded-lg shadow-md p-4 h-[8rem]"
          >
            <div className="flex items-center h-full gap-4">
              <div className="bg-emerald-700 text-white rounded-lg h-fit p-4 shadow-md shadow-gray-300 transition-all duration-500 ease-in-out transform hover:scale-90">
                <div>{card.icon}</div>
              </div>
              <div className="flex flex-col text-emerald-700">
                <span className="text-lg">{card.title}</span>
                {loading ? (
                  <span>
                    <LoadingOutlined />
                  </span>
                ) : (
                  <span className="text-lg font-bold">{card.value}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CardDashboard;
