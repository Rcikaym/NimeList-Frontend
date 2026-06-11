import { useState } from "react";
import apiUrl from "@/hooks/api";
import { TopicDetail } from "../app/(authenticated)/forum/topic/types";

export function useTopic() {
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [topicLiked, setTopicLiked] = useState<"like" | "dislike" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTopic(slug: string) {
    setLoading(true);
    try {
      const res = await apiUrl.get(`/topic/get/${slug}`);
      const d = res.data;
      if (!d) throw new Error("Topic not found");
      setTopic({
        id: d.id, title: d.title, body: d.body,
        created_at: d.created_at, updated_at: d.updated_at,
        user: d.user|| "anonymous",
        anime: d.anime || "",
        photos: d.photos || [],
        totalLikes: d.likes || 0,
        totalDislikes: d.dislikes || 0,
      });
      return d.id as string;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleTopicLike() {
    if (!topic) return;
    if (topicLiked === "like") {
      await apiUrl.delete("/like-topic/delete", { data: { id_topic: topic.id } });
      setTopicLiked(null);
      setTopic((p) => p && { ...p, totalLikes: p.totalLikes - 1 });
    } else {
      if (topicLiked === "dislike") {
        await apiUrl.delete("/dislike-topic/delete", { data: { id_topic: topic.id } }).catch(() => {});
        setTopic((p) => p && { ...p, totalDislikes: p.totalDislikes - 1 });
      }
      await apiUrl.post("/like-topic/post", { id_topic: topic.id });
      setTopicLiked("like");
      setTopic((p) => p && { ...p, totalLikes: p.totalLikes + 1 });
    }
  }

  async function handleTopicDislike() {
    if (!topic) return;
    if (topicLiked === "dislike") {
      await apiUrl.delete("/dislike-topic/delete", { data: { id_topic: topic.id } }).catch(() => {});
      setTopicLiked(null);
      setTopic((p) => p && { ...p, totalDislikes: p.totalDislikes - 1 });
    } else {
      if (topicLiked === "like") {
        await apiUrl.delete("/like-topic/delete", { data: { id_topic: topic.id } }).catch(() => {});
        setTopic((p) => p && { ...p, totalLikes: p.totalLikes - 1 });
      }
      await apiUrl.post("/dislike-topic/post", { id_topic: topic.id });
      setTopicLiked("dislike");
      setTopic((p) => p && { ...p, totalDislikes: p.totalDislikes + 1 });
    }
  }

  return { topic, topicLiked, loading, error, fetchTopic, handleTopicLike, handleTopicDislike };
}