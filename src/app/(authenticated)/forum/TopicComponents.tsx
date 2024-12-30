"use client";
import { TopicType } from "./types";
import { useState, useEffect } from "react";
import axios from "axios";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import apiUrl from "@/hooks/api";
import { Spinner } from "@nextui-org/react";
import { label } from "framer-motion/client";
import renderDateTime from "@/utils/FormatDateTime";
import timeToDay from "@/utils/TimeToDay";

const TopicComponents: React.FC = () => {
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchTopics = async () => {
    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${api}/topic/get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTopics(response.data);
      setLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching topics:", error);
      setLoading(false); // End loading even if there is an error
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleLike = async (id_topic: string) => {
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${api}/like-topic/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ id_topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error liking topic:", errorData.message);
        alert(`Failed to like the topic: ${errorData.message}`);
        return;
      }

      setIsLiked(true); // Update liked state
    } catch (error) {
      console.error("Error while liking topic:", error);
      alert("An error occurred while liking the topic.");
    }
  };

  const handleUnlike = async (id_topic: string) => {
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${api}/like-topic/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ id_topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to unlike the topic: ${errorData.message}`);
        return;
      }

      setIsLiked(false); // Update unliked state
    } catch (error) {
      alert("An error occurred while unliking the topic.");
    }
  };

  const handleDislike = async (id_topic: string) => {
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${api}/dislike-topic/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ id_topic }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error disliking topic:", errorData.message);
      }
    } catch (error) {
      console.error("Error while disliking topic:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      {loading ? (
        <div className="flex justify-center items-center space-x-4 h-screen">
          {/* Loading Spinner */}
          <Spinner
            color="primary"
            labelColor="foreground"
            label="Loading Topics..."
            size="lg"
            classNames={{ label: "text-white" }}
          />
        </div>
      ) : (
        topics.map((topic: TopicType) => (
          <div
            key={topic.id}
            className="bg-black text-white p-4 border-t-1 border-t-[#00ff88]"
          >
            <div className="flex items-center">
              <img
                src={topic.photo_profile || "/images/boy.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full mr-3 mt-3"
              />
              <div className="flex text-center space-x-2">
                <p className="text-lg font-bold my-auto">{`@${topic.user_username}`}</p>
                <div className="flex items-center text-sm bg-[#001f12] text-[#00ff88] px-2 py-1 rounded-md">
                  <span>{topic.user_badge}</span>
                </div>
              </div>
              {topic.created_at === topic.updated_at ? (
                <span className="text-gray-400 text-sm ml-3">
                  {timeToDay(topic.created_at)}
                </span>
              ) : (
                <span className="text-gray-400 text-sm ml-3">{`${timeToDay(
                  topic.updated_at
                )} (Edited)`}</span>
              )}
            </div>
            <p className="text-gray-300 p-2 pl-3 ml-12 mb-0">{topic.title}</p>
            <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
              <div className="ml-14 flex items-center gap-4">
                <button
                  className="flex items-center"
                  onClick={() =>
                    isLiked ? handleUnlike(topic.id) : handleLike(topic.id)
                  }
                >
                  {isLiked ? (
                    <BiSolidLike className="mr-1 w-5 h-5" />
                  ) : (
                    <BiLike className="mr-1 w-5 h-5" />
                  )}
                  {topic.likes}
                </button>
                <button
                  className="flex items-center"
                  onClick={() => handleDislike(topic.id)}
                >
                  <BiDislike className="mr-1 w-5 h-5" /> {topic.dislikes || "0"}
                </button>
              </div>
              <span>{renderDateTime(topic.created_at)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopicComponents;
