"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TopicDetail {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  user: string;
  anime: string;
  photos: string[];
  totalLikes: number;
  totalDislikes: number;
}

interface Comment {
  id: string;
  user: string;
  avatar?: string;
  badge?: string;
  content: string;
  created_at: string;
  likes: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src)
    return (
      <img src={src} alt={name} className="w-9 h-9 rounded-full object-cover" />
    );
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

// ─── Mock comments (replace with real API later) ──────────────────────────────
const MOCK_COMMENTS: Comment[] = Array.from({ length: 5 }, (_, i) => ({
  id: `c${i}`,
  user: "Han Solo",
  badge: "Yearly Champion",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  created_at: "2023-08-17T00:00:00.000Z",
  likes: 0,
}));

// ─── Trending sidebar (mock) ───────────────────────────────────────────────────
const TRENDING = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: "We supply a series of design princip...",
}));

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TopicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [visibleComments, setVisibleComments] = useState(5);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [topicLiked, setTopicLiked] = useState<"like" | "dislike" | null>(null);

  // Fetch topic detail
  useEffect(() => {
    if (!slug) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    fetch(`http://localhost:4321/topic/get/${slug}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setTopic(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [slug]);

  function toggleCommentLike(id: string) {
    setLikedComments((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-sm">Failed to load topic: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ── Navbar ── */}
      <nav className="border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white font-black text-sm">n</span>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
            Browse
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-4">
          {/* Group */}
          <button className="text-gray-500 hover:text-teal-600 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          {/* Search */}
          <button className="text-gray-500 hover:text-teal-600 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
          </button>
          {/* Bookmark */}
          <button className="text-gray-500 hover:text-teal-600 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
            AD
          </div>
        </div>
      </nav>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* ── Left: Topic Content ── */}
        <main className="flex-1 min-w-0">
          {/* Topic header */}
          <div className="border border-gray-200 rounded-lg p-6 mb-4">
            {/* Author + Edit */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">
                  Author By{" "}
                  <span className="text-teal-600 font-medium">
                    @{topic.user}
                  </span>
                  {/* verified icon */}
                  <svg
                    className="inline w-3.5 h-3.5 ml-1 text-teal-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </p>
                <h1 className="text-xl font-bold text-gray-900 leading-snug">
                  {topic.title}
                </h1>
              </div>
              <button className="ml-4 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition-colors flex-shrink-0">
                Edit Topic
              </button>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 mb-4">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(topic.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {topic.totalLikes + (topicLiked === "like" ? 1 : 0)}k
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"
                  />
                </svg>
                {comments.length}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 1.97L7 12v8m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                {topic.totalDislikes}
              </span>
            </div>

            <hr className="border-gray-100 mb-4" />

            {/* Anime tag */}
            {topic.anime && (
              <div className="mb-3">
                <span className="inline-block bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded font-medium border border-teal-100">
                  {topic.anime}
                </span>
              </div>
            )}

            {/* Body */}
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: topic.body }}
            />

            {/* Photos */}
            {topic.photos && topic.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {topic.photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="rounded object-cover w-full h-28"
                  />
                ))}
              </div>
            )}

            {/* Like / Dislike actions */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() =>
                  setTopicLiked(topicLiked === "like" ? null : "like")
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                  topicLiked === "like"
                    ? "bg-teal-50 border-teal-400 text-teal-700"
                    : "border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill={topicLiked === "like" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {topic.totalLikes + (topicLiked === "like" ? 1 : 0)}
              </button>
              <button
                onClick={() =>
                  setTopicLiked(topicLiked === "dislike" ? null : "dislike")
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                  topicLiked === "dislike"
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill={topicLiked === "dislike" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 1.97L7 12v8m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                {topic.totalDislikes + (topicLiked === "dislike" ? 1 : 0)}
              </button>
            </div>
          </div>

          {/* ── Comments Section ── */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Comments header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"
                  />
                </svg>
                {comments.length} Comments
              </span>
              <button className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded px-3 py-1 hover:border-teal-400 hover:text-teal-600 transition-colors bg-white">
                Sort By
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Comment list */}
            <div className="divide-y divide-gray-100">
              {comments.slice(0, visibleComments).map((comment) => (
                <div
                  key={comment.id}
                  className="px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-3">
                    <Avatar name={comment.user} src={comment.avatar} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">
                            @{comment.user}
                          </span>
                          {comment.badge && (
                            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-1.5 py-0.5 rounded font-medium">
                              🏆 {comment.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {comment.content}
                      </p>
                      <button
                        onClick={() => toggleCommentLike(comment.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill={
                            likedComments.has(comment.id)
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {comment.likes +
                          (likedComments.has(comment.id) ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More */}
            {visibleComments < comments.length && (
              <div className="py-4 flex justify-center border-t border-gray-100">
                <button
                  onClick={() => setVisibleComments((v) => v + 5)}
                  className="flex items-center gap-1.5 text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  VIEW MORE
                </button>
              </div>
            )}
          </div>
        </main>

        {/* ── Right: Trending Sidebar ── */}
        <aside className="w-56 flex-shrink-0 hidden lg:block">
          <div className="border border-gray-200 rounded-lg overflow-hidden sticky top-20">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-700 text-center">
                Top Trending Topics of the Month
              </p>
            </div>
            <ul className="divide-y divide-gray-50">
              {TRENDING.map((item) => (
                <li key={item.id}>
                  <a
                    href="#"
                    className="flex items-start gap-2 px-3 py-2 hover:bg-teal-50 transition-colors group"
                  >
                    <span className="text-xs text-gray-400 font-medium w-4 flex-shrink-0 pt-0.5">
                      {item.id}.
                    </span>
                    <span className="text-xs text-teal-600 group-hover:text-teal-700 truncate leading-snug">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 mt-8 px-6 py-4">
        <p className="text-xs text-gray-400">© NimeList</p>
      </footer>
    </div>
  );
}
