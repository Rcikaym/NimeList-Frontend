"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { LeftCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import {
  AiOutlineClockCircle,
  AiOutlineComment,
  AiOutlineDislike,
  AiOutlineLike,
  AiOutlineLoading,
  AiOutlineLoading3Quarters,
  AiOutlineTag,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";

// Types moved to a separate file to reduce bundle size
import renderDateTime from "@/components/FormatDateTime";
import { TopicType } from "./types";
import Image from "next/image";
import TopicBody from "./TopicBodyComponent";

// Memoized components
const MemoizedImage = memo(Image);
const MemoizedButton = memo(Button);
const api = process.env.NEXT_PUBLIC_API_URL;

const AnimeMetadata = memo(({ topic }: { topic: TopicType }) => (
  <>
    <div className="flex justify-between">
      <div className="flex gap-4">
        <div className="flex">
          <AiOutlineUser className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1 text-small">
            <span className="text-gray-800">:</span>
            <span className="text-gray-800">{topic.user}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineLike className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1 text-small">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.totalLikes}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineDislike className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1 text-small">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.totalDislikes}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineTag className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1 text-small">
            <h2 className="text-gray-800">:</h2>
            <span className="text-gray-800">{topic.anime}</span>
          </div>
        </div>
        <div className="flex">
          <AiOutlineComment className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1 text-small">
            <span className="text-gray-800">:</span>
            <span className="text-gray-800">{topic.totalComments}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex">
          <div className="flex gap-1 text-small text-gray-400">
            <AiOutlineClockCircle size={20} />
            <span>{renderDateTime(topic.created_at)}</span>
          </div>
        </div>
        <div className="flex">
          <div className="flex gap-1 text-small text-gray-400">
            <AiOutlineTool size={20} />
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
            src={`${api}/${photo.file_path.replace(/\\/g, "/")}`}
            alt={`${title} - Photo ${index + 1}`}
            className="rounded-sm shadow-md hover:shadow-xl transition-shadow"
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

  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${api}/topic/get/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch topic data");
        }

        setTopic(await response.json());
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching topic:", error);
        setError("Failed to fetch topic data");
      }
    };

    fetchTopic();
  }, [id]);

  if (loading)
    return (
      <div>
        Loading <LoadingOutlined size={20} />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!topic) return <div>No topic data found</div>;

  const { title, body, photos, created_at, updated_at } = topic;

  return (
    <>
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-[#005b50] text-white">
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
          <div className="text-gray-600">
            <TopicBody content={body} />
          </div>
        </div>
      </div>

      <div className="p-2 flex justify-end text-lg font-semibold mt-3 rounded-lg bg-[#005B50]">
        <MemoizedButton icon={<LeftCircleOutlined />} href="/dashboard/topic">
          Back
        </MemoizedButton>
      </div>
    </>
  );
}
