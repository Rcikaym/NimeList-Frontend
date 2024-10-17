"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
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
import { formats, modules } from "@/components/moduleAndFormatTextArea";

interface DataType {
  title: string;
  body: string;
  id_anime: string;
  id_user: string;
  photos: string[];
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
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/topic/get-all-anime`);
        setAnimes(await response.json()); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching animes:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/topic/get-all-user`);
        setUsers(await response.json()); // Mengisi data dengan hasil dari API
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
          title: "Do you want to add an " + values.title + " ?",
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
    if (values.photos) {
      values.photos.forEach((file: any) => {
        formData.append("photos", file.originFileObj);
      });
    }

    setLoading(true); // Set loading jadi true saat request dikirim
    try {
      // Kirim data menggunakan swr
      const response = await fetch(`${api}/topic/post`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
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
          <Form.Item label="Body" name="body">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
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
          <Form.Item
            name="photos"
            label="Upload photo topic"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload listType="picture" maxCount={4}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <div className="mt-2 bg-[#005B50] p-2 gap-2 rounded-md justify-end flex">
          <Button icon={<LeftCircleOutlined />} href="/dashboard/topic">
            Back
          </Button>
          <Button type="primary" onClick={showPostConfirm} loading={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateTopic;
