"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, message } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import {
  AiFillCheckCircle,
  AiFillDelete,
  AiFillStar,
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineTags,
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
import renderDateTime from "@/components/FormatDateTime";
import { CustomTable } from "@/components/CustomTable";

interface DataType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const UserList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [modalGenre, setModalGenre] = useState<boolean>(false); // Untuk status modal genre
  const [form] = Form.useForm();
  const { confirm } = Modal;

  // Fungsi untuk melakukan post data genre
  const handlePostGenre = async (values: DataType) => {
    try {
      await axios.post("http://localhost:4321/genre/post", values); // Melakukan POST ke server
      message.success("Genre added successfully!");

      // Fetch ulang data setelah post
      const response = await axios.get<DataType[]>(
        "http://localhost:4321/genre/get-all"
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
        setModalGenre(false); // Tutup modal genre

        confirm({
          centered: true,
          title: "Do you want to add an " + values.name + " genre?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            setLoading(true); // Set status loading pada tombol OK

            return handlePostGenre(values)
              .then(() => {
                setLoading(false); // Set loading ke false setelah selesai
              })
              .catch(() => {
                setLoading(false); // Set loading ke false jika terjadi error
              });
          },
          onCancel() {
            setModalGenre(true); // Jika dibatalkan, buka kembali modal
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
          "http://localhost:4321/genre/get-all"
        );
        setData(response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchGenre(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Kolom table
  const columns: TableColumnsType<DataType> = useMemo(() => [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
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
            onClick={() => showDeleteConfirm(record.id, record.name)}
          >
            <AiOutlineDelete style={{ fontSize: 20 }} />
          </Button>
        </Space>
      ),
    },
  ], []);

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineTags style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Genre Information
            </h2>
            <span className="text-black text-sm">Display genre information</span>
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
          <Link href="/dashboard/anime/genre">
            <h2 className="text-black mt-2 text-lg font-regular hover:text-emerald-700">
              Anime Genre
            </h2>
          </Link>
        </div>
      </div>
      <div className="mb-3">
        <Button
          type="text"
          className="bg-emerald-700 text-white"
          onClick={() => setModalGenre(true)}
        >
          <AiOutlinePlus /> Add Genre
        </Button>
      </div>
      <CustomTable
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }} // Jumlah data yang ditampilkan
        data={data} // Data dari state
      />
      <Modal
        title="Modal add genre"
        centered
        onClose={() => setModalGenre(false)}
        open={modalGenre}
        onOk={showPostConfirm}
        onCancel={() => {
          setModalGenre(false), form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name" }]}
          >
            <Input placeholder="Input name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
