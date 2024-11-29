"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadProps,
} from "antd";
import axios from "axios";
import {
  ExclamationCircleFilled,
  LeftCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/TitlePage";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "./TextAreaUtils";
import apiUrl from "@/hooks/api";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

interface DataType {
  title: string;
  body: string;
  id_anime: string;
  id_user: string;
}

interface DataAnime {
  id: string;
  title: string;
}

interface DataUser {
  id: string;
  username: string;
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateTopic: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm(); // Form handler dari Ant Design
  const [animes, setAnimes] = useState<DataAnime[]>([]);
  const [users, setUsers] = useState<DataUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  let [content, setContent] = useState<string>("");
  const [fileList, setFileList] = useState([]);
  const { confirm } = Modal;

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await apiUrl.get(`/topic/get-all-anime`);
        setAnimes(await response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching animes:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await apiUrl.get(`/topic/get-all-user`);
        setUsers(await response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchUser(); // Panggil fungsi fetchUser saat komponen dimuat
    fetchAnime(); // Panggil fungsi fetchAnime saat komponen dimuat
  }, []);

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataType) => {
        confirm({
          centered: true,
          title: "Do you want to add this topic ?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            setLoading(true); // Set status loading pada tombol OK

            return addAnime(values)
              .then(() => {
                setLoading(false); // Set loading ke false setelah selesai
              })
              .catch(() => {
                setLoading(false); // Set loading ke false jika terjadi error
              });
          },
        });
      })
      .catch((info) => {
        message.error("Please complete the form before submitting!");
      });
  };

  const addAnime = async (values: DataType) => {
    const formData = new FormData();

    // Tambahkan data dari form ke FormData untuk dikirim ke backend
    formData.append("title", values.title);
    formData.append("id_anime", values.id_anime);
    formData.append("id_user", values.id_user);

    // Tambahkan body yang sudah dimodifikasi ke FormData
    formData.append("body", content);

    // Tambahkan file foto anime (bisa lebih dari 1)
    if (fileList.length > 0) {
      fileList.forEach((file: any) => {
        formData.append("photos", file.originFileObj);
      });
    }

    setLoading(true); // Set loading jadi true saat request dikirim
    try {
      const response = await apiUrl.post(`/topic/post`, formData);

      if (!response) {
        throw new Error("Failed to add topic");
      }

      // Tampilkan pesan sukses jika request berhasil
      message.success("Topic added successfully!");
      setLoading(false);
      router.push("/dashboard/topic");
    } catch (error) {
      // Tampilkan pesan error jika request gagal
      message.error("Failed to add topic");
    }
  };

  // Fungsi yang akan dipanggil saat submit form
  const handleSubmit = (values: any) => {
    addAnime(values); // Panggil fungsi addAnime dengan nilai form
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handlePhotosUpload = (info: any) => {
    const { file, fileList } = info;

    setFileList(fileList);
    if (file.status === "done") {
      message.success(`${file.name} uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} upload failed.`);
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

  return (
    <>
      <PageTitle title="Add Topic" />
      <div className="mb-2 bg-[#005B50] p-2 rounded-md font-semibold text-lg text-white">
        Form Add Topic
      </div>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="rounded-sm shadow-md p-4">
          {/* Input title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input title" }]}
          >
            <Input placeholder="Input title" />
          </Form.Item>

          {/* Input synopsis */}
          <Form.Item label="Body" name="body" rules={[{ required: true }]}>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
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
              {animes.map((anime) => (
                <Option value={anime.id}>{anime.title}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Select user */}
          <Form.Item
            label="Created By"
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
              {users.map((user) => (
                <Option value={user.id}>{user.username}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Upload Image */}
          <Form.Item name="photos" label="Upload photo topic">
            <Upload
              {...uploadProps}
              listType="picture"
              maxCount={4}
              multiple
              onChange={handlePhotosUpload}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <div className="mt-2 bg-[#005B50] p-2 gap-2 rounded-md justify-end flex">
          <Link
            href="/dashboard/topic"
            className="bg-white text-black px-2 py-1 rounded-md flex items-center gap-1 hover:text-[#005B50]"
          >
            <BiArrowBack style={{ fontSize: "20px" }} />
          </Link>
          <Button type="primary" onClick={showPostConfirm} loading={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateTopic;
