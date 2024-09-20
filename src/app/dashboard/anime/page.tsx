"use client";

import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import type { TableColumnsType } from "antd";
import {
  AiFillStar,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
} from "react-icons/ai";
import axios from "axios";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  EyeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import PageTitle from "@/components/TitlePage";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";

interface DataType {
  anime_id: string;
  anime_title: string;
  avg_rating: number;
  anime_created_at: string;
  anime_updated_at: string;
}

const AnimeList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const { confirm } = Modal;

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get<DataType[]>(
          "http://localhost:4321/anime/get"
        );
        setData(response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchAnime(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Fungsi untuk melakukan delete data genre
  const handleDeleteAnime = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4321/anime/delete/${id}`); // Melakukan DELETE ke server
      message.success("Anime deleted successfully!");

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(
        "http://localhost:4321/anime/get"
      );
      setData(response.data); // Memperbarui data genre
    } catch (error) {
      message.error("Failed to delete anime");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string, title: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete " + title + " anime?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleDeleteAnime(id)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
    });
  };

  // Kolom table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "anime_title",
      // ...getColumnSearchProps("anime_title"),
      sorter: (a: DataType, b: DataType) =>
        a.anime_title.localeCompare(b.anime_title),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("anime_title"),
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
      dataIndex: "anime_created_at",
      render: (text: string) => renderDateTime(text),
    },
    {
      title: "Updated At",
      dataIndex: "anime_updated_at",
      render: (text: string) => renderDateTime(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: DataType) => (
        <Space size="middle">
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            href={`anime/${record.anime_id}`}
          >
            <EyeOutlined style={{ fontSize: 20 }} />
          </Button>
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            href={`anime/edit/${record.anime_id}`}
          >
            <AiOutlineEdit style={{ fontSize: 20 }} />
          </Button>
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            onClick={() =>
              showDeleteConfirm(record.anime_id, record.anime_title)
            }
          >
            <AiOutlineDelete style={{ fontSize: 20 }} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageTitle title="NimeList - AnimeList" />
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300">
            <VideoCameraOutlined style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Anime Information
            </h2>
            <h2 className="text-black text-sm">
              Displays anime short information and anime details
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
          <h2 className="text-black text-lg mt-2"> Manage Anime </h2>
          <span className="text-black"> / </span>
          <Link href="/dashboard/anime">
            <h2 className="text-black text-lg font-regular hover:text-emerald-700 mt-2">
              Anime
            </h2>
          </Link>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="mb-3">
          <Button
            type="text"
            href="/dashboard/anime/add"
            className="bg-emerald-700 text-white"
          >
            <AiOutlinePlus /> Add Anime
          </Button>
        </div>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        data={data} // Data yang sudah difilter
        
      />
    </>
  );
};

export default AnimeList;
