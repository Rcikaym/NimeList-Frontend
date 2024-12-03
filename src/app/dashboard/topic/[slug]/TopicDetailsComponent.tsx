"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import {
  ExclamationCircleOutlined,
  LeftCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import axios from "axios";
import {
  AiOutlineClockCircle,
  AiOutlineComment,
  AiOutlineDislike,
  AiOutlineLike,
  AiOutlineTag,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";

// Types moved to a separate file to reduce bundle size
import renderDateTime from "@/components/FormatDateTime";
import { CommentType, TopicType } from "./types";
import Image from "next/image";
import TopicBody from "./TopicBodyComponent";
import apiUrl from "@/hooks/api";
import {
  BiArrowBack,
  BiCrown,
  BiEdit,
  BiHeart,
  BiTrashAlt,
} from "react-icons/bi";
import Link from "next/link";
import timeToDay from "@/utils/TimeToDay";

// Memoized components
const MemoizedImage = memo(Image);
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

export default function TopicDetails({ slug }: { slug: string }) {
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [idComment, setIdComment] = useState<string>("");
  const { confirm } = Modal;
  const [modalEdit, setModalEdit] = useState(false);

  const fetchTopic = async () => {
    setLoading(true);
    try {
      const response = await apiUrl.get(`/topic/get/${slug}`);
      if (!response) {
        throw new Error("Failed to fetch topic data");
      }

      setTopic(await response.data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topic:", error);
      setError("Failed to fetch topic data");
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [slug]);

  const setModalAndDataForUpdate = async (id: string) => {
    setModalEdit(true);
    setIdComment(id);

    const res = await apiUrl.get(`/comment/get/${id}`);
    const data = await res.data;
    form.setFieldsValue({
      comment: data.comment,
    });
  };

  const handleEditComment = async () => {
    try {
      const res = await apiUrl.put(
        `/comment/update/${idComment}`,
        form.getFieldsValue()
      );
      message.success(res.data.message);
      form.resetFields();
      fetchTopic();
    } catch (error) {
      message.error("Failed to update comment");
    }
  };

  const showEditConfirm = async () => {
    setModalEdit(false);
    confirm({
      title: "Are you sure edit this comment?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: "Yes",
      okType: "danger",
      onOk() {
        handleEditComment();
      },
      onCancel() {
        setModalEdit(true);
      },
    });
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await apiUrl.delete(`/comment/delete/${id}`);
      message.success(res.data.message);
      fetchTopic();
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

  const { title, body, photos, created_at, updated_at } = topic;

  return (
    <>
      <Modal
        title="Update Review"
        centered
        open={modalEdit}
        onOk={showEditConfirm}
        onCancel={() => setModalEdit(false)}
      >
        <Form form={form} layout="vertical">
          {/* Input review */}
          <Form.Item
            label="Comment"
            name="comment"
            rules={[{ required: true, message: "Please input comment" }]}
          >
            <Input.TextArea showCount maxLength={9999} autoSize />
          </Form.Item>
        </Form>
      </Modal>
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-[#005b50] text-white">
        Topic Details
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 mt-3">
          <h1 className="text-3xl font-bold">{title}</h1>
          <AnimeMetadata topic={topic} />
          <div className="mt-4">
            <PhotoGallery photos={photos} title={title} />
          </div>
        </div>

        {/* Body */}
        <div className="m-6">
          <TopicBody content={body} />
        </div>

        <div className="mt-6 p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold select-none">
              {topic.totalComments} COMMENTS
            </h2>
          </div>
          {topic.totalComments === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul>
              {topic.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="container border rounded-lg border-emerald-500 p-5 my-5 flex items-center justify-between"
                >
                  <div>
                    <div className="flex gap-2 items-center">
                      <div className="font-bold flex bg-[#005b50] p-2 gap-1 w-fit rounded-md mb-2">
                        <span className="text-white">{comment.name}</span>
                        <BiCrown size={15} className="text-yellow-300" />
                      </div>
                      <p className="text-[0.75rem] text-gray-500">
                        {comment.created_at === comment.updated_at
                          ? timeToDay(comment.created_at)
                          : `${timeToDay(comment.created_at)} (diedit)`}
                      </p>
                    </div>
                    <p>{comment.comment}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <BiHeart size={20} />
                      <span>{comment.total_likes}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-fit cursor-pointer"
                      onClick={() => setModalAndDataForUpdate(comment.id)}
                    >
                      <BiEdit size={23} className="text-emerald-700" />
                    </div>
                    <div
                      className="w-fit cursor-pointer"
                      onClick={() => showDeleteConfirm(comment.id)}
                    >
                      <BiTrashAlt size={23} className="text-emerald-700" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="p-2 flex justify-end mt-3 rounded-lg bg-[#005B50]">
        <Link
          href="/dashboard/topic"
          className="bg-white text-black px-2 py-1 rounded-md flex items-center gap-1 hover:text-[#005B50]"
        >
          <BiArrowBack style={{ fontSize: "20px" }} />
        </Link>
      </div>
    </>
  );
}
