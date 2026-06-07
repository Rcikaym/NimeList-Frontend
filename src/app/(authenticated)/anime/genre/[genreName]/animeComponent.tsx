"use client";
import { useEffect, useState } from "react";
import { AnimeType } from "./types";
import Link from "next/link";
import Image from "next/image";
import { StarFilled } from "@ant-design/icons";
import { resolveImageUrl } from "@/mocks/mockApi";

export const Animelist = ({ params }: { params: { genreName: string } }) => {
  const { genreName } = params;
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [anime, setAnime] = useState<AnimeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/anime/get/by-genre/${genreName}`);
        if (!response.ok) throw new Error("Error fetching anime");
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [genreName]);

  if (!genreName) return <p className="text-white px-4">Genre not found.</p>;

  if (loading)
    return (
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="w-full">
            <div className="h-[220px] sm:h-[260px] rounded-lg bg-white/5 animate-pulse" />
            <div className="mt-2 h-3.5 w-3/4 rounded bg-white/5 animate-pulse" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-white/5 animate-pulse" />
          </li>
        ))}
      </ul>
    );

  if (anime.length === 0)
    return (
      <p className="text-gray-400 px-4 mt-6 text-sm">
        No anime found for this genre.
      </p>
    );

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 px-4">
      {anime.map((item, index) => (
        <li key={item.id} className="group w-full">
          <Link href={`/anime/${item.slug}`}>
            <div className="relative overflow-hidden rounded-lg border border-[#05E1C6]/30 group-hover:border-[#05E1C6] transition-colors duration-300">
              <Image
                className="w-full h-[220px] sm:h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
                src={resolveImageUrl(api, item.photo_cover)}
                alt={item.title}
                width={220}
                height={300}
                priority={index < 6}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          </Link>
          <div className="mt-2 pr-1">
            <Link href={`/anime/${item.slug}`}>
              <h5 className="truncate text-sm font-semibold text-white group-hover:text-[#05E1C6] transition-colors leading-snug">
                {item.title}
              </h5>
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">{item.type}</p>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-300 mt-0.5">
              <StarFilled className="text-yellow-400 text-[10px]" />
              {item.avgRating ?? "—"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Animelist;