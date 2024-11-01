import { useEffect, useState } from "react";
import { Dropdown, Layout } from "antd";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import Image from "next/image";

const { Header } = Layout;

const items = [
  {
    key: "1",
    label: <a href="/dashboard/profile">Profile</a>,
    icon: <AiOutlineProfile size={17} />,
  },
  {
    key: "2",
    label: <a href="http://localhost:4321/auth/logout">Logout</a>,
    icon: <AiOutlineLogout size={17} />,
  },
];

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      setUsername(decodedToken.username);
    }
  }, []);

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
