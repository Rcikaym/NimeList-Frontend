"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StarFilled } from "@ant-design/icons";
import { Image } from "@nextui-org/react";
import { AnimeType } from "./types";

export default function NewlyArrived() {
  const [animes, setAnimes] = useState<AnimeType[]>([]);
//   const [total, setTotal] = useState(0);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchNewlyArrived = async () => {
      try {
        const response = await fetch(`${api}/anime/get-newest?limit=10`);
        const animeData = await response.json();
        // const totalItems = parseInt(
        //   response.headers.get("X-Total-Count") || "0"
        // ); // Get total items from headers
        setAnimes(animeData);
        // setTotal(totalItems);
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };
    fetchNewlyArrived();
  }, []);

  return (
    <>
      <ul className="flex gap-6 ml-20 scrollbar-hide">
        {animes.map((anime: any) => (
          <li
            key={anime.id}
            className="w-full max-w-[220px] h-auto shadow mb-6"
          >
            <Link
              href={`/anime/${anime.id}/${anime.title
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              <Image
                className="select-none justify-center w-full h-[300px] rounded border-4 border-[#05E1C6] hover:border-[#1a7b4e] object-cover"
                // src="/images/the-wind-rise.jpg" // Temporary image, you may want to use anime.photo_cover
                src={`http://localhost:4321/${anime.photo_cover.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={anime.title}
                width={220}
                height={300}
              />
            </Link>
            <div className="mt-3 mb-3 mr-3">
              <Link
                href={`/anime/${anime.id}/${anime.title
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
                <h5 className="truncate mb-[2px] text-lg font-bold tracking-tight text-gray-900 dark:text-white ">
                  {anime.title}
                </h5>
              </Link>
              <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                {anime.type}
              </p>
              <p className="flex items-center font-semibold">
                <StarFilled className="text-yellow-500 mr-1" />{" "}
                {anime.avgRating}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
