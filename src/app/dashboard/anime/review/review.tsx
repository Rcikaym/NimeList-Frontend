"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Modal, Rate, Select, message } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiFillStar,
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineSmile,
  AiOutlineTool,
} from "react-icons/ai";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";

interface DataType {
  id: string;
  username: string;
  title_anime: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface DataAnime {
  id: string;
  title: string;
}

interface DataUser {
  id: string;
  username: string;
}

const ReviewList: React.FC = () => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [detailReview, setDetailReview] = useState<any>(null); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [idReview, setIdReview] = useState<string>("");
  const [form] = Form.useForm();
  const [modalMode, setMode] = useState<"edit" | "detail">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { confirm } = Modal;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);

  const showModal = (modalMode: "edit" | "detail") => {
    setMode(modalMode);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    if (modalMode === "detail") {
      setModalVisible(false); // Untuk mode detail, tidak perlu submit
      return;
    }
    form
      .validateFields()
      .then((values: DataType) => {
        if (modalMode === "edit") {
          showEditConfirm(values);
        }
        setModalVisible(false);
        form.resetFields();
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

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

  const setDataEdit = async (id: string) => {
    setIdReview(id);
    const response = await fetch(`${api}/review/get/${id}`, { method: "GET" });
    const data = await response.json();

    // Set data ke dalam form
    form.setFieldsValue({
      review: data.review,
      rating: parseFloat(data.rating),
    });
  };

  const handleEditReview = async (values: DataType) => {
    setLoading(true);
    try {
      const res = await apiUrl.put(`/review/update/${idReview}`, values); // Melakukan PUT ke server
      message.success(res.data.message);
      setModalVisible(false);

      // Fetch ulang data setelah update
      fetchReview();
      form.resetFields(); // Reset form setelah submit

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to update review");
    }
  };

  const showEditConfirm = (values: DataType) => {
    confirm({
      centered: true,
      title: "Do you want to update this review ?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleEditReview(values);
      },
    });
  };

  const setDataDetail = async (id: string) => {
    const data = await fetch(`${api}/review/get/${id}`, { method: "GET" });
    setDetailReview(await data.json());
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

  const handleTableChange: TableProps<DataType>["onChange"] = (
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
  }, [JSON.stringify(pagination), debounceText]);

  // Kolom table
  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Created By",
        dataIndex: "username",
      },
      {
        title: "Title Anime",
        dataIndex: "title_anime",
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
        render: (text: string, record: DataType) => (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                showModal("detail");
                setDataDetail(record.id);
              }}
            >
              <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
                <AiOutlineEye style={{ fontSize: 20 }} />
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                showModal("edit");
                setDataEdit(record.id);
              }}
            >
              <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800">
                <AiOutlineEdit style={{ fontSize: 20 }} />
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

      {/* Modal dynamic mode */}
      <Modal
        title={modalMode === "edit" ? "Edit Review" : "Detail Review"}
        centered
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelButtonProps={{
          style: modalMode === "detail" ? { display: "none" } : {},
        }}
        okButtonProps={{
          style: modalMode === "detail" ? { display: "none" } : {},
        }}
      >
        {modalMode === "detail" && detailReview ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <UserOutlined />
                <span>{detailReview.username}</span>
              </div>
              <Rate
                count={10}
                disabled
                allowHalf
                defaultValue={0}
                value={parseFloat(detailReview.rating)}
              />
            </div>

            <DisplayLongText text={detailReview.review} />

            <div className="flex gap-2">
              <div className="flex gap-2 items-center">
                <AiOutlineClockCircle size={15} />
                <span className="text-gray-400">
                  {renderDateTime(detailReview.created_at)}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <AiOutlineTool size={15} />
                <span className="text-gray-400">
                  {renderDateTime(detailReview.updated_at)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {modalMode === "edit" ? (
          <Form form={form} layout="vertical">
            {/* Input review */}
            <Form.Item
              label="Review"
              name="review"
              rules={[{ required: true, message: "Please input review" }]}
            >
              <Input.TextArea showCount maxLength={9999} autoSize />
            </Form.Item>

            {/* Input rating */}
            <Form.Item
              name="rating"
              label="Rate"
              rules={[{ required: true, message: "Please input rating" }]}
            >
              <Rate count={10} allowHalf />
            </Form.Item>
          </Form>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default ReviewList;
