"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, message, Modal, Space } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePicRight,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import renderDateTime from "@/utils/FormatDateTime";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";

interface DataType {
  id: string;
  title: string;
  user: string;
  anime: string;
  slug: string;
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
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1500);
  // const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchTopic = async () => {
    try {
      const response = await apiUrl.get(
        `/topic/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`
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
      console.error("Error fetching users:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchTopic(); // Panggil fungsi fetchTopic saat komponen dimuat
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

  // Fungsi untuk melakukan delete data topic
  const handleDeleteTopic = async (id: string) => {
    try {
      const res = await apiUrl.delete(`/topic/delete/${id}`);
      message.success(res.data.message);

      // Fetch ulang data setelah data didelete
      fetchTopic();
    } catch (error: any) {
      message.error("Failed to delete topic", error);
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this topic?",
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

  // Fungsi untuk potong title jika panjangnya melebihi batas
  function truncateText(text: string, maxLength = 20) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  // Kolom table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: string) => truncateText(text),
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
        <div className="flex gap-3">
          <a href={`topic/${record.slug}`}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
              <EyeOutlined style={{ fontSize: 20 }} />
            </div>
          </a>
          <a href={`topic/edit/${record.slug}`}>
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
              <AiOutlineEdit style={{ fontSize: 20 }} />
            </div>
          </a>
          <a onClick={() => showDeleteConfirm(record.id)}>
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
            <AiOutlinePicRight style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Topic Information</span>
            <span>Displays topic short information and topic details</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard" className="hover:text-emerald-700">
            <AppstoreFilled style={{ fontSize: 18 }} />
          </Link>
          <span> / </span>
          <span className=" text-lg"> Manage Topic </span>
          <span> / </span>
          <Link href="/dashboard/topic" className="hover:text-emerald-700">
            <span className="text-lg">Topic</span>
          </Link>
        </div>
      </div>
      <div className="mb-3 flex items-center justify-end">
        <div>
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Only title, anime and user"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <CustomTable
        columns={columns}
        onChange={handleTableChange}
        data={data} // Data dari state
        pagination={pagination}
      />
    </>
  );
};

export default TopicList;
