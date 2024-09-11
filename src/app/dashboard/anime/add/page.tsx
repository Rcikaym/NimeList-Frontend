"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
import axios from "axios";
import {
  ExclamationCircleFilled,
  LeftCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Option } from "antd/es/mentions";

interface DataAnime {
  title: string;
  synopsis: string;
  release_date: string;
  trailer_link: string;
  genres: [];
  photos_anime: [];
  photo_cover: [];
  type: string;
}

interface DataGenre {
  id: string;
  name: string;
}

const UserList: React.FC = () => {
  const [form] = Form.useForm(); // Form handler dari Ant Design
  const [genres, setGenres] = useState<DataGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { confirm } = Modal;

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      try {
        const response = await axios.get<DataGenre[]>(
          "http://localhost:4321/anime/get-all-genre"
        );
        setGenres(response.data); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchGenre(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataAnime) => {
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

  const addAnime = async (values: DataAnime) => {
    const formData = new FormData();

    // Tambahkan data dari form ke FormData untuk dikirim ke backend
    formData.append("title", values.title);
    formData.append("release_date", values.release_date);
    formData.append("synopsis", values.synopsis);
    formData.append("type", values.type);
    formData.append("trailer_link", values.trailer_link);

    // Kirim genres dalam bentuk array
    if (Array.isArray(values.genres)) {
      values.genres.forEach((genre: string) => {
        formData.append("genres", genre); // Pastikan genres dikirim sebagai array
      });
    } // Kirim genres dalam bentuk JSON

    // Tambahkan file foto cover
    if (values.photo_cover && values.photo_cover.length > 0) {
      values.photo_cover.forEach((file: any) => {
        formData.append("photo_cover", file.originFileObj);
      });
    }

    // Tambahkan file foto anime (bisa lebih dari 1)
    if (values.photos_anime) {
      values.photos_anime.forEach((file: any) => {
        formData.append("photos_anime", file.originFileObj);
      });
    }

    setLoading(true); // Set loading jadi true saat request dikirim
    try {
      // Kirim data menggunakan axios
      const response = await axios.post(
        "http://localhost:4321/anime/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Tentukan header untuk form data
          },
        }
      );

      // Tampilkan pesan sukses jika request berhasil
      message.success("Anime added successfully!");
      setLoading(false);
      form.resetFields(); // Reset form setelah submit
    } catch (error) {
      // Tampilkan pesan error jika request gagal
      message.error("Failed to add anime");
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
      <div className="mb-2 bg-emerald-700 p-2 rounded-md">
        <h1 className="font-semibold text-lg">Form Add Anime</h1>
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

          {/* Input release date */}
          <Form.Item
            label="Release Date (yyyy-mm-dd)"
            name="release_date"
            rules={[{ required: true, message: "Please input date" }]}
          >
            <Input placeholder="Input date" />
          </Form.Item>

          {/* Input tariler link */}
          <Form.Item
            label="Trailer Link"
            name="trailer_link"
            rules={[{ required: true, message: "Please input trailer link" }]}
          >
            <Input placeholder="Input trailer link" />
          </Form.Item>

          {/* Input synopsis */}
          <Form.Item
            name="synopsis"
            label="Synopsis"
            rules={[{ required: true, message: "Please input synopsis" }]}
          >
            <Input.TextArea showCount maxLength={1000} />
          </Form.Item>

          {/* Select genre */}
          <Form.Item
            label="Genre (Select More Than One if Need)"
            name="genres"
            rules={[
              { required: true, message: "Please select genre minimal 1" },
            ]}
          >
            <Select
              placeholder="Select genres"
              allowClear
              mode="multiple"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {genres.map((genre) => (
                <Option value={genre.id}>{genre.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Select type */}
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select
              placeholder="Select type"
              allowClear
              showSearch // Aktifkan pencarian
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option value="movies">movies</Option>
              <Option value="series">series</Option>
            </Select>
          </Form.Item>

          {/* Upload Image Cover */}
          <Form.Item
            name="photo_cover"
            rules={[{ required: true, message: "Please input image cover" }]}
            label="Upload photo cover"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          {/* Upload Image */}
          <Form.Item
            name="photos_anime"
            label="Upload photo anime"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload listType="picture" maxCount={4}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <div className="mt-2 bg-emerald-700 p-2 gap-2 rounded-md justify-end flex">
          <Button icon={<LeftCircleOutlined />} href="/dashboard/anime">
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

export default UserList;
