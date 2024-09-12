"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Rate,
  Select,
  Space,
  Table,
  message,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
import {
  AiFillCheckCircle,
  AiFillDelete,
  AiFillStar,
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineSmile,
  AiOutlineUser,
} from "react-icons/ai";
import axios from "axios";
import {
  AppstoreAddOutlined,
  AppstoreFilled,
  CheckCircleTwoTone,
  ExclamationCircleFilled,
  EyeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Option } from "antd/es/mentions";

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

const UserList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [dataAnime, setDataAnime] = useState<DataAnime[]>([]); // Data diisi dengan api
  const [dataUser, setDataUser] = useState<DataUser[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [modalGenre, setModalReview] = useState<boolean>(false); // Untuk status modal genre
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const [reviewedAnime, setReviewedAnime] = useState<string[]>([]); // Menyimpan anime yang sudah direview oleh user yang dipilih
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Menyimpan user yang dipilih

  // Fungsi untuk melakukan post data genre
  const handlePostReview = async (values: DataType) => {
    try {
      await axios.post("http://localhost:4321/review/post", values); // Melakukan POST ke server
      message.success("Genre added successfully!");

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(
        "http://localhost:4321/review/get-all"
      );
      setData(response.data); // Memperbarui data genre
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to add genre");
    }
  };

  // Fungsi untuk melakukan delete data genre
  const handleDeleteGenre = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4321/genre/delete/${id}`); // Melakukan DELETE ke server
      message.success("Genre deleted successfully!");

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(
        "http://localhost:4321/genre/get-all"
      );
      setData(response.data); // Memperbarui data genre
    } catch (error) {
      message.error("Failed to delete genre");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataType) => {
        setModalReview(false); // Tutup modal genre

        confirm({
          centered: true,
          title: "Do you want to add this review?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            setLoading(true); // Set status loading pada tombol OK

            return handlePostReview(values)
              .then(() => {
                setLoading(false); // Set loading ke false setelah selesai
              })
              .catch(() => {
                setLoading(false); // Set loading ke false jika terjadi error
              });
          },
          onCancel() {
            setModalReview(true); // Jika dibatalkan, buka kembali modal
          },
        });
      })
      .catch((info) => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string, name: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete " + name + " genre?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleDeleteGenre(id)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
    });
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      try {
        const response = await axios.get<DataType[]>(
          "http://localhost:4321/review/get-all"
        );
        setData(response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    const fetchAnime = async () => {
      try {
        const response = await axios.get<DataAnime[]>(
          "http://localhost:4321/review/get-all-anime"
        );
        setDataAnime(response.data); // Mengisi data dengan anime dari API
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get<DataUser[]>(
          "http://localhost:4321/review/get-all-user"
        );
        setDataUser(response.data); // Mengisi data dengan user dari API
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    fetchAnime();
    fetchGenre(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Fetch anime yang sudah direview oleh user yang dipilih
  const fetchReviewedAnime = async (userId: string) => {
    try {
      const response = await axios.get<string[]>(
        `http://localhost:4321/review/anime-reviewed/${userId}`
      );
      setReviewedAnime(response.data);
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
        title: "Username",
        dataIndex: "username",
        sorter: (a: DataType, b: DataType) =>
          a.username.localeCompare(b.username),
        sortDirections: ["ascend", "descend"],
      },
      {
        title: "Title",
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
        render: (text: string) => formatDateTime(text),
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        render: (text: string) => formatDateTime(text),
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text: string, record: DataType) => (
          <Space size="middle">
            <Button
              type="text"
              className="bg-emerald-700 text-white"
              onClick={() => showDeleteConfirm(record.id, record.username)}
            >
              <AiOutlineDelete style={{ fontSize: 20 }} />
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  const formatDateTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 karena bulan dimulai dari 0
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300">
            <AiOutlineSmile style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Review Information
            </h2>
            <h2 className="text-black text-sm">Display review information</h2>
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
          <Link href="/dashboard/anime/review">
            <h2 className="text-black mt-2 text-lg font-regular hover:text-emerald-700">
              Review
            </h2>
          </Link>
        </div>
      </div>
      <div className="mb-3">
        <Button
          type="text"
          className="bg-emerald-700 text-white"
          onClick={() => setModalReview(true)}
        >
          <AiOutlinePlus /> Add Review
        </Button>
      </div>
      <Table
        columns={columns}
        // rowKey={(record) => record.username}
        bordered
        loading={loading}
        pagination={{ pageSize: 10 }} // Jumlah data yang ditampilkan
        dataSource={data} // Data dari state
      />

      {/* Modal add review */}
      <Modal
        title="Modal add review"
        centered
        onClose={() => setModalReview(false)}
        open={modalGenre}
        onOk={showPostConfirm}
        onCancel={() => {
          setModalReview(false);
        }}
      >
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
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
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
                  <Option key={anime.id} value={anime.id}>
                    {anime.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {/* Input review */}
          <Form.Item
            label="Review"
            name="review"
            rules={[{ required: true, message: "Please input review" }]}
          >
            <Input placeholder="Input review" />
          </Form.Item>

          {/* Input rating */}
          <Form.Item
            name="rating"
            label="Rate"
            rules={[{ required: true, message: "Please input rating" }]}
          >
            <Rate />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
