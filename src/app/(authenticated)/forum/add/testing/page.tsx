"use client";
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import PageTitle from "@/components/TitlePage";

export default function CreateTopic() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    id_anime: "",
  });
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [animeOptions, setAnimeOptions] = useState<{ id: string; title: string }[]>([]);

  // Simulasikan access token (seharusnya didapatkan dari proses login)
  const accessToken = localStorage.getItem("access_token"); // Simpan token di localStorage saat login

  // Fetch anime data saat komponen dimuat
  useEffect(() => {
    const fetchAnimeOptions = async () => {
      try {
        const response = await fetch("http://localhost:4321/anime/get-newest", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Tambahkan token jika diperlukan
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch anime options.");
        }

        const data = await response.json();
        setAnimeOptions(data.data); // Data diasumsikan berupa array dengan id dan title
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchAnimeOptions();
  }, [accessToken]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.body || !formData.id_anime || !photos) {
      setError("All fields are required, including a photo.");
      return;
    }

    if (!accessToken) {
      setError("Access token is missing. Please log in.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("body", formData.body);
    formDataToSubmit.append("id_anime", formData.id_anime);

    // Append each file from photos
    Array.from(photos).forEach((file: File) => {
      formDataToSubmit.append("photos_topic", file);
    });

    try {
      const response = await fetch("http://localhost:4321/topic/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Tambahkan access token di header
        },
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Failed to create the topic.");
      }

      setSuccess("Topic created successfully!");
      setFormData({ title: "", body: "", id_anime: "" });
      setPhotos(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10">
      <PageTitle title="NimeList - Create New Topic" />
      <h1 className="text-3xl md:text-4xl ml-16 font-bold text-green-500 text-start">
        Create New Topic
      </h1>
      <div className="mt-6 text-start max-w-3xl ml-16">
        <h2 className="text-xl md:text-2xl font-semibold text-green-400">
          How to Write a Good Topic Discussion
        </h2>
        <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
          <li>
            <strong className="text-white">Choose a Clear Title:</strong> Make
            it specific and summarize the main point.
          </li>
          <li>
            <strong className="text-white">Introduce the Topic:</strong> Provide
            context or background information.
          </li>
          <li>
            <strong className="text-white">
              State the Purpose or Question:
            </strong>{" "}
            Clearly outline the discussion’s aim.
          </li>
          <li>
            <strong className="text-white">
              Share Your Thoughts or Experiences:
            </strong>{" "}
            Offer your insights to kickstart the conversation.
          </li>
          <li>
            <strong className="text-white">Encourage Engagement:</strong> Invite
            others to share their views and experiences.
          </li>
          <li>
            <strong className="text-white">
              Be Respectful and Open-Minded:
            </strong>{" "}
            Maintain a positive tone and be open to different perspectives.
          </li>
        </ul>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form className="mt-10 max-w-3xl space-y-6 ml-16" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter topic title"
            className="mt-2 w-full border border-green-500 bg-black text-white rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-300"
          >
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={6}
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your discussion body"
            className="mt-2 w-full border border-green-500 bg-black text-white rounded-lg px-4 py-2"
          ></textarea>
        </div>
        <div>
        <label htmlFor="id_anime" className="block text-sm font-medium text-gray-300">
            Select Anime
          </label>
          <select
            id="id_anime"
            name="id_anime"
            value={formData.id_anime}
            onChange={handleChange}
            className="mt-2 w-full border border-green-500 bg-black text-white rounded-lg px-4 py-2"
          >
            <option value="" disabled>
              Choose an anime
            </option>
            {animeOptions.map((anime) => (
              <option key={anime.id} value={anime.id}>
                {anime.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="photos"
            className="block text-sm font-medium text-gray-300"
          >
            Upload Photo for topic
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            onChange={handleFileChange}
            className="mt-2 w-full text-gray-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
