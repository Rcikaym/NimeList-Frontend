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
import { ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { useRouter } from "next/navigation";
import { DataAnime, GenreType, PhotosType } from "./types";
import apiUrl from "@/hooks/api";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";

export default function AnimeEdit({ slug }: { slug: string }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [animeId, setAnimeId] = useState<string | null>(null);
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [type, setType] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
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
        const response = await fetch(`${api}/anime/get/${slug}`, {
          method: "GET",
        });
        const data = await response.json();
        const animeData = data.anime;

        // Set data foto ke setter dari fileList
        setFileList(
          animeData.photos.map((photo: string, index: number) => ({
            uid: index + 1, // Unique identifier
            name: `${photo}`, // Extract filename from file_path
            status: "done",
            url: `${api}/${photo}`,
          }))
        );

        // Set data ke dalam form
        form.setFieldsValue({
          title: animeData.title,
          release_date: animeData.release_date,
          synopsis: animeData.synopsis,
          trailer_link: animeData.trailer_link,
          watch_link: animeData.watch_link,
          genres: data.genres.map((genre: GenreType) => genre.id),
          type: animeData.type,
          episodes: animeData.episodes,
        });

        setAnimeId(animeData.id);
        setError(null);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setError("Failed to fetch anime data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [slug, form]);

  // Fetch genres
  useEffect(() => {
    const fetchGenre = async () => {
      const response = await fetch(`${api}/genre/get-all`, {
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

    function convertToEmbedUrl(url: string) {
      // Regular expression to match YouTube video IDs
      const videoIdMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );

      // Check if the video ID was found
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Return null or the original URL if it's not a valid YouTube link
      return null;
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

    fileCover?.forEach((file: any) => {
      formData.append("photo_cover", file.originFileObj);
    });

    // Tambahkan file foto anime (bisa lebih dari 1)
    fileList?.forEach((file: any) => {
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
      const update = await apiUrl.put(
        `${api}/anime/update/${animeId}`,
        formData
      );
      const res = await update.data;
      router.push("/dashboard/anime");
      message.success(res.message);
      setLoading(false);
    } catch (error) {
      message.error(`Failed to update anime: ${error}`);
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showEditConfirm = async () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataAnime) => {
        confirm({
          centered: true,
          title: "Do you want to update this anime?",
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

      // Hapus file dengan status "error" setelah state di-update
      setTimeout(() => {
        setFileList((currentList) =>
          currentList.filter((f: any) => f.uid !== file.uid)
        );
      }, 1000); // Tambahkan jeda 1 detik untuk memastikan efek UI
    }
  };

  const handleCoverUpload = (info: any) => {
    const { file, fileList } = info;

    setFileCover(fileList);
    if (file.status === "done") {
      setFileList(fileList.filter((f: any) => f.status === "done"));
      message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);

      // Hapus file dengan status "error" setelah state di-update
      setTimeout(() => {
        setFileCover((currentList) =>
          currentList.filter((f: any) => f.uid !== file.uid)
        );
      }, 1000); // Tambahkan jeda 1 detik untuk memastikan efek UI
    }
  };

  const uploadPropsList: UploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        // Hapus file dengan status "error" setelah state di-update
        setTimeout(() => {
          setFileList((currentList) =>
            currentList.filter((f: any) => f.uid !== file.uid)
          );
        }, 1000); // Tambahkan jeda 1 detik untuk memastikan efek UI
      }

      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        // Hapus file dengan status "error" setelah state di-update
        setTimeout(() => {
          setFileList((currentList) =>
            currentList.filter((f: any) => f.uid !== file.uid)
          );
        }, 1000); // Tambahkan jeda 1 detik untuk memastikan efek UI
      }

      return isJpgOrPng && isLt2M;
    },
    onChange: handlePhotosUpload,
  };

  const uploadPropsCover: UploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");

        // Hapus file dengan status "error" setelah state di-update
        setTimeout(() => {
          setFileCover((currentList) =>
            currentList.filter((f: any) => f.uid !== file.uid)
          );
        }, 1000); // Tambahkan jeda 1 detik untuk memastikan efek UI
      }

      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");

        // Hapus file dengan status "error" setelah state di-update
        setTimeout(() => {
          setFileCover((currentList) =>
            currentList.filter((f: any) => f.uid !== file.uid)
          );
        }, 1000); // Tambahkan jeda 1 detik untuk memastikan efek UI
      }

      return isJpgOrPng && isLt2M;
    },
    onChange: handleCoverUpload,
  };

  return (
    <>
      <div className="mb-2 bg-[#005B50]  p-2 rounded-md font-semibold text-lg text-white">
        Anime Edit Form
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={showEditConfirm}
        onValuesChange={onValuesChange}
      >
        <div className="rounded-sm shadow-md p-4">
          {/* Form Items */}
          <div className="grid grid-cols-3 gap-7">
            <div>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please input title" }]}
              >
                <Input placeholder="Input title" />
              </Form.Item>

              <Form.Item
                name="release_date"
                label="Release Date (yyyy-mm-dd)"
                rules={[{ required: true, message: "Please input date" }]}
              >
                <Input placeholder="yyyy-mm-dd" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="trailer_link"
                label="Trailer Link"
                rules={[
                  { required: true, message: "Please input trailer link" },
                ]}
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
            </div>
            <div>
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
            </div>
          </div>

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
            <Select
              placeholder="Select genres"
              allowClear
              mode="multiple"
              showSearch
              filterOption={(input, option: any) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={genres.map((genre) => ({
                value: genre.id,
                label: genre.name,
              }))}
              style={{ width: "100%" }}
            ></Select>
          </Form.Item>

          {/* Upload Cover */}
          <Form.Item name="photo_cover" label="Update Cover Image">
            <Upload
              {...uploadPropsCover}
              listType="picture"
              maxCount={1}
              fileList={fileCover}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="photos_anime" label="Upload Photo Anime">
            <Upload
              {...uploadPropsList}
              listType="picture-card"
              maxCount={4}
              multiple
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="mt-2 bg-[#005B50] p-2 gap-2 rounded-md justify-between flex">
          <Link
            href="/dashboard/anime"
            className="bg-white text-black px-2 py-1 rounded-md flex items-center gap-1 hover:text-[#005B50]"
          >
            <BiArrowBack style={{ fontSize: "20px" }} />
          </Link>
          <Button type="primary" htmlType="submit" loading={loading}>
            <span>Update</span>
          </Button>
        </div>
      </Form>
    </>
  );
}
