"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineTool } from "react-icons/ai";
import { AnimeType, ReviewDataType, ReviewType } from "./types";
import renderDateTime from "@/utils/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import Image from "next/image";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import apiUrl from "@/hooks/api";
import ReviewList from "./ReviewComponent";
import AnimeMetadata from "./AnimeMetaData";
import PhotoGallery from "./PhotoGallery";

export default function AnimeDetails({ slug }: { slug: string }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewDataType[]>([]);
  const [totalReview, setTotalReview] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { confirm } = Modal;
  const [error, setError] = useState<string | null>(null);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/anime/get/${slug}`, {
        method: "GET",
      });
      const data = await response.json();
      setAnime(data);
      fetchReview(page, data.anime.id);
      setError(null);
    } catch (error) {
      console.error("Error fetching anime:", error);
      setError("Failed to fetch anime data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReview = async (page: number, id_anime?: string) => {
    try {
      const response = await fetch(
        `${api}/review/get/by-anime/${id_anime}?page=${page}&limit=5`,
        {
          method: "GET",
        }
      );
      const res: ReviewType = await response.json();
      console.log(res.data.length);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setTotalReview(res.total);
        setReviews((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching review:", error);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [slug]);

  useEffect(() => {
    if (anime?.anime?.id && page > 1) {
      setTimeout(() => fetchReview(page, anime.anime.id), 500);
    }
  }, [page, anime?.anime?.id]);

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await apiUrl.delete(`/review/delete/${id}`);
      message.success(response.data.message);

      // Perbarui review di state
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );

      // Perbarui total review di state
      setTotalReview((prevTotal) => prevTotal - 1);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const showDeleteConfirm = async (id: string) => {
    confirm({
      title: "Are you sure delete this review?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: "Yes",
      okType: "danger",
      onOk() {
        handleDeleteReview(id);
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
      <div className="bg-white shadow-lg rounded-lg">
        <div className="md:flex items-center mt-3">
          {/* Left column for image */}
          <div className="justify-center p-2 ml-3 flex gap-5">
            {photo_cover && (
              <Image
                alt={title}
                className="rounded-md shadow-md hover:shadow-lg hover:shadow-gray-400 transition-shadow"
                src={`${api}/${photo_cover}`}
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
          <div className="text-gray-600 w-full">
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

        {/* Komponen Review List */}
        <ReviewList
          reviews={reviews}
          hasMore={hasMore && reviews.length < totalReview}
          totalReview={totalReview}
          onLoadMore={() => setPage((prevPage) => prevPage + 1)}
          onDelete={showDeleteConfirm}
        />
      </div>
    </>
  );
}
