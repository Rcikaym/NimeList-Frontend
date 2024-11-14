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
import { SorterResult } from "antd/es/table/interface";
import apiUrl from "@/hooks/api";
import { a } from "framer-motion/client";

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
  const [dataAnime, setDataAnime] = useState<DataAnime[]>([]); // Data diisi dengan api
  const [dataUser, setDataUser] = useState<DataUser[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [idReview, setIdReview] = useState<string>("");
  const [form] = Form.useForm();
  const [modalMode, setMode] = useState<"post" | "edit" | "detail">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { confirm } = Modal;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);

  const [reviewedAnime, setReviewedAnime] = useState<string[]>([]); // Menyimpan anime yang sudah direview oleh user yang dipilih
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Menyimpan user yang dipili

  const showModal = (modalMode: "post" | "edit" | "detail") => {
    setMode(modalMode);
    setModalVisible(true);
  };

  const handleOk = () => {
    if (modalMode === "detail") {
      setModalVisible(false); // Untuk mode detail, tidak perlu submit
      return;
    }
    form
      .validateFields()
      .then((values: DataType) => {
        if (modalMode === "post") {
          showPostConfirm(values);
        } else if (modalMode === "edit") {
          showEditConfirm(values);
        }
        setModalVisible(false);
        form.resetFields();
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Fungsi untuk melakukan post data genre
  const handlePostReview = async (values: DataType) => {
    try {
      const res = await apiUrl.post(`/review/post`, values); // Melakukan POST ke server

      if (res.status === 201) {
        message.success("Review added successfully!");
        fetchReview();
        form.resetFields(); // Reset form setelah submit
      } else {
        const err = await res.data;
        message.error(err.message);
        setMode("post");
      }
    } catch (error) {
      message.error("Failed to add review");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = (values: DataType) => {
    confirm({
      centered: true,
      title: "Do you want to add this review?",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return await handlePostReview(values)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
      onCancel() {
        setModalVisible(true); // Jika dibatalkan, buka kembali modal
      },
    });
  };

  // Fungsi untuk melakukan delete data review
  const handleDeleteReview = async (id: string) => {
    try {
      await apiUrl.delete(`/review/delete/${id}`, { method: "DELETE" }); // Melakukan DELETE ke server
      message.success("Review deleted successfully!");

      // Fetch ulang data setelah di delete
      fetchReview();
    } catch (error) {
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
        setLoading(true); // Set status loading pada tombol OK

        return handleDeleteReview(id)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
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
    try {
      await apiUrl.put(`/review/update/${idReview}`, values); // Melakukan PUT ke server
      message.success("Review updated successfully!");
      setModalVisible(false);

      // Fetch ulang data setelah update
      fetchReview();
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to update review");
    }
  };

  const showEditConfirm = (values: DataType) => {
    confirm({
      centered: true,
      title: "Do you want to update this review ?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleEditReview(values)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
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

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`${api}/review/get-all-anime`, {
          method: "GET",
        });
        setDataAnime(await response.json()); // Mengisi data dengan anime dari API
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await apiUrl.get(`/review/get-all-user`);
        setDataUser(await response.data); // Mengisi data dengan user dari API
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    fetchAnime();
  }, []);

  // Fetch anime yang sudah direview oleh user yang dipilih
  const fetchReviewedAnime = async (userId: string) => {
    try {
      const response = await fetch(`${api}/review/anime-reviewed/${userId}`, {
        method: "GET",
      });
      setReviewedAnime(await response.json());
    } catch (error) {
      console.error("Error fetching reviewed anime:", error);
    }
  };

  // Ketika user dipilih, fetch anime yang sudah direview oleh user tersebut
  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
    if (userId) {
      fetchReviewedAnime(userId);
    } else {
      setReviewedAnime([]);
    }
  };

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
      <div className="mb-3 flex justify-between">
        <button type="button" onClick={() => showModal("post")}>
          <div className="flex items-center gap-2 bg-emerald-700 p-2 text-white rounded-md hover:bg-emerald-800">
            <AiOutlinePlus />
            <span>Add Review</span>
          </div>
        </button>
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
        title={
          "Modal " + modalMode === "post"
            ? "Add New Review"
            : modalMode === "edit"
            ? "Edit Review"
            : "Detail Review"
        }
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

        {modalMode === "post" ? (
          <Form form={form} layout="vertical">
            {/* Select user */}
            <Form.Item
              label="User"
              name="id_user"
              rules={[{ required: true, message: "Please select user" }]}
            >
              <Select
                placeholder="Select user"
                allowClear
                onChange={handleUserChange}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {dataUser.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </Form.Item>

            {/* Select anime */}
            <Form.Item
              label="Anime"
              name="id_anime"
              rules={[{ required: true, message: "Please select anime" }]}
            >
              <Select
                placeholder="Select anime"
                allowClear
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {dataAnime
                  .filter((anime) => !reviewedAnime.includes(anime.id)) // Filter anime yang belum direview
                  .map((anime) => (
                    <option key={anime.id} value={anime.id}>
                      {anime.title}
                    </option>
                  ))}
              </Select>
            </Form.Item>

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
