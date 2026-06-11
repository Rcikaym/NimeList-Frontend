"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/TitlePage";
import apiUrl from "@/hooks/api";
import { checkPremium } from "@/utils/premiumStatus";
import { checkAdminRole } from "@/utils/adminRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FiChevronDown,
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiType,
  FiEdit3,
  FiTag,
} from "react-icons/fi";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateTopic() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [idAnime, setIdAnime] = useState("");
  const [animeOptions, setAnimeOptions] = useState<{ id: string; title: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        const isPremium = await checkPremium();
        let isAdmin = false;
        try {
          isAdmin = checkAdminRole();
        } catch (e) {}

        if (!isPremium && !isAdmin) {
          router.push("/membership");
          return;
        }
        setCheckingAccess(false);

        const res = await apiUrl.get("/anime/get-newest");
        if (res.data && res.data.data) {
          setAnimeOptions(res.data.data);
        }
      } catch (err: any) {
        setError("Unable to initialize form options. Please try again.");
        setCheckingAccess(false);
      }
    };

    initPage();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!body.trim() || body === "<p><br></p>") {
      setError("Content body is required.");
      return;
    }
    if (!idAnime) {
      setError("Please select a tag/anime for your topic.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("id_anime", idAnime);

    try {
      await apiUrl.post("/topic/post", formData);
      setSuccess("Topic published! Redirecting you back to the forum...");
      setTitle("");
      setBody("");
      setIdAnime("");
      setTimeout(() => router.push("/forum"), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to publish. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic"],
      [{ color: [] }],
      ["code-block"],
      ["link"],
      [{ align: [] }],
    ],
  };

  const formats = ["size", "bold", "italic", "color", "code-block", "link", "align"];

  if (checkingAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#000" }}>
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(0,153,81,0.25)", borderTopColor: "#009951" }}
        />
        <p className="mt-4 text-sm" style={{ color: "#6b7280" }}>
          Checking access…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#f4f4f5" }}>
      <PageTitle title="NimeList — Create New Topic" />

      {/* Quill dark theme overrides */}
      <style>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
          background: #0a0a0a !important;
          padding: 10px 14px !important;
          border-radius: 12px 12px 0 0 !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          background: #050505 !important;
          color: #e4e4e7 !important;
          border-radius: 0 0 12px 12px !important;
        }
        .ql-editor {
          min-height: 220px !important;
          font-family: Inter, sans-serif !important;
          font-size: 0.9rem !important;
          line-height: 1.65 !important;
          padding: 1.1rem 1.25rem !important;
        }
        .ql-editor.ql-blank::before {
          color: #3f3f46 !important;
          font-style: normal !important;
          left: 1.25rem !important;
        }
        .ql-snow .ql-stroke { stroke: #71717a !important; }
        .ql-snow .ql-fill  { fill:   #71717a !important; }
        .ql-snow .ql-picker { color:  #71717a !important; }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #009951 !important; }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill   { fill:   #009951 !important; }
        .ql-snow .ql-picker-label:hover,
        .ql-snow .ql-picker-label.ql-active              { color:  #009951 !important; }
        .ql-snow .ql-picker-options {
          background: #0f0f0f !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 8px !important;
          padding: 4px !important;
        }
        .ql-snow .ql-picker-item              { color: #a1a1aa !important; }
        .ql-snow .ql-picker-item:hover,
        .ql-snow .ql-picker-item.ql-selected  { color: #009951 !important; }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* Back link */}
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
          style={{ color: "#52525b" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#009951")}
          onMouseLeave={e => (e.currentTarget.style.color = "#52525b")}
        >
          <FiArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to forum
        </Link>

        {/* Page heading */}
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#009951", letterSpacing: "1.5px" }}
          >
            Forum
          </p>
          <h1
            className="text-3xl sm:text-4xl font-semibold leading-tight"
            style={{ letterSpacing: "-0.5px", color: "#fff" }}
          >
            Start a new discussion
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#71717a", lineHeight: 1.6 }}>
            Share your thoughts, theories, or questions with the community.
          </p>
        </div>

        {/* Guidelines strip */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(0,153,81,0.05)",
            border: "1px solid rgba(0,153,81,0.12)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#009951", letterSpacing: "1.2px" }}
          >
            Tips for a great topic
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Clear title", "Specific and to the point, readers should know what to expect."],
              ["Provide context", "A sentence or two of background makes the discussion easier to join."],
              ["State your aim", "Is it a question, a review, a theory? Say it upfront."],
              ["Invite replies", "End with something that prompts others to share their take."],
              ["Stay on topic", "Tag the right anime so the right people find it."],
              ["Be respectful", "Positive, open-minded tone keeps the conversation going."],
            ].map(([label, desc]) => (
              <div key={label} className="flex items-start gap-3">
                <span
                  className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#009951" }}
                />
                <p className="text-sm" style={{ color: "#a1a1aa", lineHeight: 1.55 }}>
                  <span style={{ color: "#e4e4e7", fontWeight: 600 }}>{label}: </span>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Error / Success banners */}
          {error && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              <FiAlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(0,153,81,0.07)",
                border: "1px solid rgba(0,153,81,0.2)",
                color: "#009951",
              }}
            >
              <FiCheckCircle size={16} className="shrink-0" />
              {success}
            </div>
          )}

          {/* Title field */}
          <FieldCard
            icon={<FiType size={14} />}
            label="Title"
            hint="Make it specific, summarise the main point in one line."
          >
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Why Chainsaw Man's ending hit different…"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f4f4f5",
                caretColor: "#009951",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,153,81,0.5)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </FieldCard>

          {/* Body field */}
          <FieldCard
            icon={<FiEdit3 size={14} />}
            label="Content"
            hint="Expand on your title, context, analysis, questions, anything worth discussing."
          >
            <div
              className="overflow-hidden rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                placeholder="Start writing…"
                modules={modules}
                formats={formats}
              />
            </div>
          </FieldCard>

          {/* Anime tag field */}
          <FieldCard
            icon={<FiTag size={14} />}
            label="Anime tag"
            hint="Pick the series this discussion is about."
          >
            <div className="relative">
              <select
                value={idAnime}
                onChange={e => setIdAnime(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none transition-all cursor-pointer"
                style={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: idAnime ? "#f4f4f5" : "#3f3f46",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,153,81,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              >
                <option value="" disabled style={{ background: "#0a0a0a", color: "#52525b" }}>
                  Select an anime…
                </option>
                {animeOptions.map(anime => (
                  <option key={anime.id} value={anime.id} style={{ background: "#0a0a0a", color: "#f4f4f5" }}>
                    {anime.title}
                  </option>
                ))}
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"
                style={{ color: "#52525b" }}
              >
                <FiChevronDown size={14} />
              </div>
            </div>
          </FieldCard>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#009951",
                color: "#fff",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.background = "#00b35e";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#009951";
              }}
            >
              {loading ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
                  />
                  Publishing…
                </>
              ) : (
                <>
                  <FiSend size={13} />
                  Publish topic
                </>
              )}
            </button>

            <Link
              href="/forum"
              className="text-sm transition-colors"
              style={{ color: "#52525b" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a1a1aa")}
              onMouseLeave={e => (e.currentTarget.style.color = "#52525b")}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Reusable field card ───────────────────────────────────────── */
function FieldCard({
  icon,
  label,
  hint,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-3"
      style={{
        background: "#0f1117",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 shrink-0"
          style={{ color: "#009951" }}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#e4e4e7" }}>
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#52525b", lineHeight: 1.5 }}>
            {hint}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}