"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";
import axios from "axios";
import {
  AiOutlineCalendar,
  AiOutlineComment,
  AiOutlineLike,
  AiOutlineTag,
  AiOutlineUser,
} from "react-icons/ai";

// Types moved to a separate file to reduce bundle size
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import { TopicType } from "./types";

// Memoized components
const MemoizedImage = memo(Image);
const MemoizedButton = memo(Button);

const AnimeMetadata = memo(({ topic }: { topic: TopicType }) => (
  <>
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div className="flex">
          <AiOutlineUser className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.user}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineLike className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.totalLikes}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineTag className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.anime}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineComment className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.totalComments}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex">
          <div className="flex gap-1 text-small text-gray-400">
            <span>Created At:</span>
            <span>{renderDateTime(topic.created_at)}</span>
          </div>
        </div>
        <div className="flex">
          <div className="flex gap-1 text-small text-gray-400">
            <span>Updated At:</span>
            <span>{renderDateTime(topic.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  </>
));

const PhotoGallery = memo(
  ({ photos, title }: { photos: TopicType["photos"]; title: string }) => (
    <div className="flex gap-4 grid-cols-5">
      {photos?.map((photo, index) => (
        <div key={index}>
          <MemoizedImage
            src={`http://localhost:4321/${photo.file_path.replace(/\\/g, "/")}`}
            alt={`${title} - Photo ${index + 1}`}
            className="rounded-lg shadow-md hover:shadow-xl transition-shadow"
            height={160}
            width={260}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
);

export default function TopicDetails({ id }: { id: string }) {
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4321/topic/get/${id}`);
      setTopic(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching topic:", error);
      setError("Failed to fetch topic data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!topic) return <div>No topic data found</div>;

  const { title, body, photos, created_at, updated_at } = topic;

  return (
    <>
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-[#005b50]">
        Topic Details
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 mt-3">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <AnimeMetadata topic={topic} />
          <div className="mt-4">
            <PhotoGallery photos={photos} title={title} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Body</h2>
          <DisplayLongText text={body} />
        </div>
      </div>

      <div className="p-2 flex justify-end text-lg font-semibold mt-3 rounded-lg bg-[#005B50]">
        <MemoizedButton icon={<LeftCircleOutlined />} href="/dashboard/anime">
          Back
        </MemoizedButton>
      </div>
    </>
  );
}
