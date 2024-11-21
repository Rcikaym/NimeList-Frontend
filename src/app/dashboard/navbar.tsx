import { useEffect, useState } from "react";
import { Dropdown, Layout, message } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import { getAccessToken, removeAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { BiHomeAlt, BiLogOut, BiSolidUserDetail } from "react-icons/bi";
import apiUrl from "@/hooks/api";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [idUser, setIdUser] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      const decodedToken: { username: string; userId: string; role: string } =
        jwtDecode(token);

      if (decodedToken.role === "admin") {
        setUsername(decodedToken.username);
        setIdUser(decodedToken.userId);
        getPhotoUrl(decodedToken.userId);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await removeAccessToken();
      message.success(response.message);
      router.push("/home");
    } catch (error) {
      message.error("Failed to logout");
      console.error(error);
    }
  };

  const getPhotoUrl = async (id: string) => {
    const get = await apiUrl.get(`/photo-profile/get`);
    setPhotoUrl(await get.data);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a href={`/dashboard/profile/detail`}>Profile</a>,
      icon: <BiSolidUserDetail size={17} />,
    },
    {
      key: "2",
      label: <a href="/home">Home</a>,
      icon: <BiHomeAlt size={17} />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: <button onClick={handleLogout}>Logout</button>,
      icon: <BiLogOut size={17} />,
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        backgroundColor: "#005B50",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <span className="mr-3 text-white">{username}</span>
      <Dropdown menu={{ items }} placement="bottomRight">
        <div className="flex items-center mr-3 w-8 h-8">
          <Image
            src={
              photoUrl
                ? `http://localhost:4321/${photoUrl.replace(/\\/g, "/")}`
                : "/images/logo-admin.jpeg"
            }
            alt="User Profile"
            width={32}
            height={32}
            className="rounded-full object-cover hover:cursor-pointer"
          />
        </div>
      </Dropdown>
    </Header>
  );
};

export default Navbar;
