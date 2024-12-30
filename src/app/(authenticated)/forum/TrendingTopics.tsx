import { useEffect, useState } from "react";
import { TopicType } from "./types";
import axios from "axios";
import { Skeleton } from "@nextui-org/react";

const TrendingTopics: React.FC = () => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <ul className="place-items-start grid grid-rows-1 sm:grid-rows-1 md:grid-rows-2 lg:grid-rows-3 xl:grid-rows-4 gap-3 p-4 underline text-green-500">
      {loading
        ? Array.from({ length: 10 }).map((_, index) => (
            <li key={index} className="w-full">
              <Skeleton
                isLoaded={!loading}
                className="w-full h-6 p-2 rounded-md dark:bg-slate-50"
                // classNames={{
                //   base: "dark:bg-gray-500",
                //   content: "dark:bg-gray-700",
                // }}
              >
                <div className="h-6 rounded-md bg-secondary" />
              </Skeleton>
            </li>
          ))
        : topics
            .sort((a, b) => b.likes - a.likes)
            .map((topic, index) => (
              <li
                key={topic.id}
                className="text-green-500 list-decimal line-clamp-1"
              >
                {index + 1}. {topic.title}
              </li>
            ))}
    </ul>
  );
};

export default TrendingTopics;
