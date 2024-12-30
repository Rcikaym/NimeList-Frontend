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
import {
  ExclamationCircleFilled,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { useRouter } from "next/navigation";
import apiUrl from "@/hooks/api";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

interface DataAnime {
  title: string;
  synopsis: string;
  release_date: string;
  trailer_link: string;
  genres: [];
  photos_anime: string[];
  photo_cover: string[];
  type: string;
  episodes: number;
  watch_link: string;
}

interface DataGenre {
  id: string;
  name: string;
}

export default function AddAnime() {
  const router = useRouter();
  const [form] = Form.useForm(); // Form handler dari Ant Design
  const [genres, setGenres] = useState<DataGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [type, setType] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
  const [fileList, setFileList] = useState([]);
  const [fileCover, setFileCover] = useState([]);
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/genre/get-all`, {
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

  // Fungsi untuk menambahkan anime
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
    fileCover?.forEach((file: any) => {
      formData.append("photo_cover", file.originFileObj);
    });
    if (values.photo_cover && values.photo_cover.length > 0) {
    }

    // Tambahkan file foto anime (bisa lebih dari 1)
    fileList?.forEach((file: any) => {
      formData.append("photos_anime", file.originFileObj);
    });

    //Ubah format youtube link url menjadi embedUrl
    if (values.trailer_link) {
      const embedUrl = convertToEmbedUrl(values.trailer_link) ?? "";
      formData.append("trailer_link", embedUrl);
    }

    setLoading(true); // Set loading jadi true saat request dikirim
    try {
      // Kirim data menggunakan axios
      console.log("p proses kirim");
      const createData = await apiUrl.post(`/anime/post`, formData);
      const res = await createData.data;
      // Tampilkan pesan sukses jika request berhasil
      message.success(res.message);
      setLoading(false);
      router.push("/dashboard/anime");
    } catch (error) {
      // Tampilkan pesan error jika request gagal
      message.error("Failed to add anime");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showPostConfirm = async () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataAnime) => {
        confirm({
          centered: true,
          title: "Do you want to add an " + values.title + " ?",
          icon: <ExclamationCircleFilled />,
          async onOk() {
            console.log("p di pencet uy");
            setLoading(true); // Set status loading pada tombol OK

            return await addAnime(values)
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

    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
      setFileList(fileList);
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
      <div className="mb-2 bg-[#005B50] p-2 rounded-md font-semibold text-lg text-white">
        Add Anime
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={showPostConfirm}
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
          <Form.Item
            name="photo_cover"
            label="Upload Cover Image"
            rules={[{ required: true, message: "Please upload cover" }]}
          >
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
            <span>Submit</span>
          </Button>
        </div>
      </Form>
    </>
  );
}
