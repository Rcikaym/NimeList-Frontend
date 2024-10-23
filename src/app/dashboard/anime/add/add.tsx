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
} from "antd";
import {
  ExclamationCircleFilled,
  LeftCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { useRouter } from "next/navigation";

interface DataAnime {
  title: string;
  synopsis: string;
  release_date: string;
  trailer_link: string;
  genres: [];
  photos_anime: [];
  photo_cover: string[];
  type: string;
  episodes: number;
  watch_link: string;
}

interface DataGenre {
  id: string;
  name: string;
}

// Fungsi normFile untuk memastikan fileList berupa array
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList ? e.fileList : [];
};

export default function AddAnime() {
  const router = useRouter();
  const [form] = Form.useForm(); // Form handler dari Ant Design
  const [genres, setGenres] = useState<DataGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [type, setType] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/anime/get-all-genre`, {
          method: "GET",
        });
        setGenres(await response.json()); // Mengisi data dengan hasil dari API
        setLoading(false); // Menonaktifkan status loading setelah data didapat
      } catch (error) {
        console.error("Error fetching genre:", error);
        setLoading(true); // Tetap menonaktifkan loading jika terjadi error
      }
    };

    fetchGenre(); // Panggil fungsi fetchUsers saat komponen dimuat
  }, []);

  // Fungsi untuk mengubah default value dari episode jika tipe movie dipilih
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.type === "movie") {
      form.setFieldsValue({ episodes: 1 });
    }
  };

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
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  const addAnime = async (values: DataAnime) => {
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

    // Tambahkan data dari form ke FormData untuk dikirim ke backend
    formData.append("title", values.title);
    formData.append("release_date", values.release_date);
    formData.append("synopsis", values.synopsis);
    formData.append("type", values.type);
    formData.append("watch_link", values.watch_link);
    formData.append("episodes", values.episodes.toString());

    // Kirim genres dalam bentuk array
    if (Array.isArray(values.genres)) {
      values.genres.forEach((genre: string) => {
        formData.append("genres", genre); // Pastikan genres dikirim sebagai array
      });
    } // Kirim genres dalam bentuk JSON

    // Tambahkan file foto cover
    if (values.photo_cover) {
      values.photo_cover.forEach((file: any) => {
        formData.append("photo_cover", file.originFileObj);
      });
    }

    // Tambahkan file foto anime (bisa lebih dari 1)
    if (values.photos_anime && values.photo_cover.length > 0) {
      values.photos_anime.forEach((file: any) => {
        formData.append("photos_anime", file.originFileObj);
      });
    }

    //Ubah format youtube link url menjadi embedUrl
    if (values.trailer_link) {
      const embedUrl = convertToEmbedUrl(values.trailer_link) ?? "";
      formData.append("trailer_link", embedUrl);
    }

    setLoading(true); // Set loading jadi true saat request dikirim
    try {
      // Kirim data menggunakan axios
      const response = await fetch(`${api}/anime/post`, {
        method: "POST",
        body: formData,
      });

      // Tampilkan pesan sukses jika request berhasil
      message.success("Anime added successfully!");
      setLoading(false);
      router.push("/dashboard/anime");
    } catch (error) {
      // Tampilkan pesan error jika request gagal
      message.error("Failed to add anime");
    }
  };

  return (
    <>
      <div className="mb-2 bg-[#005B50] p-2 rounded-md font-semibold text-lg text-white">
        Add Anime
      </div>
      <Form
        layout="vertical"
        form={form}
        onFinish={showPostConfirm}
        onValuesChange={onValuesChange}
      >
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

          {/* Input watch link */}
          <Form.Item
            label="Watch Link"
            name="watch_link"
            rules={[{ required: true, message: "Please input watch link" }]}
          >
            <Input placeholder="Input watch link" />
          </Form.Item>

          {/* Input synopsis */}
          <Form.Item
            name="synopsis"
            label="Synopsis"
            rules={[{ required: true, message: "Please input synopsis" }]}
          >
            <Input.TextArea showCount maxLength={9999} autoSize />
          </Form.Item>

          {/* Select genre */}
          <Form.Item
            label="Genre (Select More Than One)"
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

          {/* Upload Image Cover */}
          <Form.Item
            name="photo_cover"
            rules={[{ required: true, message: "Please input image cover" }]}
            label="Upload Cover Image"
            getValueFromEvent={normFile}
          >
            <Upload listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          {/* Upload Image */}
          <Form.Item
            name="photos_anime"
            label="Upload Photo Anime"
            getValueFromEvent={normFile}
          >
            <Upload listType="picture" maxCount={4}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <div className="mt-2 bg-[#005B50] p-2 gap-2 rounded-md justify-end flex">
          <a href="/dashboard/anime">
            <div className="flex gap-1 bg-white text-[#005B50] px-3 py-1 rounded-md items-center hover:text-blue-500">
              <LeftCircleOutlined className="mr-1" style={{ fontSize: 18 }} />
              <span>Back</span>
            </div>
          </a>
          {loading ? (
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded-md items-center"
            >
              <LoadingOutlined className="mr-1" style={{ fontSize: 18 }} />
              Loading
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded-md items-center hover:text-black"
            >
              Submit
            </button>
          )}
        </div>
      </Form>
    </>
  );
}
