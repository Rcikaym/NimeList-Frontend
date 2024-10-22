"use client";

import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiFillStar,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  EyeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomTable, getColumnSearchProps } from "@/components/customTable";
import renderDateTime from "@/components/formatDateTime";
import useDebounce from "@/hooks/useDebounce";
import { SorterResult } from "antd/es/table/interface";

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
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortOrder, setOrder] = useState<string>("ASC");
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);

  // Fetch data dari API ketika komponen dimuat
  const fetchAnime = async () => {
    try {
      const response = await fetch(
        `http://localhost:4321/anime/get-admin?page=${
          pagination.current
        }&limit=${
          pagination.pageSize
        }&search=${debounceText}&order=${encodeURIComponent(sortOrder)}`
      );
      const { data, total } = await response.json();
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
  }, [JSON.stringify(pagination), sortOrder, debounceText]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination: TablePaginationConfig,
    filters,
    sorter
  ) => {
    const sortParsed = sorter as SorterResult<DataType>;
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    setOrder(sortParsed.order === "descend" ? "DESC" : "ASC");
    console.log(sortOrder);
  };

  // Fungsi untuk melakukan delete data genre
  const handleDeleteAnime = async (id: string) => {
    try {
      await fetch(`http://localhost:4321/anime/delete/${id}`, {
        method: "DELETE",
      }); // Melakukan DELETE ke server
      message.success("Anime deleted successfully!");

      // Fetch ulang data setelah post
      fetchAnime();
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
      sorter: true,
      sortDirections: ["descend"],
      ...getColumnSearchProps("anime_title", setSearchText),
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
        <div className="flex gap-3">
          <a href={`anime/${record.anime_id}`}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
              <EyeOutlined style={{ fontSize: 20 }} />
            </div>
          </a>
          <a href={`anime/edit/${record.anime_id}`}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
              <AiOutlineEdit style={{ fontSize: 20 }} />
            </div>
          </a>
          <a
            onClick={() =>
              showDeleteConfirm(record.anime_id, record.anime_title)
            }
          >
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
              <AiOutlineDelete style={{ fontSize: 20 }} />
            </div>
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <VideoCameraOutlined style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Anime Information
            </h2>
            <span className="text-black text-sm">
              Displays anime short information and anime details
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
          <a href="/dashboard/anime/add">
            <div className="flex items-center gap-1 bg-emerald-700 p-2 text-white rounded-md hover:bg-emerald-800">
              <AiOutlinePlus />
              <span>Add Anime</span>
            </div>
          </a>
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
