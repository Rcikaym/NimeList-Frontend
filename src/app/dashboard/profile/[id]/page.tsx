import apiUrl from "@/hooks/api";
import { useEffect, useState } from "react";

interface ProfileAdminDetail {
  id: string;
  username: string;
  email: string;
  photo: string;
  role: string;
}

const ProfileAdminDetail = ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<ProfileAdminDetail | null>(null);

  const adminDetail = async () => {
    try {
      const res = await apiUrl.get(`/user/detail-admin/${params.id}`);
      setProfile(await res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    adminDetail();
  }, []);

  return <></>;
};

export default ProfileAdminDetail;
