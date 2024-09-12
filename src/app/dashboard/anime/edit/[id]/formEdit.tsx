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

// Interfaces
interface DataAnime {
  title: string;
  synopsis: string;
  release_date: string;
  trailer_link: string;
  genres: [];
  photos_anime: [];
  photo_cover: [];
  type: string;
  episodes: number;
}

interface GenreType {
  id: string;
  name: string;
}

interface PhotosType {
  id: string;
  file_path: string;
}

interface AnimeType {
  anime: {
    title: string;
    synopsis: string;
    release_date: string;
    trailer_link: string;
    photos: PhotosType[];
    photo_cover: string;
    type: string;
    episodes: number;
    genres: GenreType[];
  };
}

// Fungsi normFile untuk memastikan fileList berupa array
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList ? e.fileList : [];
};

export default function AnimeEdit({ id }: { id: string }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [type, setType] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm } = Modal;

  // Fetch anime details
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4321/anime/get/${id}`
        );
        const animeData = response.data.anime;

        // Set data ke dalam form
        form.setFieldsValue({
          title: animeData.title,
          release_date: animeData.release_date,
          synopsis: animeData.synopsis,
          trailer_link: animeData.trailer_link,
          genres: animeData.genres.map((genre: GenreType) => genre.id),
          type: animeData.type,
          episodes: animeData.episodes,
        });
        setAnime(response.data);
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
      const response = await axios.get<GenreType[]>(
        "http://localhost:4321/anime/get-all-genre"
      );
      setLoading(true);
      try {
        setGenres(response.data);
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

    formData.append("title", values.title);
    formData.append("release_date", values.release_date);
    formData.append("synopsis", values.synopsis);
    formData.append("type", values.type);
    formData.append("trailer_link", values.trailer_link);
    formData.append("episodes", values.episodes.toString());

    if (Array.isArray(values.genres)) {
      values.genres.forEach((genre: string) => {
        formData.append("genres", genre);
      });
    }

    // Handle file upload
    if (values.photo_cover) {
      values.photo_cover.forEach((file: any) => {
        formData.append("photo_cover", file.originFileObj);
      });
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:4321/anime/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.push("/dashboard/anime");
      message.success("Anime updated successfully!");
      setLoading(false);
    } catch (error) {
      message.error("Failed to add anime");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = async () => {
    const response = await axios.get(`http://localhost:4321/anime/get/${id}`);
    const animeData = response.data.anime;
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataAnime) => {
        confirm({
          centered: true,
          title: "Do you want to update an " + animeData.title + " ?",
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
      .catch((info) => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Fungsi yang akan dipanggil saat submit form
  const handleSubmit = (values: any) => {
    updateAnime(values); // Panggil fungsi addAnime dengan nilai form
  };

  // Fungsi untuk mengubah default value dari episode jika tipe movie dipilih
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.type === "movie") {
      form.setFieldsValue({ episodes: 1 });
    }
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

  return (
    <>
      <div className="mb-2 bg-[#005B50]  p-2 rounded-md font-semibold text-lg">
        Form Edit Anime {anime?.anime.title}
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
            name="synopsis"
            label="Synopsis"
            rules={[{ required: true, message: "Please input synopsis" }]}
          >
            <Input.TextArea />
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
          <Form.Item
            name="photo_cover"
            label="Upload Cover Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              {...uploadProps}
              listType="picture"
              maxCount={1}
              onChange={(info) => handleUpload(info, "photo_cover")}
            >
              <Button icon={<UploadOutlined />}>Upload Cover</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="mt-2 bg-[#005B50] p-2 gap-2 rounded-md justify-end flex">
          <Button icon={<LeftCircleOutlined />} href="/dashboard/anime">
            Back
          </Button>
          <Button type="primary" onClick={showPostConfirm}>
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}
