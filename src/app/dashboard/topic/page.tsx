"use client";

import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePicRight,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import PageTitle from "@/components/titlePage";
import renderDateTime from "@/components/formatDateTime";
import { CustomTable, getColumnSearchProps } from "@/components/customTable";
import useDebounce from "@/hooks/useDebounce";

interface DataType {
  id: string;
  title: string;
  user: string;
  anime: string;
  created_at: string;
  updated_at: string;
}

const TopicList: React.FC = () => {
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
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchTopic = async () => {
    try {
      const response = await fetch(`${api}/topic/get-all`);
      setData(await response.json()); // Mengisi data dengan hasil dari API
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchTopic(); // Panggil fungsi fetchTopic saat komponen dimuat
  }, [JSON.stringify(pagination), sortOrder, debounceText]);

  // Fungsi untuk melakukan delete data topic
  const handleDeleteTopic = async (id: string) => {
    try {
      await fetch(`${api}/topic/delete/${id}`, { method: "DELETE" }); // Melakukan DELETE ke server
      message.success("Anime deleted successfully!");

      // Fetch ulang data setelah post
      const response = await fetch(`${api}/topic/get-all`);
      setData(await response.json()); // Memperbarui data topic
    } catch (error) {
      message.error("Failed to delete topic");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string, title: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete " + title + " topic?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleDeleteTopic(id)
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
      dataIndex: "title",
      sorter: (a: DataType, b: DataType) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("title"),
    },
    {
      title: "Created By",
      dataIndex: "user",
    },
    {
      title: "Tag Anime",
      dataIndex: "anime",
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
        <Space size="middle">
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            href={`topic/${record.id}`}
          >
            <EyeOutlined style={{ fontSize: 20 }} />
          </Button>
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            href={`topic/edit/${record.id}`}
          >
            <AiOutlineEdit style={{ fontSize: 20 }} />
          </Button>
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            onClick={() => showDeleteConfirm(record.id, record.title)}
          >
            <AiOutlineDelete style={{ fontSize: 20 }} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageTitle title="NimeList - TopicList" />
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlinePicRight style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Topic Information
            </h2>
            <span className="text-black text-sm">
              Displays topic short information and topic details
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
          <h2 className="text-black text-lg mt-2"> Manage Topic </h2>
          <span className="text-black"> / </span>
          <Link href="/dashboard/topic">
            <h2 className="text-black text-lg font-regular hover:text-emerald-700 mt-2">
              Topic
            </h2>
          </Link>
        </div>
      </div>
      <div className="mb-3">
        <Button
          type="text"
          href="/dashboard/topic/add"
          className="bg-emerald-700 text-white"
        >
          <AiOutlinePlus /> Add Topic
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={data} // Data dari state
      />
    </>
  );
};

export default TopicList;
