"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, message, Modal, Select } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineRuby,
  AiOutlineSearch,
} from "react-icons/ai";
import { AppstoreFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { CustomTable } from "@/components/CustomTable";
import renderDateTime from "@/utils/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";
import { Option } from "antd/es/mentions";
import dynamic from "next/dynamic";

const PremiumModalForm = dynamic(() => import("./PremiumModalForm"), {
  ssr: false,
});

export interface DataPremiumType {
  id: string;
  name: string;
  price: number;
  duration: number;
  transactions: number;
  status: string;
  description: string;
}

const PremiumList: React.FC = () => {
  const [data, setData] = useState<DataPremiumType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const { confirm } = Modal;
  const [mode, setMode] = useState<"post" | "edit">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [id, setId] = useState<string>("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterStatus, setStatus] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1000);

  // Fungsi untuk fetch data premium
  const fetchPremium = async () => {
    try {
      const response = await apiUrl.get(
        `http://localhost:4321/premium/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}&status=${filterStatus}`
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
      console.error("Error fetching premium data:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchPremium(); // Panggil fungsi fetchPremium saat komponen dimuat
  }, [pagination.current, debounceText, filterStatus]);

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
      .then((values: DataPremiumType) => {
        if (mode === "post") {
          showPostConfirm(values);
        } else if (mode === "edit") {
          showEditConfirm(values);
        }
        setModalVisible(false);
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  const handlePostPremium = async (values: DataPremiumType) => {
    setLoading(true);
    try {
      const res = await apiUrl.post(
        `http://localhost:4321/premium/post`,
        values
      ); // Melakukan POST ke server
      message.success(res.data.message);

      // Fetch ulang data setelah post
      fetchPremium();
      setLoading(false);
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      setLoading(false);
      message.error("Failed to add premium");
    }
  };

  const setDataEdit = async (values: DataPremiumType) => {
    setId(values.id);
    form.setFieldsValue(values);
  };

  const handleEditPremium = async (values: DataPremiumType) => {
    setLoading(true);
    try {
      const res = await apiUrl.put(
        `http://localhost:4321/premium/update/${id}`,
        values
      ); // Melakukan PUT ke server
      message.success(res.data.message);

      // Fetch ulang data setelah edit
      fetchPremium();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to edit premium");
    }
  };

  // Fungsi untuk melakukan delete data premium
  const handleDeletePremium = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiUrl.delete(
        `http://localhost:4321/premium/delete/${id}`
      ); // Melakukan DELETE ke server
      message.success(res.data.message);

      // Fetch ulang data setelah post
      fetchPremium();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete premium");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string, name: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this premium?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleDeletePremium(id);
      },
    });
  };

  const showPostConfirm = (values: DataPremiumType) => {
    confirm({
      centered: true,
      title: "Do you want to add this premium?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handlePostPremium(values);
      },
    });
  };

  const showEditConfirm = (values: DataPremiumType) => {
    confirm({
      centered: true,
      title: "Do you want to update this premium?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      onOk() {
        handleEditPremium(values);
      },
      onCancel() {
        showModal("edit");
      },
    });
  };

  // Kolom table
  const columns: TableColumnsType<DataPremiumType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price: number) => `Rp ${price.toLocaleString("id-ID")}`,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (duration: number) => {
        return (
          <>
            <span className="flex items-center">{`${duration} Days`}</span>
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        return status === "active" ? (
          <>
            <div className="flex rounded-md bg-emerald-700 px-3 py-1 justify-center w-fit">
              <span className="text-white">Active</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex rounded-md bg-red-600 px-3 py-1 justify-center w-fit">
              <span className="text-white">Inactive</span>
            </div>
          </>
        );
      },
    },
    {
      title: "Total Transactions",
      dataIndex: "transactions",
      render: (transactions: number) => {
        return (
          <>
            <span className="flex items-center">{`${transactions} Transactions`}</span>
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
      render: (text: string, record: DataPremiumType) => (
        <div className="flex gap-3">
          <a
            onClick={() => {
              showModal("edit");
              setDataEdit(record.id);
            }}
          >
            <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800 w-fit h-fit">
              <AiOutlineEdit style={{ fontSize: 20 }} />
            </div>
          </a>
          {record.transactions === 0 ? (
            <a onClick={() => showDeleteConfirm(record.id, record.name)}>
              <div className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800 w-fit h-fit">
                <AiOutlineDelete style={{ fontSize: 20 }} />
              </div>
            </a>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center mt-3 mb-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineRuby style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">Premium Information</h2>
            <span>Short information about premium data</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard" className="hover:text-emerald-700">
            <AppstoreFilled style={{ fontSize: 18 }} />
          </Link>
          <span> / </span>
          <Link href="/dashboard/premium" className="hover:text-emerald-700">
            <span className="text-lg font-semibold"> Premium </span>
          </Link>
        </div>
      </div>
      <div className="mb-3 flex justify-between">
        <button onClick={() => showModal("post")}>
          <div className="flex items-center gap-1 bg-emerald-700 p-2 text-white rounded-md hover:bg-emerald-800">
            <AiOutlinePlus />
            <span>Add Premium</span>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Search Premium"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            <Select
              defaultValue={filterStatus}
              style={{ width: 120 }}
              onChange={(value) => setStatus(value)}
            >
              <Option value="">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        pagination={pagination}
        data={data}
      />
      <PremiumModalForm
        visible={modalVisible}
        mode={mode === "post" ? "post" : "edit"}
        form={form}
        onSubmit={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default PremiumList;
