"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlinePaperClip,
  AiOutlinePlayCircle,
  AiOutlineStar,
  AiOutlineTags,
  AiOutlineTool,
} from "react-icons/ai";
import { AnimeType, PhotosType, ReviewType } from "./types";
import renderDateTime from "@/components/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import Image from "next/image";
import Link from "next/link";
import {
  BiArrowBack,
  BiCrown,
  BiEdit,
  BiGlobe,
  BiTrashAlt,
} from "react-icons/bi";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import apiUrl from "@/hooks/api";
import timeToDay from "@/utils/TimeToDay";

// Memoized components
const MemoizedImage = memo(Image);
const api = process.env.NEXT_PUBLIC_API_URL;

const AnimeMetadata = memo(
  ({
    anime,
    averageRating,
    totalFav,
    genres,
  }: {
    anime: AnimeType["anime"];
    averageRating: number;
    totalFav: number;
    genres: AnimeType["genres"];
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
          {genres?.map((genre) => (
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

export default function AnimeDetails({ slug }: { slug: string }) {
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const { confirm } = Modal;
  const [error, setError] = useState<string | null>(null);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/anime/get/${slug}`, {
        method: "GET",
      });
      const data = await response.json();
      setAnime(data);
      setReviews(data.review.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching anime:", error);
      setError("Failed to fetch anime data");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await apiUrl.delete(`/review/delete/${id}`);
      fetchAnime();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const showDeleteConfirm = async (id: string) => {
    confirm({
      title: "Are you sure delete this review?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      centered: true,
      okText: "Yes",
      okType: "danger",
      onOk() {
        try {
          handleDeleteReview(id);
          message.success("Review deleted successfully!");
        } catch (error: any) {
          message.error("Error deleting review:", error);
        }
      },
    });
  };

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
                averageRating={anime.avgRating}
                genres={anime.genres}
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

        <div className="mt-6 p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold select-none">
              {reviews.length} REVIEWS
            </h2>
          </div>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul>
              {reviews.map((review) =>
                review.status_premium === "active" ? (
                  <li
                    key={review.id}
                    className="container border rounded-lg border-emerald-500 p-5 my-5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex">
                        <div className="font-bold bg-[#005B50] p-2 flex items-center gap-2 w-fit rounded-md mb-2">
                          <span className="text-white">{review.name}</span>
                          <BiCrown size={15} className="text-yellow-300" />
                        </div>
                        {review.created_at === review.updated_at ? (
                          <span className="text-[0.75rem] p-2 text-gray-500">
                            {timeToDay(review.created_at)}
                          </span>
                        ) : (
                          <span className="text-[0.75rem] p-2 text-gray-500">
                            {`${timeToDay(review.updated_at)} (diedit)`}
                          </span>
                        )}
                      </div>
                      <p>{review.review}</p>
                      <p>Rating: {review.rating}/10</p>
                    </div>
                    <div
                      className="w-fit cursor-pointer"
                      onClick={() => showDeleteConfirm(review.id)}
                    >
                      <BiTrashAlt size={23} className="text-emerald-700" />
                    </div>
                  </li>
                ) : (
                  <li
                    key={review.id}
                    className="container border rounded-lg border-[#05e5cbc3] p-5 my-5"
                  >
                    <div className="font-bold bg-[#005B50] text-white p-2 flex items-center gap-2 w-fit rounded-md mb-2">
                      <span>{review.name}</span> <BiGlobe size={15} />
                    </div>
                    <p>{review.review}</p>
                    <p>Rating: {review.rating}/10</p>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="p-2 flex justify-end mt-3 rounded-lg bg-[#005B50]">
        <Link
          href="/dashboard/anime"
          className="bg-white text-black px-2 py-1 rounded-md flex items-center gap-1 hover:text-[#005B50]"
        >
          <BiArrowBack style={{ fontSize: "20px" }} />
        </Link>
      </div>
    </>
  );
}
