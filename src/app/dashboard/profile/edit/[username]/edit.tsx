"use client";

import apiUrl from "@/hooks/api";
import {
  CameraOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Upload, UploadProps } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileAdminDetail {
  id: string;
  username: string;
  photo_profile: string;
  bio: string;
  name: string;
}

interface DataProfile {
  username: string;
  name: string;
  bio: string;
}

const ProfileAdminEdit = ({ username }: { username: string }) => {
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photo, setPhoto] = useState([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const setForm = async () => {
    try {
      const res = await apiUrl.get<ProfileAdminDetail>(
        `/user/profile/${username}`
      );
      const data = res.data;
      form.setFieldsValue({
        username: data.username,
        bio: data.bio,
        name: data.name,
      });
      setPhotoUrl(data.photo_profile);
    } catch (error) {
      message.error("Error set data");
    }
  };

  const handleSubmit = async (values: DataProfile) => {
    try {
      const formData = new FormData();

      photo.forEach((file: any) => {
        formData.append("photo_profile", file.originFileObj);
      });
      formData.append("username", values.username);
      formData.append("bio", values.bio);
      formData.append("name", values.name);

      const update = await apiUrl.put(`/user/update-profile`, formData);
      const res = await update.data;
      message.success(res.message);
      router.push(`/dashboard/profile/${username}`);
    } catch (error) {
      message.error("Failed to update profile");
      console.log(error);
    }
  };

  const showUpdateConfirm = async () => {
    form
      .validateFields() // Validasi input form terlebih dahulu
      .then((values: DataProfile) => {
        confirm({
          centered: true,
          title: "Do you want to update this profile ?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            return handleSubmit(values);
          },
        });
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  useEffect(() => {
    setForm();
  }, []);

  // Menampilkan preview gambar
  const handlePreview = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string); // Mengatur previewImage dengan hasil pembacaan
    reader.readAsDataURL(file);
  };

  // Menghandle perubahan pada file upload
  const beforeUpload = (file: any) => {
    handlePreview(file); // Tampilkan preview saat file dipilih
    return true; // Izinkan file di-upload
  };

  const handlePhotoUpload = (info: any) => {
    console.log(info);
    const { file, fileList } = info;

    setPhoto(fileList);
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
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
      <Form layout="vertical" form={form} onFinish={showUpdateConfirm}>
        <Form.Item name="photo_profile">
          <Upload
            {...uploadProps}
            maxCount={1}
            showUploadList={false}
            onChange={handlePhotoUpload}
            beforeUpload={beforeUpload}
          >
            {previewImage ? (
              <div className="mt-4 relative w-44 h-44">
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  className="rounded-full object-cover"
                  layout="fill"
                />
                {/* Ikon kamera saat hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity duration-300">
                  <CameraOutlined className="text-white text-4xl" />
                </div>
              </div>
            ) : photoUrl ? (
              photoUrl && (
                <div className="mt-4 relative w-44 h-44">
                  <Image
                    src={`${api}/${photoUrl}`}
                    alt="Profile"
                    className="rounded-full object-cover"
                    layout="fill"
                  />
                  {/* Ikon kamera saat hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity duration-300">
                    <CameraOutlined className="text-white text-4xl" />
                  </div>
                </div>
              )
            ) : (
              <div className="mt-4 relative w-44 h-44">
                <Image
                  src="/images/logo-admin.jpeg"
                  alt="Profile"
                  className="rounded-full object-cover"
                  layout="fill"
                />
                {/* Ikon kamera saat hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity duration-300">
                  <CameraOutlined className="text-white text-4xl" />
                </div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <span className="text-sm text-gray-400">
          Mendukung format JPG/PNG, paling banyak 2M
        </span>
        <Form.Item
          name="username"
          label="Username"
          className="mt-5"
          rules={[{ required: true, message: "Please input username" }]}
        >
          <Input placeholder="Input username" max={30} showCount />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          className="mt-5"
          rules={[{ required: true, message: "Please input name" }]}
        >
          <Input placeholder="Input name" max={30} showCount />
        </Form.Item>
        <Form.Item name="bio" label="Bio">
          <Input.TextArea
            autoSize
            placeholder="Input bio"
            maxLength={250}
            showCount
          />
        </Form.Item>
        <div className="flex justify-between">
          <Button
            href={`/dashboard/profile/${username}`}
            color="default"
            className="mt-6"
          >
            Back
          </Button>
          <Button
            color="primary"
            variant="solid"
            className="mt-6"
            htmlType="submit"
          >
            Update
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ProfileAdminEdit;
