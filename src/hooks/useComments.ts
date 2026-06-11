import { useState } from "react";
import apiUrl from "@/hooks/api";
import { Comment } from "../app/(authenticated)/forum/topic/types";

export function useComments(api: string | undefined) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [totalComments, setTotalComments] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [submittingComment, setSubmittingComment] = useState(false);

  function transformComment(c: any): Comment {
    return {
      id: c.id,
      user: c.username,
      avatar: c.user_photo
        ? c.user_photo.startsWith("http") ? c.user_photo : `${api}/${c.user_photo}`
        : undefined,
      badge: c.user_badge,
      content: c.comment,
      created_at: c.created_at,
      likes: c.total_likes || 0,
    };
  }

  async function fetchComments(topicId: string, page = 1) {
    const res = await apiUrl.get(`/comment/get/by-topic/${topicId}?page=${page}`);
    const data = res?.data?.data || [];
    const total = res?.data?.total || 0;
    setTotalComments(total);
    setCommentPage(page);
    const transformed = data.map(transformComment);
    if (page === 1) setComments(transformed);
    else setComments((prev) => [...prev, ...transformed]);
  }

  async function loadMore(topicId: string) {
    await fetchComments(topicId, commentPage + 1);
  }

  async function postComment(topicId: string, text: string) {
    setSubmittingComment(true);
    try {
      await apiUrl.post("/comment/post", { id_topic: topicId, comment: text });
      await fetchComments(topicId, 1);
    } finally {
      setSubmittingComment(false);
    }
  }

  async function deleteComment(id: string) {
    await apiUrl.delete(`/comment/delete/${id}`);
    setComments((prev) => prev.filter((c) => c.id !== id));
    setTotalComments((prev) => Math.max(0, prev - 1));
  }


  async function toggleCommentLike(id: string) {
    const isLiked = likedComments.has(id);
    try {
      if (isLiked) {
        await apiUrl.delete("/like-comment/delete", { data: { id_comment: id } });
        setLikedComments((prev) => { const s = new Set(prev); s.delete(id); return s; });
        setComments((prev) => prev.map((c) => c.id === id ? { ...c, likes: c.likes - 1 } : c));
      } else {
        await apiUrl.post("/like-comment/post", { id_comment: id });
        setLikedComments((prev) => new Set(prev).add(id));
        setComments((prev) => prev.map((c) => c.id === id ? { ...c, likes: c.likes + 1 } : c));
      }
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
    }
  }

  return {
    comments, likedComments, totalComments, submittingComment,
    fetchComments, loadMore, postComment, deleteComment, toggleCommentLike,
  };
}