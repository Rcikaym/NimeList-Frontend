"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Rate,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  AiFillStar,
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlinePlus,
  AiOutlineSmile,
  AiOutlineTool,
} from "react-icons/ai";
import axios from "axios";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Option } from "antd/es/mentions";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";

const { Title, Text } = Typography;

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
  const [detailReview, setDetailReview] = useState<any>(null);
  const [dataAnime, setDataAnime] = useState<DataAnime[]>([]); // Data diisi dengan api
  const [dataUser, setDataUser] = useState<DataUser[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [modalGenre, setModalReview] = useState<boolean>(false); // Untuk status modal genre
  const [modalDetail, setModalDetail] = useState<boolean>(false); // Untuk status modal detail
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const [reviewedAnime, setReviewedAnime] = useState<string[]>([]); // Menyimpan anime yang sudah direview oleh user yang dipilih
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Menyimpan user yang dipilih

  // Fungsi untuk melakukan post data genre
  const handlePostReview = async (values: DataType) => {
    try {
      await axios.post("http://localhost:4321/review/post", values); // Melakukan POST ke server
      message.success("Review added successfully!");

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(
        "http://localhost:4321/review/get-all"
      );
      setData(response.data); // Memperbarui data genre
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to add review");
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
      message.error("Failed to delete review");
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
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this review?",
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

  const showModalDetail = (id: string) => {
    setModalDetail(true);
    const data = axios.get(`http://localhost:4321/review/get/${id}`);
    data.then((res) => {
      setDetailReview(res.data);
    });
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        const response = await axios.get<DataType[]>(
          "http://localhost:4321/review/get-all"
        );
        setData(response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching review:", error);
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
        console.error("Error fetching animes:", error);
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
    fetchReview(); // Panggil fungsi fetchUsers saat komponen dimuat
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
        ...getColumnSearchProps("username"),
      },
      {
        title: "Title",
        dataIndex: "title_anime",
        ...getColumnSearchProps("title_anime"),
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
          <Space size="middle">
            <Button
              type="text"
              className="bg-emerald-700 text-white"
              onClick={() => showModalDetail(record.id)}
            >
              <AiOutlineEye style={{ fontSize: 20 }} />
            </Button>
            <Button
              type="text"
              className="bg-emerald-700 text-white"
              onClick={() => showDeleteConfirm(record.id)}
            >
              <AiOutlineDelete style={{ fontSize: 20 }} />
            </Button>
          </Space>
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
          <div>
            <h2 className="text-black text-lg font-regular">
              Review Information
            </h2>
            <span className="text-black text-sm">Display review information</span>
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
              Anime Review
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
      <CustomTable
        loading={loading}
        columns={columns}
        data={data} // Data dari state
      />

      {/* Modal view review */}
      <Modal
        title={
          <Title level={4}>
            {detailReview
              ? `Detail Review ${detailReview.title_anime}`
              : "Detail Review"}
          </Title>
        }
        centered
        open={modalDetail}
        footer={null}
        onOk={() => setModalDetail(false)}
        onCancel={() => setModalDetail(false)}
      >
        {detailReview ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space direction="vertical">
              <Space>
                <UserOutlined />
                <Text strong>{detailReview.username}</Text>
              </Space>
              <Rate
                count={10}
                disabled
                allowHalf
                defaultValue={0}
                value={parseFloat(detailReview.rating)}
              />
            </Space>

            <DisplayLongText text={detailReview.review} />

            <Space size="small" direction="horizontal">
              <div className="flex gap-2 items-center">
                <AiOutlineClockCircle size={15} />
                <Text type="secondary">
                  {renderDateTime(detailReview.created_at)}
                </Text>
              </div>
              <div className="flex gap-2 items-center">
                <AiOutlineTool size={15} />
                <Text type="secondary">
                  {renderDateTime(detailReview.updated_at)}
                </Text>
              </div>
            </Space>
          </Space>
        ) : (
          <LoadingOutlined size={35} />
        )}
      </Modal>

      {/* Modal add review */}
      <Modal
        title="Modal Add Review"
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
      </Modal>
    </>
  );
};

export default UserList;
