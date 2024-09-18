"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";
import axios from "axios";
import {
  AiOutlineCalendar,
  AiOutlinePaperClip,
  AiOutlinePlayCircle,
  AiOutlineStar,
  AiOutlineTags,
} from "react-icons/ai";

// Types moved to a separate file to reduce bundle size
import { AnimeType, PhotosType } from "./types";
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";

// Memoized components
const MemoizedImage = memo(Image);
const MemoizedButton = memo(Button);

const AnimeMetadata = memo(
  ({
    anime,
    averageRating,
  }: {
    anime: AnimeType["anime"];
    averageRating: number;
  }) => (
    <>
      <div className="flex mt-2">
        <AiOutlineCalendar className="mr-1 text-emerald-700" size={20} />
        <div className="flex gap-1">
          <h2 className="text-gray-800">Release Date:</h2>
          <span className="text-gray-800">{anime.release_date}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <div className="flex gap-1">
          <div className="flex">
            <AiOutlinePlayCircle className="mr-1 text-emerald-700" size={20} />
            <h2 className="text-gray-800">Episodes: </h2>
          </div>
          <span className="text-gray-800">{anime.episodes}</span>
        </div>
        <div className="flex gap-1">
          <h2 className="text-gray-800">Type: </h2>
          <span className="text-gray-800">{anime.type}</span>
        </div>
      </div>

      <div className="flex gap-1 mt-2">
        <div className="flex">
          <AiOutlineStar
            className="mr-1 text-emerald-700"
            // style={{ color: "#fadb14" }}
            size={20}
          />
          <h2 className="text-gray-800">Rating:</h2>
        </div>
        <span className="text-gray-800">{averageRating}</span>
      </div>

      {anime.trailer_link && (
        <>
          <div className="flex gap-1 mt-2">
            <h2 className="text-gray-800 flex items-center">
              <AiOutlinePaperClip className="mr-1 text-emerald-700" size={20} />
              Trailer Link:
            </h2>
            <a
              href={anime.trailer_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-500"
            >
              <span>{anime.trailer_link}</span>
            </a>
          </div>
        </>
      )}

      <div className="flex gap-2 items-center mb-3">
        <h2 className="text-gray-800 flex mt-2">
          <AiOutlineTags className="mr-1 text-emerald-700" size={20} />
          Genres:
        </h2>
        <div className="flex gap-2">
          {anime.genres?.map((genre) => (
            <span
              key={genre.id}
              className="rounded-xl px-2 py-1 text-sm bg-emerald-700"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </>
  )
);

const PhotoGallery = memo(
  ({ photos, title }: { photos: PhotosType[]; title: string }) => (
    <div className="flex gap-4 grid-cols-5">
      {photos?.map((photo, index) => (
        <div key={index}>
          <MemoizedImage
            src={`http://localhost:4321/${photo.file_path.replace(/\\/g, "/")}`}
            alt={`${title} - Photo ${index + 1}`}
            className="rounded-lg shadow-md hover:shadow-xl transition-shadow"
            height={160}
            width={260}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
);

export default function AnimeDetails({ id }: { id: string }) {
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4321/anime/get/${id}`);
      setAnime(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching anime:", error);
      setError("Failed to fetch anime data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!anime) return <div>No anime data found</div>;

  const { title, photo_cover, synopsis, photos, created_at, updated_at } =
    anime.anime;

  return (
    <>
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-[#005b50]">
        Anime Details
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex items-center">
          {/* Left column for image */}
          <div className="md:w-1/3 justify-center p-2 ml-3">
            {photo_cover && (
              <MemoizedImage
                alt={title}
                className="w-full h-auto object-cover rounded-md shadow-md hover:shadow-xl transition-shadow"
                src={`http://localhost:4321/${photo_cover.replace(/\\/g, "/")}`}
                loading="lazy"
              />
            )}
          </div>

          {/* Right column for details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>
            <AnimeMetadata
              anime={anime.anime}
              averageRating={anime.averageRating}
            />
            <div className="grid gap-1">
              <span className="text-sm text-gray-600">
                Created At: {renderDateTime(created_at)}
              </span>
              <span className="text-sm text-gray-600">
                Updated At: {renderDateTime(updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Synopsis
          </h2>
          <DisplayLongText text={synopsis} />
        </div>

        {/* Photo gallery */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Photo Gallery
          </h2>
          <PhotoGallery photos={photos} title={title} />
        </div>
      </div>

      <div className="p-2 flex justify-end text-lg font-semibold mt-3 rounded-lg bg-[#005B50]">
        <MemoizedButton icon={<LeftCircleOutlined />} href="/dashboard/anime">
          Back
        </MemoizedButton>
      </div>
    </>
  );
}
