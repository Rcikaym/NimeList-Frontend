"use client";

import DisplayLongText from "@/components/DisplayLongText";
import apiUrl from "@/hooks/api";
import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiDiamond } from "react-icons/bi";

interface ProfileAdminDetail {
  username: string;
  photo_profile: string;
  bio: string;
  badge: string;
  name: string;
}

const ProfileAdminDetail = ({ username }: { username: string }) => {
  const [profile, setProfile] = useState<ProfileAdminDetail | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);

  const adminDetail = async () => {
    setLoading(true);
    try {
      const res = await apiUrl.get<ProfileAdminDetail>(
        `/user/profile/${username}`
      );
      const data = res.data;
      setProfile(data);
      setPhotoUrl(data.photo_profile);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching data profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    adminDetail();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoadingOutlined />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      {profile && (
        <>
          <div className="flex justify-start items-center w-full">
            <div className="w-40 h-40 relative">
              <Image
                src={`${api}/${profile.photo_profile}`}
                alt="Profile"
                className="rounded-full border-2 border-gray-300 m-0"
                loading="lazy"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col gap-2 ml-5">
              <div className="flex w-fit items-center gap-2 bg-[#005B50] rounded-md px-3 py-1 text-white">
                <span className="text-lg font-sans font-semibold">
                  {profile.name}
                </span>
                <BiDiamond size={20} />
              </div>
              <span className="text-sm">{`@${profile.username}`}</span>
            </div>
            <div className="ml-24">
              <Link
                href={`/dashboard/profile/edit/${profile.username}`}
                className="border border-emerald-600 rounded-md hover:bg-emerald-50 flex items-center justify-center px-7 py-2"
              >
                <span className="text-lg font-sans font-semibold text-emerald-700">
                  Edit Profile
                </span>
              </Link>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mt-10">Bio</h3>
            <div className="text-sm">
              {profile.bio === null || "" ? (
                "No bio"
              ) : (
                <DisplayLongText text={profile.bio} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileAdminDetail;
