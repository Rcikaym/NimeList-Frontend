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
import { Option } from "antd/es/mentions";
import { useRouter } from "next/navigation";
import { DataAnime, GenreType, PhotosType } from "./types";
import apiUrl from "@/hooks/api";

export default function AnimeEdit({ id }: { id: string }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [type, setType] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [fileCover, setFileCover] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fetch anime edit data
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/anime/get/${id}`, {
          method: "GET",
        });
        const data = await response.json();
        const animeData = data.anime;

        // Set data foto ke setter dari fileList
        setFileList(
          animeData.photos.map((photo: PhotosType) => ({
            uid: photo.id, // Unique identifier
            name: `${photo.file_path}`, // Extract filename from file_path
            status: "done",
            url: `${api}/${photo.file_path.replace(/\\/g, "/")}`,
          }))
        );

        // Set data ke dalam form
        form.setFieldsValue({
          title: animeData.title,
          release_date: animeData.release_date,
          synopsis: animeData.synopsis,
          trailer_link: animeData.trailer_link,
          watch_link: animeData.watch_link,
          genres: animeData.genres.map((genre: GenreType) => genre.id),
          type: animeData.type,
          episodes: animeData.episodes,
        });

        setAnime(animeData.title);
        setError(null);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setError("Failed to fetch anime data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id, form]);

  // Fetch genres
  useEffect(() => {
    const fetchGenre = async () => {
      const response = await fetch(`${api}/anime/get-all-genre`, {
        method: "GET",
      });
      setLoading(true);
      try {
        setGenres(await response.json());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setLoading(true);
      }
    };

    fetchGenre();
  }, []);

  // Fungsi untuk submit data
  const updateAnime = async (values: DataAnime) => {
    const formData = new FormData();

    function convertToEmbedUrl(url: any) {
      // Regular expression to match YouTube video IDs
      const videoIdMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );

      // Check if the video ID was found
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
      } else {
        // Return null or the original URL if it's not a valid YouTube link
        return null;
      }
    }

    formData.append("title", values.title);
    formData.append("release_date", values.release_date);
    formData.append("synopsis", values.synopsis);
    formData.append("watch_link", values.watch_link);
    formData.append("type", values.type);
    formData.append("episodes", values.episodes.toString());

    const existing_photos = [] as string[];
    const new_photos = [] as string[];

    if (Array.isArray(values.genres)) {
      values.genres.forEach((genre: string) => {
        formData.append("genres", genre);
      });
    }

    fileCover.forEach((file: any) => {
      formData.append("photo_cover", file.originFileObj);
    });

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
    new_photos.forEach((file: any) => formData.append("photos_anime", file));
    if (existing_photos.length === 0) {
      formData.append("existing_photos", "");
    } else {
      existing_photos.forEach((file: any) =>
        formData.append("existing_photos", file)
      );
    }

    //Ubah format youtube url menjadi embedUrl
    if (values.trailer_link) {
      const youtubeUrl = values.trailer_link;
      const embedUrl = convertToEmbedUrl(youtubeUrl) ?? "";
      formData.append("trailer_link", embedUrl);
    }

    setLoading(true);
    try {
      const update = await apiUrl.put(`${api}/anime/update/${id}`, formData);
      const res = await update.data;
      router.push("/dashboard/anime");
      message.success(res.message);
      setLoading(false);
    } catch (error) {
      message.error(`Failed to update anime: ${error}`);
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = async () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataAnime) => {
        confirm({
          centered: true,
          title: "Do you want to update an " + anime + " ?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            setLoading(true); // Set status loading pada tombol OK

            return updateAnime(values)
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
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
  };

  const handleCoverUpload = (info: any) => {
    const { file, fileList } = info;

    setFileCover(fileList);
    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
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
        Edit Anime {anime}
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={showPostConfirm}
        onValuesChange={onValuesChange}
      >
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
            name="release_date"
            label="Release Date"
            rules={[{ required: true, message: "Please input date" }]}
          >
            <Input placeholder="yyyy-mm-dd" />
          </Form.Item>

          <Form.Item
            name="trailer_link"
            label="Trailer Link"
            rules={[{ required: true, message: "Please input trailer link" }]}
          >
            <Input placeholder="yyyy-mm-dd" />
          </Form.Item>

          <Form.Item
            label="Watch Link"
            name="watch_link"
            rules={[{ required: true, message: "Please input watch link" }]}
          >
            <Input placeholder="Input watch link" />
          </Form.Item>

          <Form.Item
            name="synopsis"
            label="Synopsis"
            rules={[{ required: true, message: "Please input synopsis" }]}
          >
            <Input.TextArea autoSize />
          </Form.Item>

          {/* Genres */}
          <Form.Item
            name="genres"
            label="Genres"
            rules={[{ required: true, message: "Please select genres" }]}
          >
            <Select mode="multiple" placeholder="Select genres">
              {genres.map((genre) => (
                <Select.Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Select.Option>
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
              onChange={(value) => setType(value)} // Set nilai type saat berubah
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option value="movie">movie</Option>
              <Option value="series">series</Option>
            </Select>
          </Form.Item>

          {/* Input total episode */}
          <Form.Item
            name="episodes"
            label="Episode"
            rules={[{ required: true, message: "Please input episode" }]}
          >
            <InputNumber
              min={1}
              value={episodes} // Gunakan state episode sebagai nilai
              onChange={(value) => setEpisodes(value)} // Update nilai episode jika series
              disabled={type === "movie"} // Disable input jika type adalah movie
              placeholder="Input total episode"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Upload Cover */}
          <Form.Item name="photo_cover" label="Update Cover Image">
            <Upload
              {...uploadProps}
              listType="picture"
              maxCount={1}
              fileList={fileCover}
              onChange={(info) => handleCoverUpload(info)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="photos_anime" label="Upload Photo Anime">
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