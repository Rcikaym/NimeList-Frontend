"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiFillStar,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineSmile,
} from "react-icons/ai";
import { AppstoreFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { CustomTable } from "@/components/CustomTable";
import renderDateTime from "@/utils/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";
import dynamic from "next/dynamic";
import { DataDetailReview, DataTypeReview } from "./types";

const ReviewDetailModal = dynamic(() => import("./ReviewDetailModal"), {
  ssr: false,
});

const ReviewList: React.FC = () => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<DataTypeReview[]>([]); // Data diisi dengan api
  const [detailReview, setDetailReview] = useState({} as DataDetailReview); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { confirm } = Modal;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);

  // Fungsi untuk melakukan delete data review
  const handleDeleteReview = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiUrl.delete(`/review/delete/${id}`); // Melakukan DELETE ke server
      message.success(res.data.message);

      // Fetch ulang data setelah di delete
      fetchReview();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete review");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this review?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleDeleteReview(id);
      },
    });
  };

  const setDataDetail = async (id: string) => {
    const data = await fetch(`${api}/review/get/${id}`, { method: "GET" });
    setDetailReview(await data.json());
    setModalVisible(true);
  };

  const fetchReview = async () => {
    setLoading(true);
    try {
      const response = await apiUrl.get(
        `/review/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`
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
      console.error("Error fetching review:", error);
      setLoading(true); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  const handleTableChange: TableProps<DataTypeReview>["onChange"] = (
    pagination: TablePaginationConfig
  ) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  useEffect(() => {
    fetchReview();
  }, [JSON.stringify(pagination.current), debounceText]);

  // Fungsi untuk potong title jika panjangnya melebihi batas
  function truncateText(text: string, maxLength = 20) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  // Kolom table
  const columns: TableColumnsType<DataTypeReview> = useMemo(
    () => [
      {
        title: "Created By",
        dataIndex: "username",
      },
      {
        title: "Title Anime",
        dataIndex: "title_anime",
        render: (text: string) => truncateText(text),
      },
      {
        title: "Rating",
        dataIndex: "rating",
        render: (rating: number) => {
          return (
            <>
              <span className="gap-1 flex items-center">
                {rating}
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
        render: (text: string, record: DataTypeReview) => (
          <div className="flex gap-3">
            <button type="button" onClick={() => setDataDetail(record.id)}>
              <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
                <AiOutlineEye style={{ fontSize: 20 }} />
              </div>
            </button>
            <button type="button" onClick={() => showDeleteConfirm(record.id)}>
              <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
                <AiOutlineDelete style={{ fontSize: 20 }} />
              </div>
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
            <AiOutlineSmile style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">Review Information</h2>
            <span>Display review information</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard">
            <div className="hover:text-emerald-700">
              <AppstoreFilled style={{ fontSize: 18 }} />
            </div>
          </Link>
          <span> / </span>
          <h2 className="text-lg mt-2"> Manage Anime </h2>
          <span> / </span>
          <Link href="/dashboard/anime/review">
            <h2 className="mt-2 text-lg hover:text-emerald-700">
              Anime Review
            </h2>
          </Link>
        </div>
      </div>
      <div className="mb-3 flex justify-end">
        <div>
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Search Username and Title Anime"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        data={data} // Data dari state
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* Modal dynamic import */}
      <ReviewDetailModal
        visible={modalVisible}
        detailReview={detailReview}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default ReviewList;
