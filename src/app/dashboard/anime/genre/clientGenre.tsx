"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, message } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineTags } from "react-icons/ai";
import axios from "axios";
import { AppstoreFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import renderDateTime from "@/components/FormatDateTime";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import { TablePaginationConfig } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import useDebounce from "@/hooks/useDebounce";

interface DataType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const AnimeGenre: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [modalGenre, setModalGenre] = useState<boolean>(false); // Untuk status modal genre
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortOrder, setOrder] = useState<string>("ASC");
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fungsi untuk melakukan post data genre
  const handlePostGenre = async (values: DataType) => {
    try {
      await fetch(`${api}/genre/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }); // Melakukan POST ke server
      message.success("Genre added successfully!");

      // Fetch ulang data setelah post
      fetchGenre();
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to add genre");
    }
  };

  // Fungsi untuk melakukan delete data genre
  const handleDeleteGenre = async (id: string) => {
    try {
      await fetch(`${api}/genre/delete/${id}`, {
        method: "DELETE",
      }); // Melakukan DELETE ke server
      message.success("Genre deleted successfully!");

      // Fetch ulang data setelah post
      fetchGenre();
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

  // Kolom table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      sortDirections: ["descend"],
      ...getColumnSearchProps("name", setSearchText),
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
  ];

  const fetchGenre = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${api}/genre/get-all?page=${pagination.current}&limit=${
          pagination.pageSize
        }&search=${debounceText}&order=${encodeURIComponent(sortOrder)}`,
        {
          method: "GET",
        }
      );
      const { data, total } = await response.json();
      setData(data); // Mengisi data dengan hasil dari API
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
      });
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(true); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    fetchGenre();
  }, [JSON.stringify(pagination), sortOrder, debounceText]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination: TablePaginationConfig,
    filters,
    sorter
  ) => {
    const sortParsed = sorter as SorterResult<DataType>;
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    setOrder(sortParsed.order === "descend" ? "DESC" : "ASC");
    console.log(sortOrder);
  };

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
            <span className="text-black text-sm">
              Display genre information
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
        columns={columns as any}
        loading={loading}
        pagination={pagination} // Jumlah data yang ditampilkan
        onChange={handleTableChange}
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

export default AnimeGenre;
