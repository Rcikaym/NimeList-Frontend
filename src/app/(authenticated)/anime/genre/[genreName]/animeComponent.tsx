'use client';
import { useEffect, useState } from "react";
import { AnimeType } from "./types";
import Link from "next/link";
import Image from "next/image";
import { StarFilled } from "@ant-design/icons";

interface AnimeGenreProps {
  params: { genreName: string };
}

const Animelist: React.FC<AnimeGenreProps> = ({ params }) => {
  const { genreName } = params;
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [anime, setAnime] = useState<AnimeType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}/anime/get/by-genre/${genreName}`);
        if (!response.ok) throw new Error("Error fetching anime");
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [genreName]);

  if (!genreName) return <div>Genre not found</div>;

  return (
    <ul className="place-items-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {anime.map((anime: AnimeType, index) => (
        <li key={anime.id} className="w-full max-w-[13.75rem] shadow mb-6">
          <Link href={`/anime/${anime.slug}`}>
            <Image
              className="w-full h-[300px] rounded border-4 border-[#05E1C6] hover:border-[#1a7b4e] object-cover"
              src={`http://localhost:4321/${anime.photo_cover.replace(/\\/g, "/")}`}
              alt={anime.title}
              width={220}
              height={300}
              priority={index < 5} // Preload first 5 images
            />
          </Link>
          <div className="mt-3 mb-3">
            <Link href={`/anime/${anime.slug}`}>
              <h5
                className="truncate text-lg font-bold text-gray-900 dark:text-white"
                style={{ minHeight: "1.5em" }} // Reserve space for title
              >
                {anime.title}
              </h5>
            </Link>
            <p className="mb-1 text-gray-700 dark:text-gray-400">{anime.type}</p>
            <p className="flex items-center font-semibold">
              <StarFilled className="text-yellow-500 mr-1" /> {anime.avgRating}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Animelist;
