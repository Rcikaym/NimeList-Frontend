"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Space } from "antd";
import type { TableColumnsType } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import axios from "axios";
import { AppstoreFilled, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import PageTitle from "@/components/TitlePage";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";

interface DataType {
  username: string;
  status_premium: boolean;
  email: string;
  badge: string;
  start_premium: string;
  end_premium: string;
}

const UserList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${api}/user/get-all`
        );
        setData(await response.json()); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchUsers(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Kolom table
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "username",
        sorter: (a: DataType, b: DataType) =>
          a.username.localeCompare(b.username),
        sortDirections: ["ascend", "descend"],
        ...getColumnSearchProps("username"),
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Premium Status",
        dataIndex: "status_premium",
        render: (status_premium: string) =>
          status_premium === "active" ? (
            <>
              <div className="flex rounded-md bg-emerald-700 px-3 py-1 justify-center w-fit">
                <span className="text-white">Active</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex rounded-md bg-red-600 px-3 py-1 justify-center w-fit">
                <span className="text-white">Inactive</span>
              </div>
            </>
          ),
      },
      {
        title: "Badge",
        dataIndex: "badge",
        render: (badge: string) =>
          badge
            .split(" ") // Memisahkan string berdasarkan spasi menjadi array
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Mengubah huruf pertama setiap kata menjadi huruf besar
            .join(" "), // Menggabungkan kembali array menjadi string
      },
      {
        title: "Start Premium",
        dataIndex: "start_premium",
        render: (start_premium: string | null) =>
          start_premium ? renderDateTime(start_premium) : "0000-00-00 00:00:00",
      },
      {
        title: "End Premium",
        dataIndex: "end_premium",
        render: (end_premium: string | null) =>
          end_premium ? renderDateTime(end_premium) : "0000-00-00 00:00:00",
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text: string, record: DataType) => (
          <Space size="middle">
            <Button type="text" className="bg-emerald-700 text-white">
              <EyeOutlined style={{ fontSize: 20 }} />
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <>
      <PageTitle title="NimeList - UserList" />
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineUser style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              User Information
            </h2>
            <span className="text-black text-sm">
              Displays user short information and user details
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
          <Link href="/dashboard/users">
            <h2 className="text-black text-lg font-regular hover:text-emerald-700 mt-2">
              Users
            </h2>
          </Link>
        </div>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        pagination={{ pageSize: 10 }} // Jumlah data yang ditampilkan
        data={data} // Data dari state
      />
    </>
  );
};

export default UserList;
