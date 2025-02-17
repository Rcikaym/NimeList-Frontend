"use client";

import React, { useEffect, useState } from "react";
import { Input, message, Modal } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiFillStar,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  EyeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomTable } from "@/components/CustomTable";
import renderDateTime from "@/utils/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";

interface DataType {
  id: string;
  title: string;
  slug: string;
  avg_rating: number;
  created_at: string;
  updated_at: string;
}

const AnimeList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const { confirm } = Modal;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1500);

  // Fetch data dari API ketika komponen dimuat
  const fetchAnime = async () => {
    setLoading(true);
    try {
      const response = await apiUrl.get(
        `http://localhost:4321/anime/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`
      );
      const { data, total } = await response.data;
      setData(data); // Mengisi data dengan hasil dari API
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
      });
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching anime:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchAnime(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, [JSON.stringify(pagination), debounceText]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination: TablePaginationConfig
  ) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  // Fungsi untuk melakukan delete data genre
  const handleDeleteAnime = async (id: string) => {
    setLoading(true);
    try {
      await apiUrl.delete(`/anime/delete/${id}`); // Melakukan DELETE ke server
      message.success("Anime deleted successfully!");

      setLoading(false);

      // Fetch ulang data setelah post
      fetchAnime();
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete anime");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this anime?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      onOk() {
        handleDeleteAnime(id);
      },
    });
  };

  // Kolom table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: string) => {
        return (
          <>
            <div className="w-40 truncate">
              <span>{text}</span>
            </div>
          </>
        );
      },
    },
    {
      title: "Rating",
      dataIndex: "avg_rating",
      render: (avg_rating: number) => {
        return (
          <>
            <span className="gap-1 flex items-center">
              {avg_rating}
              <AiFillStar style={{ color: "#fadb14" }} />
            </span>
          </>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text: string) => renderDateTime(text),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (text: string) => renderDateTime(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: DataType) => (
        <div className="flex gap-3">
          <Link href={`anime/${record.slug}`}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800 w-fit h-fit">
              <EyeOutlined style={{ fontSize: 20 }} />
            </div>
          </Link>
          <Link href={`anime/edit/${record.slug}`}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800 w-fit h-fit">
              <AiOutlineEdit style={{ fontSize: 20 }} />
            </div>
          </Link>
          <a onClick={() => showDeleteConfirm(record.id)}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800 w-fit h-fit">
              <AiOutlineDelete style={{ fontSize: 20 }} />
            </div>
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center mt-3 mb-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <VideoCameraOutlined style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">Anime Information</h2>
            <span>Displays anime short information and anime details</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard" className="hover:text-emerald-700">
            <AppstoreFilled style={{ fontSize: 18 }} />
          </Link>
          <span> / </span>
          <span className="text-lg font-semibold"> Manage Anime </span>
          <span> / </span>
          <Link href="/dashboard/anime" className="hover:text-emerald-700">
            <span className="text-lg font-semibold">Anime</span>
          </Link>
        </div>
      </div>
      <div className="flex justify-between mb-3">
        <div className="mb-3">
          <a href="/dashboard/anime/add">
            <div className="flex items-center gap-1 bg-emerald-700 p-2 text-white rounded-md hover:bg-emerald-800">
              <AiOutlinePlus />
              <span>Add Anime</span>
            </div>
          </a>
        </div>
        <div>
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Search Anime"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        pagination={pagination} // Jumlah data yang ditampilkan
        data={data} // Data yang sudah difilter
        onChange={handleTableChange}
      />
    </>
  );
};

export default AnimeList;
