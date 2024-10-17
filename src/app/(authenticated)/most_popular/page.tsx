"use client"; // Enable client-side functionality

import Link from "next/link";
import { Skeleton } from "antd";
import { useState, useEffect } from "react";
import { StarFilled } from "@ant-design/icons";
import { Image } from "@nextui-org/react";
import ClientPagination from "@/components/ClientPagination";
import { useSearchParams } from "next/navigation"; // Next.js hook to manage query params
import { AnimeType } from "./types";

export default function MostPopular() {
  const [anime, setAnime] = useState<AnimeType[]>([]); // Using AnimeType[] for anime list
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // State to store the total number of items
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const limit = 25;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4321/anime/get?_page=${currentPage}&_limit=${limit}`
        ); // Updated API URL
        const animeData: AnimeType[] = await response.json(); // Ensuring animeData is of type AnimeType[]
        const totalItems = parseInt(
          response.headers.get("X-Total-Count") || "0"
        ); // Get total items from headers
        setAnime(animeData);
        setTotal(totalItems); // Set total number of items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (loading) return <Skeleton active />;

  return (
    <div className="container mx-auto">
      <h1 className="w-fit font-jakarta text-3xl font-black p-8 bg-gradient-to-r from-[#05E1C6] to-[#008576b7] bg-clip-text text-transparent">
        Most Popular
      </h1>
      <ul className="place-items-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Sort the anime list by r  ating in descending order */}
        {anime
          .sort((a: AnimeType, b: AnimeType) => b.avg_rating - a.avg_rating) // Sort by rating from highest to lowest
          .map((anime: AnimeType) => (
            <li
              key={anime.anime_id}
              className="w-full max-w-[208px] h-auto shadow mb-6"
            >
              <Link
                href={`/anime/${anime.anime_id}/${anime.anime_title
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
                <Image
                  className="select-none justify-center w-full h-[247px] rounded border-4 border-[#05E1C6] hover:border-[#1a7b4e] object-cover"
                  // src="/images/the-wind-rise.jpg" // Temporary image, you may want to use anime.photo_cover
                  src={`http://localhost:4321/${anime.anime_photo_cover.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={anime.anime_title}
                  width={208}
                  height={247}
                />
              </Link>
              <div className="mt-3 mb-3 mr-3">
                <Link
                  href={`/anime/${anime.anime_id}/${anime.anime_title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  <h5 className="truncate mb-[2px] text-lg font-bold tracking-tight text-gray-900 dark:text-white ">
                    {anime.anime_title}
                  </h5>
                </Link>
                <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                  {anime.anime_type}
                </p>
                <p className="flex items-center font-semibold">
                  <StarFilled className="text-yellow-500 mr-1" />{" "}
                  {anime.avg_rating}
                </p>
              </div>
            </li>
          ))}
      </ul>

      <div className="justify-center">
        {/* Pass both currentPage and total items */}
        <ClientPagination currentPage={currentPage} total={total} />
      </div>
    </div>
  );
}
