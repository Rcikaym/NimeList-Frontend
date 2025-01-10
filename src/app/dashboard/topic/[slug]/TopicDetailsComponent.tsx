"use client";

import React, { useEffect, useState, memo } from "react";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import { CommentDataType, CommentType, TopicType } from "./types";
import apiUrl from "@/hooks/api";
import CommentList from "./ComemntComponent";
import { TopicMetadata } from "./TopicMetadata";
import PhotoGalleryTopic from "./PhotoGalleryComponent";
import TopicBody from "./TopicBodyComponent";

const { confirm } = Modal;

export default function TopicDetails({ slug }: { slug: string }) {
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState<CommentDataType[]>([]);
  const [totalComment, setTotalComment] = useState(0);

  const fetchTopic = async () => {
    setLoading(true);
    try {
      const response = await apiUrl.get(`/topic/get/${slug}`);
      if (!response) {
        throw new Error("Failed to fetch topic data");
      }

      setTopic(await response.data);
      fetchComment(page, response.data.id);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topic:", error);
      setError("Failed to fetch topic data");
    }
  };

  const fetchComment = async (page: number, id_topic?: string) => {
    try {
      const response = await apiUrl.get(
        `/comment/get/by-topic/${id_topic}?page=${page}`
      );
      const res: CommentType = await response.data;
      console.log(res.data.length);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setTotalComment(res.total);
        setComments((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching review:", error);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [slug]);

  useEffect(() => {
    if (topic?.id && page > 1) {
      setTimeout(() => fetchComment(page, topic.id), 500);
    }
  }, [page, topic?.id]);

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await apiUrl.delete(`/comment/delete/${id}`);
      message.success(res.data.message);
      // Perbarui review di state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );

      // Perbarui total review di state
      setTotalComment((prevTotal) => prevTotal - 1);
    } catch (error) {
      message.error("Failed to delete comment");
    }
  };

  const showDeleteConfirm = async (id: string) => {
    confirm({
      title: "Are you sure delete this comment?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: "Yes",
      okType: "danger",
      onOk() {
        handleDeleteComment(id);
      },
    });
  };

  if (loading)
    return (
      <div>
        Loading <LoadingOutlined size={20} />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!topic) return <div>No topic data found</div>;

  const { title, body, photos } = topic;

  return (
    <>
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-[#005b50] text-white">
        Topic Details
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 mt-3">
          <h1 className="text-3xl font-bold">{title}</h1>
          <TopicMetadata topic={topic} />
          <div className="mt-4">
            <PhotoGalleryTopic photos={photos} slug={slug} />
          </div>
        </div>

        <div className="m-6">
          <TopicBody content={body} />
        </div>

        {/* Comment List */}
        <CommentList
          comments={comments}
          hasMore={hasMore && comments.length < totalComment}
          totalReview={totalComment}
          onLoadMore={() => setPage((prev) => prev + 1)}
          onDelete={showDeleteConfirm}
        />
      </div>
    </>
  );
}
