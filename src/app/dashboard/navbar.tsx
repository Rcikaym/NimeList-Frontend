import { useEffect, useState } from "react";
import { Avatar, Dropdown, Layout } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import { getAccessToken, logout } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { BiHomeAlt, BiLogOut, BiSolidUserDetail } from "react-icons/bi";
import apiUrl from "@/hooks/api";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      const decodedToken: {
        name: string;
        username: string;
        userId: string;
        role: string;
      } = jwtDecode(token);

      console.log(jwtDecode(token));

      if (decodedToken.role === "admin") {
        setUsername(decodedToken.username);
        setName(decodedToken.name);
        getPhotoUrl(decodedToken.userId);
      }
    }
  }, []);

  const getPhotoUrl = async (id: string) => {
    const get = await apiUrl.get(`/photo-profile/get`);
    setPhotoUrl(await get.data);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a href={`/dashboard/profile/${username}`}>Profile</a>,
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
      label: <span>Logout</span>,
      icon: <BiLogOut size={17} />,
      onClick: () => logout(),
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
      <span className="text-white">{name}</span>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Avatar
          src={
            <Image
              src={`${api}/${photoUrl}`}
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full object-cover hover:cursor-pointer"
            />
          }
          size="large"
          className="mx-3"
        />
      </Dropdown>
    </Header>
  );
};

export default Navbar;
