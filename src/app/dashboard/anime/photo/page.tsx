"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Space,
  Table,
  Upload,
} from "antd";
import type { TableColumnsType, UploadProps } from "antd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineFileImage,
} from "react-icons/ai";
import axios from "axios";
import {
  AppstoreFilled,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { CustomTable, getColumnSearchProps } from "@/components/CustomTable";
import renderDateTime from "@/components/FormatDateTime";
import PageTitle from "@/components/TitlePage";

interface PhotosType {
  photos: string[];
}

interface DataType {
  id: string;
  anime: string;
  photos: PhotosType[];
  file_path: string;
  created_at: string;
  updated_at: string;
}

// Fungsi normFile untuk memastikan fileList berupa array
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList ? e.fileList : [];
};

const AnimeList: React.FC = () => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [idPhoto, setId] = useState<string>(""); // Menyimpan anime yang sedang diedit
  const [detailPhoto, setDetailPhoto] = useState<any>();
  const [modalMode, setMode] = useState<"edit" | "detail">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { confirm } = Modal;
  const [form] = Form.useForm();

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
      .then((values: PhotosType) => {
        if (modalMode === "edit") {
          showEditConfirm(values);
        }
        setModalVisible(false);
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Modal detail photo
  const setDataDetail = async (id: string) => {
    const data = await fetch(`${api}/photo-anime/get/${id}`, { method: "GET" });
    setDetailPhoto(await data.json());
    console.log(detailPhoto);
  };

  const handleUpdatePhoto = async (values: PhotosType) => {
    const formData = new FormData();
    const file: any = values.photos[0];

    formData.append("photos", file.originFileObj);

    try {
      await fetch(`${api}/photo-anime/update/${idPhoto}`, {
        method: "PUT",
        body: formData,
      }); // Update foto di server
      message.success("Photo updated successfully!");

      // Fetch ulang data setelah update
      const response = await fetch(`${api}/photo-anime/get-all`, {
        method: "GET",
      });
      setData(await response.json()); // Perbarui data foto anime
    } catch (error) {
      message.error("Failed to update photo");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showEditConfirm = (values: PhotosType) => {
    confirm({
      centered: true,
      title: "Do you want to update this Photo?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleUpdatePhoto(values)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
      onCancel() {
        showModal("edit"); // Jika dibatalkan, buka kembali modal
      },
    });
  };

  // Fetch data dari API ketika komponen dimuat
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`${api}/photo-anime/get-all`, {
          method: "GET",
        });
        setData(await response.json()); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchPhoto(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Fungsi untuk melakukan delete data genre
  const handleDeleteAnime = async (id: string) => {
    try {
      await fetch(`${api}/photo-anime/delete/${id}`, { method: "DELETE" }); // Melakukan DELETE ke server
      message.success("Anime deleted successfully!");

      // Fetch ulang data setelah post
      const response = await fetch(`${api}/photo-anime/get-all`, {
        method: "GET",
      });
      setData(await response.json()); // Memperbarui data genre
    } catch (error) {
      message.error("Failed to delete anime");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this photo?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleDeleteAnime(id)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
    });
  };

  const handleUpload = async (info: any, fieldName: string) => {
    const { file, fileList } = info;

    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
      // Update form values
      form.setFieldsValue({ [fieldName]: fileList });
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }

    // If you need to perform any action when the overall status changes
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        message.error("Image must smaller than 5MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  };

  // Kolom table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "anime",
      sorter: (a: DataType, b: DataType) => a.anime.localeCompare(b.anime),
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("anime"),
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
            onClick={() => {
              showModal("detail");
              setDataDetail(record.id);
            }}
          >
            <AiOutlineEye style={{ fontSize: 20 }} />
          </Button>
          <Button
            type="text"
            className="bg-emerald-700 text-white"
            onClick={() => {
              showModal("edit");
              setId(record.id);
            }}
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
      <PageTitle title="Anime - PhotoList" />
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineFileImage style={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-black text-lg font-regular">
              Anime Photos Information
            </h2>
            <span className="text-black text-sm">
              Displays anime photo information
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
          <Link href="/dashboard/anime/photo">
            <h2 className="text-black text-lg font-regular hover:text-emerald-700 mt-2">
              Anime Photo
            </h2>
          </Link>
        </div>
      </div>
      <CustomTable
        columns={columns}
        pagination={{ pageSize: 7 }} // Jumlah data yang ditampilkan
        data={data} // Data dari state
      />
      <Modal
        title={
          "Modal " + modalMode === "post"
            ? "Add New Comment"
            : modalMode === "edit"
            ? "Edit Comment"
            : "Detail Comment"
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
        {modalMode === "edit" ? (
          <Form form={form} layout="vertical" className="mt-3">
            <Form.Item
              name="photos"
              label="Update Photo"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Please select file!" }]}
            >
              <Upload
                {...uploadProps}
                listType="picture"
                maxCount={1}
                onChange={(info) => handleUpload(info, "photos")}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        ) : (
          ""
        )}

        {modalMode === "detail" ? (
          <div className="mt-3">
            <Image
              src={
                "http://localhost:4321/" +
                detailPhoto?.file_path.replace(/\\/g, "/")
              }
              alt="photo"
              width={250}
              height={150}
            />
            <h1 className="mt-2">File path: {detailPhoto?.file_path}</h1>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default AnimeList;
