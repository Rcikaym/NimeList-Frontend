import { TopicDetail } from "./types";
import { formatDate } from "../../../../utils/topicFormatDate";

interface TopicHeaderProps {
  topic: TopicDetail;
  topicLiked: "like" | "dislike" | null;
  currentUser: string | null;
  onLike: () => void;
  onDislike: () => void;
}

export default function TopicHeader({
  topic,
  topicLiked,
  currentUser,
  onLike,
  onDislike,
}: TopicHeaderProps) {
  const isAuthor = currentUser === topic.user;

  return (
    <main className="flex-1 min-w-0 overflow-hidden mb-4">
      <div
        className="rounded-xl p-6"
        style={{
          background: "#0f1117",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Anime tag — eyebrow above title */}
        {topic.anime && (
          <div className="mb-3">
            <span
              className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md tracking-wide uppercase"
              style={{
                background: "rgba(0,153,81,0.12)",
                color: "#009951",
                border: "1px solid rgba(0,153,81,0.2)",
              }}
            >
              {topic.anime}
            </span>
          </div>
        )}

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-xl font-bold text-white leading-snug">
            {topic.title}
          </h1>
          {isAuthor && (
            <button
              className="flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-lg transition-all"
              style={{
                background: "rgba(0,153,81,0.12)",
                color: "#009951",
                border: "1px solid rgba(0,153,81,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#009951";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,153,81,0.12)";
                e.currentTarget.style.color = "#009951";
              }}
            >
              Edit Topic
            </button>
          )}
        </div>

        {/* Author + meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5">
          <span>
            By{" "}
            <span className="font-semibold" style={{ color: "#009951" }}>
              @{topic.user}
            </span>
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
            {topic.totalLikes}
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

        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="pt-5"
        >
          {/* Body */}
          <div
            className="w-full text-slate-300 text-sm leading-relaxed [&>p]:mb-4 [&>p]:break-words [&>strong]:text-white text-pretty"
            style={{ overflowWrap: "break-word" }}
            dangerouslySetInnerHTML={{ __html: topic.body }}
          />

          {/* Photos */}
          {topic.photos.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {topic.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="rounded-lg object-cover w-full h-28"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Like / Dislike */}
        <div
          className="flex items-center gap-3 mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={
              topicLiked === "like"
                ? {
                    background: "rgba(0,153,81,0.15)",
                    color: "#009951",
                    border: "1px solid rgba(0,153,81,0.35)",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    color: "#94a3b8",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
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
            {topic.totalLikes}
          </button>

          <button
            onClick={onDislike}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={
              topicLiked === "dislike"
                ? {
                    background: "rgba(239,68,68,0.12)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    color: "#94a3b8",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
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
            {topic.totalDislikes}
          </button>
        </div>
      </div>
    </main>
  );
}
