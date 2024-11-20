"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, message, Modal } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiFillStar,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineRuby,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";
import { transform } from "next/dist/build/swc";

interface DataType {
  id: string;
  name: string;
  price: number;
  duration: number;
  transactions: number;
}

const PremiumList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const { confirm } = Modal;
  const [mode, setMode] = useState<"post" | "edit">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [id, setId] = useState<string>("");

  // Fungsi untuk fetch data premium
  const fetchPremium = async () => {
    try {
      const response = await apiUrl.get(
        `http://localhost:4321/premium/get-all`
      );
      setData(await response.data); // Mengisi data dengan hasil dari API
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching premium data:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchPremium(); // Panggil fungsi fetchPremium saat komponen dimuat
  }, []);

  const showModal = (modalMode: "edit" | "post") => {
    setMode(modalMode);
    setModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: DataType) => {
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

  const handlePostPremium = async (values: DataType) => {
    try {
      await apiUrl.post(`http://localhost:4321/premium/post-admin`, values); // Melakukan POST ke server
      message.success("Premium added successfully!");

      // Fetch ulang data setelah post
      fetchPremium();
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      message.error("Failed to add premium");
    }
  };

  const setDataEdit = async (id: string) => {
    setId(id);
    const response = await apiUrl.get(
      `http://localhost:4321/premium/get-admin-edit/${id}`
    );
    const data = await response.data;
    form.setFieldsValue(data);
  };

  const handleEditPremium = async (values: DataType) => {
    try {
      const res = await apiUrl.put(
        `http://localhost:4321/premium/update-admin/${id}`,
        values
      ); // Melakukan PUT ke server
      message.success(res.data.message);

      // Fetch ulang data setelah edit
      fetchPremium();
    } catch (error) {
      message.error("Failed to edit premium");
    }
  };

  // Fungsi untuk melakukan delete data premium
  const handleDeletePremium = async (id: string) => {
    try {
      await apiUrl.delete(`http://localhost:4321/premium/delete-admin/${id}`); // Melakukan DELETE ke server
      message.success("Premium deleted successfully!");

      // Fetch ulang data setelah post
      fetchPremium();
    } catch (error) {
      message.error("Failed to delete premium");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string, name: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete " + name + " premium?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleDeletePremium(id)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
    });
  };

  const showPostConfirm = (values: DataType) => {
    confirm({
      centered: true,
      title: "Do you want to add " + values.name + " premium?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handlePostPremium(values)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
    });
  };

  const showEditConfirm = (values: DataType) => {
    confirm({
      centered: true,
      title: "Do you want to add " + values.name + " premium?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleEditPremium(values)
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price: number) => {
        return (
          <>
            <span className="gap-1 flex items-center">{`Rp.${price}`}</span>
          </>
        );
      },
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
      render: (text: string, record: DataType) => (
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
          <Link href="/dashboard">
            <div className="hover:text-emerald-700">
              <AppstoreFilled style={{ fontSize: 18 }} />
            </div>
          </Link>
          <span> / </span>
          <h2 className="text-lg mt-2"> Manage Premium </h2>
        </div>
      </div>
      <div className="mb-3">
        <button onClick={() => showModal("post")}>
          <div className="flex items-center gap-1 bg-emerald-700 p-2 text-white rounded-md hover:bg-emerald-800">
            <AiOutlinePlus />
            <span>Add Premium</span>
          </div>
        </button>
      </div>
      <CustomTable
        loading={loading}
        columns={columns}
        data={data} // Data yang sudah difilter
      />
      <Modal
        title={`${mode === "post" ? "Add" : "Edit"} Premium`}
        centered
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
      >
        {mode === "edit" ? (
          <Form form={form} layout="vertical" className="mt-3">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please input premium name!" },
              ]}
            >
              <Input type="text"></Input>
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please input premium price!" },
              ]}
            >
              <InputNumber
                prefix="Rp."
                min={0}
                style={{ width: "100%" }}
              ></InputNumber>
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[
                { required: true, message: "Please input premium duration!" },
              ]}
            >
              <InputNumber
                suffix="Days"
                min={1}
                style={{ width: "100%" }}
              ></InputNumber>
            </Form.Item>
          </Form>
        ) : (
          ""
        )}

        {mode === "post" ? (
          <Form form={form} layout="vertical" className="mt-3">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please input premium name!" },
              ]}
            >
              <Input type="text"></Input>
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please input premium price!" },
              ]}
            >
              <InputNumber
                prefix="Rp."
                min={0}
                style={{ width: "100%" }}
              ></InputNumber>
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[
                { required: true, message: "Please input premium duration!" },
              ]}
            >
              <InputNumber
                suffix="Days"
                min={1}
                style={{ width: "100%" }}
              ></InputNumber>
            </Form.Item>
          </Form>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default PremiumList;
