"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import type { TableProps } from "antd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTags,
} from "react-icons/ai";
import { AppstoreFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import renderDateTime from "@/components/FormatDateTime";
import { CustomTable } from "@/components/CustomTable";
import { TablePaginationConfig } from "antd/es/table";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";

interface DataType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const AnimeGenre: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [form] = Form.useForm();
  const [modalMode, setMode] = useState<"edit" | "post">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [idGenre, setIdGenre] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  const showModal = (modalMode: "edit" | "post") => {
    setMode(modalMode);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: DataType) => {
        if (modalMode === "post") {
          showPostConfirm(values);
        } else if (modalMode === "edit") {
          showEditConfirm(values);
        }
        setModalVisible(false);
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Fungsi untuk melakukan post data genre
  const handlePostGenre = async (values: DataType) => {
    setLoading(true);
    try {
      const res = await apiUrl.post(`/genre/post`, values); // Melakukan POST ke server
      message.success(res.data.message);

      // Fetch ulang data setelah post
      fetchGenre();
      form.resetFields(); // Reset form setelah submit
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add genre");
    }
  };

  const setDataEdit = async (name: string) => {
    // Set data ke dalam form
    form.setFieldsValue({
      name: name,
    });
  };

  // Fungsi untuk melakukan edit data genre
  const handleEditGenre = async (values: DataType) => {
    setLoading(true);
    try {
      const res = await apiUrl.put(`/genre/update/${idGenre}`, values); // Melakukan PUT ke server
      message.success(res.data.message);

      // Fetch ulang data setelah post
      fetchGenre();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to update genre");
    }
  };

  // Fungsi untuk melakukan delete data genre
  const handleDeleteGenre = async (id: string) => {
    setLoading(true);
    try {
      await apiUrl.delete(`/genre/delete/${id}`); // Melakukan DELETE ke server
      message.success("Genre deleted successfully!");

      // Fetch ulang data setelah post
      fetchGenre();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete genre");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = (values: DataType) => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then(() => {
        setModalVisible(false); // Tutup modal genre

        confirm({
          centered: true,
          title: "Do you want to add an " + values.name + " genre?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            handlePostGenre(values);
          },
          onCancel() {
            showModal("post"); // Jika dibatalkan, buka kembali modal
          },
        });
      })
      .catch((info) => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showEditConfirm = (values: DataType) => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then(() => {
        setModalVisible(false); // Tutup modal genre

        confirm({
          centered: true,
          title: "Do you want to update this genre?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            handleEditGenre(values);
          },
          onCancel() {
            showModal("edit"); // Jika dibatalkan, buka kembali modal
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
        handleDeleteGenre(id);
      },
    });
  };

  // Kolom table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
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
            className="bg-emerald-700 text-white px-4 py-2 flex items-center rounded-md hover:bg-emerald-800"
            onClick={() => showDeleteConfirm(record.id, record.name)}
          >
            <AiOutlineDelete style={{ fontSize: 20 }} />
          </button>
          <button
            type="button"
            className="bg-emerald-700 text-white px-4 py-2 flex items-center rounded-md hover:bg-emerald-800"
            onClick={() => {
              showModal("edit");
              setDataEdit(record.name);
            }}
          >
            <AiOutlineEdit style={{ fontSize: 20 }} />
          </button>
        </div>
      ),
    },
  ];

  const fetchGenre = async () => {
    setLoading(true);
    try {
      const response = await apiUrl.get(
        `/genre/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`
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
      setLoading(true); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    fetchGenre();
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

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineTags style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">Genre Information</h2>
            <span>Display genre information</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard" className="hover:text-emerald-700">
            <AppstoreFilled style={{ fontSize: 18 }} />
          </Link>
          <span> / </span>
          <span className="text-lg font-semibold"> Manage Anime </span>
          <span> / </span>
          <Link
            href="/dashboard/anime/genre"
            className="hover:text-emerald-700"
          >
            <span className="text-lg font-semibold">Anime Genre</span>
          </Link>
        </div>
      </div>
      <div className="mb-3 flex justify-between">
        <div>
          <button
            type="button"
            className="bg-emerald-700 text-white p-2 rounded-md flex items-center gap-2 hover:bg-emerald-800"
            onClick={() => showModal("post")}
          >
            <AiOutlinePlus />
            <span>Add Genre</span>
          </button>
        </div>
        <div>
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Search Genre Name"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <CustomTable
        columns={columns as any}
        loading={loading}
        pagination={pagination} // Jumlah data yang ditampilkan
        onChange={handleTableChange}
        data={data} // Data dari state
      />
      <Modal
        title={modalMode === "post" ? "Add Genre" : "Edit Genre"}
        centered
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modalMode === "edit" ? (
          <Form form={form} layout="vertical" className="mt-3">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input genre name!" }]}
            >
              <Input type="text"></Input>
            </Form.Item>
          </Form>
        ) : (
          ""
        )}

        {modalMode === "post" ? (
          <Form form={form} layout="vertical" className="mt-3">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input genre name!" }]}
            >
              <Input type="text"></Input>
            </Form.Item>
          </Form>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default AnimeGenre;
