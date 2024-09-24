"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
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
import { useRouter } from "next/navigation";
import { AnimeType, PhotosType, TopicType } from "./types";

export default function TopicEdit({ id }: { id: string }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [topic, setTopic] = useState<any>(null);
  const [animes, setAnimes] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { confirm } = Modal;

  // Fetch topic edit data
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/topic/get/${id}`);
        const topicData = response.data;

        // Set data foto ke setter dari fileList
        setFileList(
          topicData.photos.map((photo: PhotosType, index: number) => ({
            uid: index + 1, // Unique identifier
            name: `${photo.file_path}`, // Extract filename from file_path
            status: "done",
            url: `${api}/${photo.file_path.replace(/\\/g, "/")}`,
          }))
        );

        // Set data ke dalam form
        form.setFieldsValue({
          title: topicData.title,
          body: topicData.body,
          id_anime: topicData.id_anime,
        });

        setTopic(topicData.title);
        setError(null);
      } catch (error) {
        console.error("Error fetching topic:", error);
        setError("Failed to fetch topic data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id, form]);

  // Fetch animes
  useEffect(() => {
    const fetchAnime = async () => {
      const response = await axios.get<AnimeType[]>(
        `${api}/topic/get-all-anime`
      );
      setLoading(true);
      try {
        setAnimes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animes:", error);
        setLoading(true);
      }
    };

    fetchAnime();
  }, []);

  // Fungsi untuk submit data
  const updateTopic = async (values: TopicType) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("body", values.body);
    formData.append("id_anime", values.id_anime);

    const existing_photos = [] as string[];
    const new_photos = [] as string[];

    // Tambahkan file foto anime (bisa lebih dari 1)
    fileList.forEach((file: any) => {
      if (file.url) {
        // Existing file (old photo)
        existing_photos.push(file.name);
      } else {
        // New file (new upload)
        new_photos.push(file.originFileObj);
      }
    });

    // Append new and existing files
    new_photos.forEach((file: any) => formData.append("new_photos", file));
    if (existing_photos.length === 0) {
      formData.append("existing_photos", "");
    } else {
      existing_photos.forEach((file: any) =>
        formData.append("existing_photos", file)
      );
    }

    setLoading(true);
    try {
      const response = await axios.put(`${api}/topic/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Topic updated successfully!");
      router.push("/dashboard/topic");
      setLoading(false);
    } catch (error) {
      message.error("Failed to add anime");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showUpdateConfirm = async () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: TopicType) => {
        confirm({
          centered: true,
          title: "Do you want to update an " + topic + " ?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            setLoading(true); // Set status loading pada tombol OK

            return updateTopic(values)
              .then(() => {
                setLoading(false); // Set loading ke false setelah selesai
              })
              .catch(() => {
                setLoading(false); // Set loading ke false jika terjadi error
              });
          },
        });
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Fungsi yang akan dipanggil saat submit form
  const handleSubmit = () => {
    showUpdateConfirm(); // Panggil fungsi addAnime dengan nilai form
  };

  // Fungsi untuk mengubah default value dari episode jika tipe movie dipilih
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.type === "movie") {
      form.setFieldsValue({ episodes: 1 });
    }
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
      <div className="mb-2 bg-[#005B50]  p-2 rounded-md font-semibold text-lg text-white">
        Form Edit Topic {topic}
      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="rounded-sm shadow-md p-4">
          {/* Form Items */}
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input title" }]}
          >
            <Input placeholder="Input title" />
          </Form.Item>

          <Form.Item
            name="body"
            label="Body"
            rules={[{ required: true, message: "Please input body" }]}
          >
            <Input.TextArea autoSize placeholder="Input body" />
          </Form.Item>

          {/* Animes*/}
          <Form.Item
            name="id_anime"
            label="Anime"
            rules={[{ required: true, message: "Please select anime" }]}
          >
            <Select placeholder="Select anime">
              {animes.map((anime) => (
                <Select.Option key={anime.id} value={anime.id}>
                  {anime.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="photos" label="Upload Topic Photo">
            <Upload
              {...uploadProps}
              listType="picture-card"
              maxCount={4}
              multiple
              fileList={fileList}
              onChange={(info) => handlePhotosUpload(info)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="mt-2 bg-[#005B50] p-2 gap-2 rounded-md justify-end flex">
          <Button icon={<LeftCircleOutlined />} href="/dashboard/anime">
            Back
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}
