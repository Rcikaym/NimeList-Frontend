"use client";

import React, { useEffect, useState, memo } from "react";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal } from "antd";
import { CommentDataType, CommentType, TopicType } from "./types";
import apiUrl from "@/hooks/api";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import CommentList from "./ComemntComponent";
import { TopicMetadata } from "./TopicMetadata";
import PhotoGalleryTopic from "./PhotoGalleryComponent";
import TopicBody from "./TopicBodyComponent";

export default function TopicDetails({ slug }: { slug: string }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [idComment, setIdComment] = useState<string>("");
  const { confirm } = Modal;
  const [modalEdit, setModalEdit] = useState(false);
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
        `/comment/get/by-topic/${id_topic}?page=${page}&limit=5`
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
      const updatedData = form.getFieldsValue();
      const res = await apiUrl.put(`/comment/update/${idComment}`, updatedData);

      // Proses berhasil
      message.success(res.data.message);
      form.resetFields();

      // Perbarui comment di state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === idComment
            ? {
                ...comment,
                ...updatedData,
                updated_at: new Date().toISOString(),
              }
            : comment
        )
      );
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
          <TopicMetadata topic={topic} />
          <div className="mt-4">
            <PhotoGalleryTopic photos={photos} title={title} />
          </div>
        </div>

        <div className="m-6">
          <TopicBody content={body} />
        </div>

        {/* Comment List */}
        <CommentList
          comments={comments}
          hasMore={hasMore}
          totalReview={totalComment}
          onLoadMore={() => setPage((prev) => prev + 1)}
          onEdit={setModalAndDataForUpdate}
          onDelete={showDeleteConfirm}
        />
      </div>
    </>
  );
}
