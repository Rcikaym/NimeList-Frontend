"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Select,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineFileImage,
  AiOutlinePlus,
  AiOutlineTag,
  AiOutlineTool,
} from "react-icons/ai";
import axios from "axios";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import { Option } from "antd/es/mentions";

const { Text } = Typography;

interface DataType {
  id: string;
  topic: string;
  user: string;
  created_at: string;
  updated_at: string;
}

interface DataPost {
  id_user: string;
  id_topic: string;
  comment: string;
}

const api = process.env.NEXT_PUBLIC_API_URL;

const TopicCommentList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [modalPost, setModalPost] = useState<boolean>(false);
  const [user, setUser] = useState<any[]>([]);
  const [topic, setTopic] = useState<any[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<string>(""); // Menyimpan id photo yang sedang diedit
  const [modalUpdatePhoto, setModalUpdatePhoto] = useState<boolean>(false); // Untuk status modal edit photo
  const [modalDetail, setModalDetail] = useState<boolean>(false); // Untuk status modal detail
  const [detailComment, setDetailComment] = useState<any>(null);
  const { confirm } = Modal;
  const [form] = Form.useForm();

  const handleEditPhoto = (id: string) => {
    setEditingPhoto(id); // Simpan data photo yang sedang diedit
    setModalUpdatePhoto(true); // Buka modal
  };

  // Modal detail comment
  const showModalDetail = (id: string) => {
    setModalDetail(true);
    const data = axios.get(`${api}/comment/get/${id}`);
    data.then((res) => {
      setDetailComment(res.data);
    });
  };

  // Fungsi untuk melakukan post data genre
  const handlePostComment = async (values: DataPost) => {
    try {
      const post = await axios.post(`${api}/comment/post`, values); // Melakukan POST ke server

      if (post.status === 201) {
        message.success("Comment added successfully!");
      } else {
        message.error("Failed to add comment");
      }

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(`${api}/comment/get-all`);
      setData(response.data); // Memperbarui data comment
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to add review");
    }
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get<DataType[]>(`${api}/comment/get-all`);
        setData(response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get<DataType[]>(
          `${api}/comment/get-all-user`
        );
        setUser(response.data); // Mengisi data dengan hasil dari API
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchTopic = async () => {
      try {
        const response = await axios.get<DataType[]>(
          `${api}/comment/get-all-topic`
        );
        setTopic(response.data); // Mengisi data dengan isi dari API
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTopic(); // Panggil fungsi fetchTopic saat komponen dimuat
    fetchUser(); // Panggil fungsi fetchUser saat komponen dimuat
    fetchComment(); // Panggil fungsi fetchComment saat komponen dimuat
  }, []);

  // Fungsi untuk melakukan delete data photo
  const handleDeletePhoto = async (id: string) => {
    try {
      await axios.delete(`${api}/photo-topic/delete/${id}`); // Melakukan DELETE ke server
      message.success("Photo deleted successfully!");

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(
        `${api}/photo-topic/get-all`
      );
      setData(response.data); // Memperbarui data photo
    } catch (error) {
      message.error("Failed to delete photo");
    }
  };

  // Tampilkan modal confirm saat ingin create data comment
  const showPostConfirm = () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataPost) => {
        setModalPost(false); // Tutup modal Post

        confirm({
          centered: true,
          title: "Do you want to post this photo?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            setLoading(true); // Set status loading pada tombol OK

            return handlePostComment(values)
              .then(() => {
                setLoading(false); // Set loading ke false setelah selesai
              })
              .catch(() => {
                setLoading(false); // Set loading ke false jika terjadi error
              });
          },
          onCancel() {
            setModalPost(true); // Jika dibatalkan, buka kembali modal
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
      title: "Do you want to delete this photo?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleDeletePhoto(id)
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
      title: "Title Topic",
      dataIndex: "topic",
      sorter: (a: DataType, b: DataType) => a.topic.localeCompare(b.topic),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("topic"),
    },
    {
      title: "Username",
      dataIndex: "user",
      sorter: (a: DataType, b: DataType) => a.topic.localeCompare(b.topic),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("user"),
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
            onClick={() => handleEditPhoto(record.id)}
          >
            <AiOutlineEdit style={{ fontSize: 20 }} />
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
  ];

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineFileImage style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Comment Topic Information
            </h2>
            <span className="text-black text-sm">
              Displays comment topic information
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
          <Link href="/dashboard/topic/comment">
            <h2 className="text-black text-lg font-regular hover:text-emerald-700 mt-2">
              Comment Topic
            </h2>
          </Link>
        </div>
      </div>
      <div className="mb-3">
        <Button
          type="text"
          className="bg-emerald-700 text-white"
          onClick={() => setModalPost(true)}
        >
          <AiOutlinePlus /> Add Comment
        </Button>
      </div>
      <CustomTable
        columns={columns}
        pagination={{ pageSize: 7 }} // Jumlah data yang ditampilkan
        data={data} // Data dari state
      />
      {/* <Modal
        title="Modal edit photo"
        centered
        onClose={() => setModalUpdatePhoto(false)}
        open={modalUpdatePhoto}
        onOk={showUpdateConfirm}
        onCancel={() => {
          setModalUpdatePhoto(false);
        }}
      >
        <Form form={form} layout="vertical" className="mt-3">
          <Form.Item name="photos" label="Update Photo">
            <Upload
              {...uploadProps}
              listType="picture"
              maxCount={1}
              onChange={(info) => handleUpload(info)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal> */}

      {/* Modal detail comment */}
      <Modal
        title={
          detailComment
            ? `Detail Comment By ${detailComment.user}`
            : "Detail Comment"
        }
        centered
        open={modalDetail}
        onOk={() => setModalDetail(false)}
        onCancel={() => setModalDetail(false)}
        footer={false}
      >
        {detailComment ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div className="flex gap-1 items-center">
              <AiOutlineTag size={19} />
              <Text>{detailComment.topic}</Text>
            </div>

            <DisplayLongText text={detailComment.comment} />

            <Space size="small" direction="horizontal">
              <div className="flex gap-2 items-center">
                <AiOutlineClockCircle size={15} />
                <Text type="secondary">
                  {renderDateTime(detailComment.created_at)}
                </Text>
              </div>
              <div className="flex gap-2 items-center">
                <AiOutlineTool size={15} />
                <Text type="secondary">
                  {renderDateTime(detailComment.updated_at)}
                </Text>
              </div>
            </Space>
          </Space>
        ) : (
          <LoadingOutlined size={35} />
        )}
      </Modal>

      {/* Modal add comment */}
      <Modal
        title="Modal Add Comment"
        centered
        onClose={() => setModalPost(false)}
        open={modalPost}
        onOk={showPostConfirm}
        onCancel={() => {
          setModalPost(false);
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
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {user.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Select topic */}
          <Form.Item
            label="Topic"
            name="id_topic"
            rules={[{ required: true, message: "Please select topic" }]}
          >
            <Select
              placeholder="Select topic"
              allowClear
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {topic.map((topic) => (
                <Option key={topic.id} value={topic.id}>
                  {topic.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Input comment */}
          <Form.Item
            label="Comment"
            name="comment"
            rules={[{ required: true, message: "Please input comment" }]}
          >
            <Input.TextArea showCount maxLength={9999} autoSize />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TopicCommentList;
