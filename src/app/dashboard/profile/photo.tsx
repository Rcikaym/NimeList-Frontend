import React, { useState } from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";
import { BiCamera } from "react-icons/bi";

interface PhotoProfileProps {
  initialPhotoUrl: string;
  onUpload: (file: File) => void;
}

const PhotoProfile: React.FC<PhotoProfileProps> = ({
  initialPhotoUrl,
  onUpload,
}) => {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj as File;
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative flex items-center justify-center w-36 h-36">
        {/* Foto Profil */}
        <img
          src={photoUrl === null ? "/images/logo-admin.jpeg" : photoUrl}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300"
        />

        {/* Tombol Upload di Kanan Bawah */}
        <Upload showUploadList={false} onChange={handleFileChange}>
          <button
            className="absolute bottom-1 right-1 bg-emerald-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-emerald-800"
            aria-label="Upload Profile Photo"
          >
            <BiCamera size={17} />
          </button>
        </Upload>
      </div>
    </div>
  );
};

export default PhotoProfile;
