"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlinePaperClip,
  AiOutlinePlayCircle,
  AiOutlineStar,
  AiOutlineTags,
  AiOutlineTool,
} from "react-icons/ai";
import { AnimeType, PhotosType } from "./types";
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import Image from "next/image";

// Memoized components
const MemoizedImage = memo(Image);
const api = process.env.NEXT_PUBLIC_API_URL;

const AnimeMetadata = memo(
  ({
    anime,
    averageRating,
    totalFav,
  }: {
    anime: AnimeType["anime"];
    averageRating: number;
    totalFav: number;
  }) => (
    <>
      <div className="flex mt-auto">
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

      <div className="flex mt-2 gap-2">
        <div className="flex">
          <AiOutlineStar className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1">
            <h2 className="text-gray-800">Rating:</h2>
            <span className="text-gray-800">{averageRating}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <h2 className="text-gray-800">Total Fav:</h2>
          <span className="text-gray-800">{totalFav}</span>
        </div>
      </div>

      {anime.trailer_link && anime.watch_link && (
        <>
          <div className="flex gap-1 mt-2">
            <h2 className="text-gray-800 flex">
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

          <div className="flex gap-1 mt-2">
            <h2 className="text-gray-800 flex">
              <AiOutlinePaperClip className="mr-1 text-emerald-700" size={20} />
              Watch Link:
            </h2>
            <a
              href={anime.watch_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-500"
            >
              <span>{anime.watch_link}</span>
            </a>
          </div>
        </>
      )}

      <div className="flex gap-2 items-center mb-auto">
        <h2 className="text-gray-800 flex mt-2">
          <AiOutlineTags className="mr-1 text-emerald-700" size={20} />
          Genres:
        </h2>
        <div className="flex gap-2">
          {anime.genres?.map((genre) => (
            <span
              key={genre.id}
              className="rounded-md py-1 px-2 text-sm bg-emerald-700 text-white"
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
            src={`${api}/${photo.file_path.replace(/\\/g, "/")}`}
            alt={`${title} - Photo ${index + 1}`}
            className="rounded-sm shadow-xl hover:shadow-lg hover:shadow-gray-400 transition-shadow"
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
      const response = await fetch(`${api}/anime/get/${id}`, {
        method: "GET",
      });
      setAnime(await response.json());
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
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-[#005b50] text-white">
        Anime Details
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex items-center mt-3">
          {/* Left column for image */}
          <div className="justify-center p-2 ml-3 flex gap-5">
            {photo_cover && (
              <MemoizedImage
                alt={title}
                className="rounded-md shadow-md hover:shadow-lg hover:shadow-gray-400 transition-shadow"
                src={`${api}/${photo_cover.replace(/\\/g, "/")}`}
                height={330}
                width={200}
              />
            )}
            <div className="grid justify-between">
              <div className="flex gap-1">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                </div>
              </div>
              <AnimeMetadata
                anime={anime.anime}
                totalFav={anime.totalFav}
                averageRating={anime.averageRating}
              />
              <div className="grid gap-1">
                <div className="flex items-center text-gray-600 gap-2">
                  <AiOutlineClockCircle />
                  <span className="text-sm text-gray-600">
                    {renderDateTime(created_at)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 gap-2">
                  <AiOutlineTool />
                  <span className="text-sm text-gray-600">
                    {renderDateTime(updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column for details */}
        </div>

        {/* Synopsis */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Synopsis</h2>
          <div className="text-gray-600">
            <DisplayLongText text={synopsis} />
          </div>
        </div>

        {/* Photo gallery */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Photo Gallery
          </h2>
          <PhotoGallery photos={photos} title={title} />
        </div>
      </div>

      <div className="p-2 flex justify-end mt-3 rounded-lg bg-[#005B50]">
        <a href="/dashboard/anime">
          <div className="flex gap-2 bg-white text-[#005B50] px-3 py-2 rounded-md items-center hover:text-blue-500">
            <LeftCircleOutlined style={{ fontSize: 18 }} />
            <span>Back</span>
          </div>
        </a>
      </div>
    </>
  );
}