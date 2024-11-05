"use client";

import DisplayLongText from "@/components/DisplayLongText";
import apiUrl from "@/hooks/api";
import { useEffect, useState } from "react";
import { BiCrown, BiShield, BiSolidShield } from "react-icons/bi";

interface ProfileAdminDetail {
  id: string;
  username: string;
  email: string;
  photo_profile: string;
  bio: string;
  badge: string;
}

const ProfileAdminDetail = ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<ProfileAdminDetail | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const idUser = params.id;

  const adminDetail = async () => {
    try {
      const res = await apiUrl.get<ProfileAdminDetail>(
        `/user/detail-admin/${params.id}`
      );
      const data = await res.data;
      setProfile(data);
      setBio(data.bio);
      setPhotoUrl(data.photo_profile);
      console.log(photoUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    adminDetail();
  }, []);

  return (
    <>
      {profile && (
        <>
          <div className="flex justify-start items-center gap-3 w-full h-fit">
            <div className="w-36 h-36">
              <img
                src={
                  photoUrl === null
                    ? "/images/logo-admin.jpeg"
                    : `${api}/${photoUrl.replace(/\\/g, "/")}`
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300 m-0"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2 m-0">
                <h3 className="text-black text-lg font-semibold m-0">
                  {profile.username}
                </h3>
                {profile && profile.badge === "NimeList Citizens" ? (
                  <div className="flex items-center gap-1 bg-emerald-700 rounded-md px-3 py-1 text-white">
                    <p className="text-small m-0">{profile.badge}</p>
                    <BiShield size={20} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-yellow-600 rounded-md px-3 py-1 text-white">
                    <p className="text-small m-0">{profile.badge}</p>
                    <BiCrown size={20} />
                  </div>
                )}
              </div>
              <p className="text-black text-sm mt-3">{profile.email}</p>
            </div>
            <div className="ml-20 ">
              <a
                href={`/dashboard/profile/edit/${params.id}`}
                className="border border-emerald-600 rounded-md hover:bg-emerald-50 flex items-center justify-center px-7 py-2"
              >
                <span className="text-lg font-sans font-semibold text-emerald-700">
                  Edit Profile
                </span>
              </a>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-black text-lg font-semibold mt-10">Bio</h3>
            <div className="text-black text-sm">
              <DisplayLongText text={bio} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileAdminDetail;
