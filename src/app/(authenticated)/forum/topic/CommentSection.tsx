import { Comment } from "./types";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  comments: Comment[];
  likedComments: Set<string>;
  totalComments: number;
  submitting: boolean;
  currentUser: string | null;
  newComment: string;
  onCommentChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadMore: () => void;
  onDelete: (id: string) => void;
  onToggleLike: (id: string) => void;
}

export default function CommentSection({
  comments,
  likedComments,
  totalComments,
  submitting,
  currentUser,
  newComment,
  onCommentChange,
  onSubmit,
  onLoadMore,
  onDelete,
  onToggleLike,
}: CommentSectionProps) {
  const hasMore = comments.length < totalComments;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
          </svg>
          {totalComments} Comments
        </span>
        <button
          className="flex items-center gap-1 text-xs text-slate-400 px-3 py-1.5 rounded-lg transition-colors hover:text-slate-200"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Sort By
          <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Add Comment */}
      {currentUser && (
        <div
          className="p-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              required
              className="w-full p-3.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(0,153,81,0.5)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-4 py-2 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#009951" }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = "#00b35e")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#009951")}
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comment List */}
      <div>
        {comments.length === 0 ? (
          <p className="text-center text-sm text-slate-600 py-10">
            No comments yet — be the first to chime in.
          </p>
        ) : (
          comments.map((comment, i) => (
            <div
              key={comment.id}
              style={i < comments.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}}
            >
              <CommentItem
                comment={comment}
                isLiked={likedComments.has(comment.id)}
                currentUser={currentUser}
                onToggleLike={onToggleLike}
                onDelete={onDelete}
              />
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div
          className="py-4 flex justify-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <button
            onClick={onLoadMore}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase transition-colors"
            style={{ color: "#009951" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00c864")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#009951")}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}