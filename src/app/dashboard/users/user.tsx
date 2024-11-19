"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input, message, Select } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import type { TableColumnsType, TableProps } from "antd";
import {
  AiOutlineReload,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { AppstoreFilled, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import { SorterResult } from "antd/es/table/interface";
import { Option } from "antd/es/mentions";
import apiUrl from "@/hooks/api";

interface DataType {
  username: string;
  status_premium: boolean;
  email: string;
  badge: string;
  start_premium: string;
  end_premium: string;
}

const UserList = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterStatus, setStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const handleRefreshUsers = async () => {
    try {
      const res = await apiUrl.put(`/user/refresh-users`);
      message.success("Users refreshed successfully!");
      fetchUsers();
    } catch (error) {
      message.error("Failed to refresh users");
    }
  };

  const fetchUsers = async () => {
    const baseUrl = `/user/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`;
    const withFilterStatus =
      filterStatus !== "all" ? `${baseUrl}&status=${filterStatus}` : baseUrl;
    setLoading(true);
    try {
      const response = await apiUrl.get(withFilterStatus);
      const { data, total } = await response.data;
      setData(data); // Mengisi data dengan hasil dari API
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
      });
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    fetchUsers(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, [JSON.stringify(pagination), filterStatus, debounceText]);

  // Kolom table
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "username",
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
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-emerald-700 text-white items-center w-fit rounded-md px-4 py-2 flex hover:bg-emerald-800"
            >
              <EyeOutlined style={{ fontSize: 18 }} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineUser style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">User Information</h2>
            <span>Displays user short information and user details</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard">
            <div className="hover:text-emerald-700">
              <AppstoreFilled style={{ fontSize: 18 }} />
            </div>
          </Link>
          <span> / </span>
          <Link href="/dashboard/users">
            <h2 className="text-lg hover:text-emerald-700 mt-2">Users</h2>
          </Link>
        </div>
      </div>
      <div className="flex justify-between mb-3">
        <div>
          <button
            type="button"
            onClick={handleRefreshUsers}
            className="bg-emerald-700 text-white rounded-md hover:bg-emerald-800"
          >
            <div className="flex p-2 gap-2 items-center">
              <AiOutlineReload size={20} />
              <span>Refresh Users</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Search User"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            <Select
              defaultValue={filterStatus}
              style={{ width: 120 }}
              onChange={(value) => setStatus(value)}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        pagination={pagination} // Jumlah data yang ditampilkan
        // onChange={handleTableChange}
        data={data} // Data dari state
      />
    </>
  );
};

export default UserList;
