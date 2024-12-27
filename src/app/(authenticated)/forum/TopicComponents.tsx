"use client";
import { TopicType } from "./types";
import { useState, useEffect } from "react";
import axios from "axios";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";

const TopicComponents: React.FC = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchTopics = async () => {
    try {
      setLoading(true); // Jika menggunakan state untuk loading
      const token = localStorage.getItem("access_token"); // Pastikan token tersimpan di localStorage

      // Request dengan Axios
      const response = await axios.get(`${api}/topic/get-all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token di header
        },
      });

      setTopics(response.data); // Set state topics dengan data dari response
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setLoading(false);
    }
  };

  // Panggil fetchTopics di useEffect
  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-1">
      {topics.map((topic: TopicType) => (
        <div
          key={topic.id}
          className="bg-black text-white p-4 border-t-1 border-t-[#00ff88]"
        >
          <div className="flex items-center mb-2">
            <img
              src={topic.photo_profile || "/images/boy.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex text-center space-x-2">
              <p className="text-lg font-bold my-auto">{`@${topic.username}`}</p>
              <div className="flex items-center text-sm bg-[#001f12] text-[#00ff88] px-2 py-1 rounded-md">
                {/* <span className="mr-1">{badges[topic.badge]}</span> */}
                <span>{topic.badge}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300">{topic.title}</p>
          <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
            <div className="flex items-center gap-4">
              <button className="flex items-center">
                <BiLike className="mr-1 w-5 h-5" /> {topic.totalLikes || "0"}
              </button>
              <button className="flex items-center">
                <BiDislike className="mr-1 w-5 h-5" /> {topic.totalDislikes || "0"}
              </button>
            </div>
            <span>{topic.created_at}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicComponents;
