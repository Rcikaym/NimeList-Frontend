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
import { useRouter } from "next/navigation";
import { AnimeType, PhotosType, TopicType } from "./types";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "@/app/dashboard/topic/add/TextAreaUtils";
import dynamic from "next/dynamic";
import apiUrl from "@/hooks/api";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function TopicEdit({ id }: { id: string }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [form] = Form.useForm();
  const [topic, setTopic] = useState<any>(null);
  const [content, setContent] = useState<string>("");
  const [animes, setAnimes] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { confirm } = Modal;

  // Fungsi untuk parser elemen tag HTML
  const htmlParser = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Update src untuk gambar
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      const originalSrc = img.getAttribute("src");
      if (originalSrc && !originalSrc.startsWith("http")) {
        img.setAttribute("src", `${api}${originalSrc}`);
      }
    });

    // Tangani tag <p> kosong
    const paragraphs = doc.querySelectorAll("p");
    paragraphs.forEach((p) => {
      // Jika tag <p> kosong (tidak ada teks dan tidak ada elemen anak)
      if (p.textContent?.trim() === "" && p.children.length === 0) {
        // Gantikan <p> kosong dengan <br> atau menambahkan spasi
        const brElement = document.createElement("br");
        p.replaceWith(brElement);
      }
    });

    return doc.body.innerHTML; // Kembalikan konten dengan perubahan
  };

  // Fetch topic edit data
  useEffect(() => {
    const fetchDetailTopic = async () => {
      setLoading(true);
      try {
        const response = await apiUrl.get(`/topic/get/${id}`);
        const topicData = await response.data;

        const updatedContent = htmlParser(topicData.body);

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
          id_anime: topicData.id_anime,
          body: updatedContent,
        });

        // setContent(updatedContent);

        setTopic(topicData.title);
        setError(null);
      } catch (error) {
        console.error("Error fetching topic:", error);
        setError("Failed to fetch topic data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailTopic();
  }, [id, form]);

  // Fetch animes
  useEffect(() => {
    const fetchAnime = async () => {
      const response = await apiUrl.get(`/topic/get-all-anime`);
      setLoading(true);
      try {
        setAnimes(await response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animes:", error);
        setLoading(true);
      }
    };

    fetchAnime();
  }, []);

  const setSrcImgOri = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Update src untuk gambar
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      const originalSrc = img.getAttribute("data-original-src");
      if (originalSrc) {
        img.setAttribute("src", `${originalSrc}`);
      }
    });

    return doc.body.innerHTML;
  };

  // Fungsi untuk submit data
  const updateTopic = async (values: TopicType) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("id_anime", values.id_anime);

    // Tambahkan body yang sudah dimodifikasi ke FormData
    formData.append("body", setSrcImgOri(content));

    const new_photos = [] as string[];
    const existing_photos = [] as string[];

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
      const response = await apiUrl.put(`/topic/update/${id}`, formData);

      message.success("Topic updated successfully!");
      setLoading(false);
      router.push("/dashboard/topic");
    } catch (error) {
      message.error("Failed to update topic");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showUpdateConfirm = async () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: TopicType) => {
        confirm({
          centered: true,
          title: "Do you want to update this topic ?",
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
        Form Edit Topic
      </div>
      <Form form={form} layout="vertical" onFinish={showUpdateConfirm}>
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
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
            />
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
          <Button icon={<LeftCircleOutlined />} href="/dashboard/topic">
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
