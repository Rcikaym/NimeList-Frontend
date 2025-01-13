"use client";

import React, { useEffect, useState } from "react";
import { Input, message, Modal } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiOutlineComment,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineSearch,
} from "react-icons/ai";
import { AppstoreFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { CustomTable } from "@/components/CustomTable";
import renderDateTime from "@/utils/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";
import dynamic from "next/dynamic";
import { CommentType, DataCommentType } from "./types";

const CommentModal = dynamic(() => import("./CommentModal"), { ssr: false });

const TopicCommentList: React.FC = () => {
  const [data, setData] = useState<DataCommentType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [detailComment, setDetailComment] = useState({} as CommentType);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { confirm } = Modal;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1500);

  // Set data detail comment
  const setDataDetail = async (id: string) => {
    setModalVisible(true);
    setLoading(true);
    try {
      const res = await apiUrl.get(`/comment/get/${id}`);
      setDetailComment(await res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchComment = async () => {
    try {
      const response = await apiUrl.get(
        `/comment/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`
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
    fetchComment();
  }, [JSON.stringify(pagination), debounceText]);

  const handleTableChange: TableProps<DataCommentType>["onChange"] = (
    pagination: TablePaginationConfig
  ) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  // Fungsi untuk melakukan delete data comment
  const handleDeleteComment = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiUrl.delete(`/comment/delete/${id}`); // Melakukan DELETE ke server
      message.success(res.data.message);

      // Fetch ulang data setelah di delete
      fetchComment();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete comment");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this comment?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleDeleteComment(id);
      },
    });
  };

  // Fungsi untuk potong title jika panjangnya melebihi batas
  function truncateText(text: string, maxLength = 20) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  // Kolom table
  const columns: TableColumnsType<DataCommentType> = [
    {
      title: "Title Topic",
      dataIndex: "topic",
      render: (text: string) => truncateText(text),
    },
    {
      title: "Username",
      dataIndex: "user",
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
      render: (text: string, record: DataCommentType) => (
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800"
            onClick={() => {
              setDataDetail(record.id);
            }}
          >
            <AiOutlineEye style={{ fontSize: 20 }} />
          </button>
          <button
            type="button"
            className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800"
            onClick={() => showDeleteConfirm(record.id)}
          >
            <AiOutlineDelete style={{ fontSize: 20 }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineComment style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">
              Comment Topic Information
            </span>
            <span className="text-sm">Displays comment topic information</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard" className="hover:text-emerald-700">
            <AppstoreFilled style={{ fontSize: 18 }} />
          </Link>
          <span> / </span>
          <span className="text-lg"> Manage Topic </span>
          <span> / </span>
          <Link
            href="/dashboard/topic/comment"
            className="hover:text-emerald-700"
          >
            <span className="text-lg">Comment Topic</span>
          </Link>
        </div>
      </div>
      <div className="mb-3 flex justify-end">
        <div>
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Only title topic and username"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <CustomTable
        columns={columns}
        onChange={handleTableChange}
        pagination={pagination}
        data={data} // Data dari state
      />

      {/* Detail Modal Comment */}
      <CommentModal
        visible={modalVisible}
        detailComment={detailComment || null}
        onCancel={() => setModalVisible(false)}
        loading={loading}
      />
    </>
  );
};

export default TopicCommentList;
