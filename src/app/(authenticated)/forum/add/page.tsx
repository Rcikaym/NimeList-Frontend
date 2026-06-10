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
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR hydration mismatches in NextJS
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateTopic() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [idAnime, setIdAnime] = useState("");
  const [animeOptions, setAnimeOptions] = useState<{ id: string; title: string }[]>([]);

  // Page interaction states
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Authenticate and fetch anime tags on component mount
  useEffect(() => {
    const initPage = async () => {
      try {
        // 1. Verify premium status or admin status (required for forum writing access)
        const isPremium = await checkPremium();
        let isAdmin = false;
        try {
          isAdmin = checkAdminRole();
        } catch (e) {
          // Ignore token parsing issues
        }

        if (!isPremium && !isAdmin) {
          router.push("/membership");
          return;
        }
        setCheckingAccess(false);

        // 2. Fetch anime options for selection dropdown
        const res = await apiUrl.get("/anime/get-newest");
        if (res.data && res.data.data) {
          setAnimeOptions(res.data.data);
        }
      } catch (err: any) {
        console.error("Initialization error:", err);
        setError("Unable to initialize form options. Please try again.");
        setCheckingAccess(false);
      }
    };

    initPage();
  }, [router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate inputs
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

    // Build Form Data according to API schema requirements
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("id_anime", idAnime);

    try {
      // Post topic creation request
      await apiUrl.post("/topic/post", formData);

      setSuccess("Topic created successfully! Redirecting back to forums...");
      setTitle("");
      setBody("");
      setIdAnime("");

      // Redirect after showing success toast
      setTimeout(() => {
        router.push("/forum");
      }, 1500);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create the topic. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Quill rich text modules configuration
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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-400 font-medium">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#037F71]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <PageTitle title="NimeList - Create New Topic" />

      {/* Styled Quill text editor rules */}
      <style>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #27272a !important;
          background-color: #0f1420 !important;
          padding: 0.75rem 1rem !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          background-color: #05070c !important;
          color: #f4f4f5 !important;
        }
        .ql-editor {
          min-height: 250px !important;
          font-family: inherit !important;
          font-size: 0.95rem !important;
          line-height: 1.6 !important;
          padding: 1.25rem !important;
        }
        .ql-editor.ql-blank::before {
          color: #52525b !important;
          font-style: normal !important;
          left: 1.25rem !important;
        }
        .ql-snow .ql-stroke {
          stroke: #9ca3af !important;
        }
        .ql-snow .ql-fill {
          fill: #9ca3af !important;
        }
        .ql-snow .ql-picker {
          color: #9ca3af !important;
        }
        .ql-snow .ql-stroke:hover,
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #10b981 !important;
        }
        .ql-snow .ql-fill:hover,
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #10b981 !important;
        }
        .ql-snow .ql-picker-label:hover,
        .ql-snow.ql-toolbar .ql-picker-label.ql-active {
          color: #10b981 !important;
        }
        .ql-snow .ql-picker-options {
          background-color: #0f1420 !important;
          border: 1px solid #27272a !important;
          border-radius: 0.5rem;
          padding: 0.5rem !important;
        }
        .ql-snow .ql-picker-item {
          color: #a1a1aa !important;
        }
        .ql-snow .ql-picker-item:hover,
        .ql-snow .ql-picker-item.ql-selected {
          color: #10b981 !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/forum"
            className="inline-flex items-center text-zinc-400 hover:text-emerald-400 font-medium text-sm transition-colors group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to forums
          </Link>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Create{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              New Topic
            </span>
          </h1>
        </div>

        {/* Guidelines Card */}
        <div className="p-6 rounded-xl border border-emerald-500/10 bg-emerald-950/5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <FiInfo className="w-32 h-32 text-emerald-400" />
          </div>
          <h2 className="text-emerald-400 font-semibold text-lg flex items-center gap-2">
            <FiInfo className="text-emerald-400 shrink-0" />
            How to Write a Good Topic Discussion
          </h2>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-zinc-300">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-medium">Choose a Clear Title:</strong> Make it
                specific and summarize the main point.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-medium">Introduce the Topic:</strong> Provide
                context or background information.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-medium">State the Purpose:</strong> Clearly
                outline the discussion’s aim.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-medium">Share Experiences:</strong> Offer your
                insights to kickstart conversations.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-medium">Encourage Engagement:</strong> Invite
                others to share their views.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-medium font-semibold">Be Respectful:</strong> Maintain a
                positive and open-minded tone.
              </span>
            </li>
          </ul>
        </div>

        {/* Create Topic Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Alerts */}
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-sm rounded-lg flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg flex items-center gap-3 animate-pulse">
              <FiCheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Title Card */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/20 focus-within:border-emerald-500/30 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.02)] space-y-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Title</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Introduce Key Points and Objectives.</p>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How Has Anime Evolved Over the Last Decade?"
              className="w-full bg-black/50 border border-zinc-800 hover:border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-zinc-100 rounded-lg px-4 py-3 outline-none transition-all placeholder-zinc-700 text-sm"
            />
          </div>

          {/* Content Card (Rich Text) */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/20 focus-within:border-emerald-500/30 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.02)] space-y-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Compose Your Main Content Discussion
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">
                Expand on your title with detailed insights, examples, and personal perspectives
                about anime. Share your thoughts on trends, character development, or any other
                aspects you find intriguing.
              </p>
            </div>
            <div className="bg-black/50 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-emerald-500 transition-all">
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                placeholder="Expand on your title with detailed insights..."
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          {/* Tag Card */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/20 focus-within:border-emerald-500/30 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.02)] space-y-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Tag Your Topic</h3>
              <p className="text-zinc-500 text-xs mt-0.5">
                Add tags that reflect the main themes or genres of your topic.
              </p>
            </div>
            <div className="relative">
              <select
                id="id_anime"
                name="id_anime"
                value={idAnime}
                onChange={(e) => setIdAnime(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 hover:border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-zinc-300 rounded-lg px-4 py-3 outline-none transition-all appearance-none cursor-pointer text-sm"
              >
                <option value="" disabled className="bg-zinc-950 text-zinc-600">
                  Choose relevant tags (e.g., anime)
                </option>
                {animeOptions.map((anime) => (
                  <option key={anime.id} value={anime.id} className="bg-zinc-950 text-white">
                    {anime.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3 rounded-lg font-semibold text-black bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="text-black shrink-0" />
                  Submit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
