import Avatar from "./Avatar";
import { Comment } from "./types";
import { formatDate } from "../../../../utils/topicFormatDate";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

interface CommentItemProps {
  comment: Comment;
  isLiked: boolean;
  currentUser: string | null;
  onToggleLike: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CommentItem({
  comment,
  isLiked,
  currentUser,
  onToggleLike,
  onDelete,
}: CommentItemProps) {
  const isOwner = currentUser === comment.user;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const decodedToken: { role: string } = jwtDecode(token || "") as any;
    if (decodedToken.role === "admin") setIsAdmin(true);
  }, []);

  function handleDelete() {
    if (confirm("Are you sure you want to delete this comment?")) {
      onDelete(comment.id);
    }
  }

  return (
    <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors group">
      <div className="flex gap-3">
        <Avatar name={comment.user} src={comment.avatar} />

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: isAdmin ? "#009951" : "#f1f5f9" }}
              >
                @{comment.user}
              </span>
              {comment.badge && (
                <span
                  className="inline-flex items-center text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{
                    background: "rgba(0,153,81,0.12)",
                    color: "#009951",
                    border: "1px solid rgba(0,153,81,0.25)",
                  }}
                >
                  {comment.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-slate-500">
                {formatDate(comment.created_at)}
              </span>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  title="Delete comment"
                  className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed text-slate-300">{comment.content}</p>

          {/* Like button */}
          <button
            onClick={() => onToggleLike(comment.id)}
            className="mt-2.5 flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: isLiked ? "#009951" : "#64748b" }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{comment.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}