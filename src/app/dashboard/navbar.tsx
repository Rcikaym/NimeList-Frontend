import { useEffect, useState } from "react";
import { Dropdown, Layout, message } from "antd";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import Image from "next/image";
import {
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
  removeAccessToken,
} from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (isAccessTokenExpired()) {
      refreshAccessToken();
    }
    const token = getAccessToken();

    if (token) {
      const decodedToken: { username: string } = jwtDecode(token);

      setUsername(decodedToken.username);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await removeAccessToken();
      message.success(response.message);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const items = [
    {
      key: "1",
      label: <a href="/dashboard/profile">Profile</a>,
      icon: <AiOutlineProfile size={17} />,
    },
    {
      key: "2",
      label: <button onClick={handleLogout}>Logout</button>,
      icon: <AiOutlineLogout size={17} />,
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
        <div className="flex items-center mr-3">
          <Image
            src="/images/logo-admin.jpeg"
            alt="User Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            width={32}
            height={32}
          />
        </div>
      </Dropdown>
    </Header>
  );
};

export default Navbar;
