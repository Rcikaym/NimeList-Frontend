"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/utils/auth";
import { useTopic } from "../../../../hooks/useTopic";
import { useComments } from "../../../../hooks/useComments";
import TopicHeader from "./TopicHeader";
import CommentSection from "./CommentSection";
import TrendingSidebar from "./TrendingSidebar";

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const api = process.env.NEXT_PUBLIC_API_URL;

  const {
    topic,
    topicLiked,
    loading,
    error,
    fetchTopic,
    handleTopicLike,
    handleTopicDislike,
  } = useTopic();

  const {
    comments,
    likedComments,
    totalComments,
    submittingComment,
    fetchComments,
    loadMore,
    postComment,
    deleteComment,
    toggleCommentLike,
  } = useComments(api);

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        setCurrentUser(decoded.username);
      } catch {
        // invalid token
      }
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetchTopic(slug).then((topicId) => {
      if (topicId) fetchComments(topicId, 1);
    });
  }, [slug]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    await postComment(topic.id, newComment);
    setNewComment("");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#009951", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-slate-500">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-sm">
          Failed to load topic: {error ?? "Not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <main className="flex-1 min-w-0 w-0">
        <TopicHeader
          topic={topic}
          topicLiked={topicLiked}
          currentUser={currentUser}
          onLike={handleTopicLike}
          onDislike={handleTopicDislike}
        />
        <CommentSection
          comments={comments}
          likedComments={likedComments}
          totalComments={totalComments}
          submitting={submittingComment}
          currentUser={currentUser}
          newComment={newComment}
          onCommentChange={setNewComment}
          onSubmit={handleSubmitComment}
          onLoadMore={() => loadMore(topic.id)}
          onDelete={deleteComment}
          onToggleLike={toggleCommentLike}
        />
      </main>
      <TrendingSidebar />
    </div>
  );
}