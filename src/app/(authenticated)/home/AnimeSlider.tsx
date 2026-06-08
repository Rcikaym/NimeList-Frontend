/**
 * AnimeSlider — shared slider card component used by
 * MostPopularComponents, NewlyArrivedComponent, and RecommendedComponents.
 */
"use client";

import Link from "next/link";
import { StarFilled } from "@ant-design/icons";
import { Image } from "@nextui-org/react";
import { AnimeType } from "./types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { resolveImageUrl } from "@/mocks/mockApi";

interface AnimeSliderProps {
  animes: AnimeType[];
  ratingKey?: "weighted_rating" | "avgRating";
}

function NextArrow(props: any) {
  const { style, onClick, currentSlide, slideCount, slidesToShow } = props;
  const hidden = currentSlide >= slideCount - slidesToShow;
  return (
    <div
      className="absolute top-[42%] -translate-y-1/2 right-[-36px] lg:right-[-44px] text-white hover:text-[#05E1C6] rounded-full p-1 z-10 cursor-pointer transition-colors"
      style={{ ...style, display: hidden ? "none" : "flex" }}
      onClick={onClick}
    >
      <TiChevronRight className="w-7 h-7" />
    </div>
  );
}

function PrevArrow(props: any) {
  const { style, onClick, currentSlide } = props;
  return (
    <div
      className="absolute top-[42%] -translate-y-1/2 left-[-36px] lg:left-[-44px] text-white hover:text-[#05E1C6] rounded-full p-1 z-10 cursor-pointer transition-colors"
      style={{ ...style, display: currentSlide === 0 ? "none" : "flex" }}
      onClick={onClick}
    >
      <TiChevronLeft className="w-7 h-7" />
    </div>
  );
}

const sliderSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 6,
  initialSlide: 0,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1500, settings: { slidesToShow: 5, slidesToScroll: 3 } },
    {
      breakpoint: 1200,
      settings: { slidesToShow: 4, slidesToScroll: 2, arrows: false },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3, slidesToScroll: 2, arrows: false },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
    },
    {
      breakpoint: 420,
      settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
    },
  ],
};

export default function AnimeSlider({
  animes,
  ratingKey = "avgRating",
}: AnimeSliderProps) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  if (animes.length === 0)
    return (
      <div className="flex gap-4 px-4 md:px-12 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[160px]">
            <div className="h-[220px] rounded bg-white/5 animate-pulse" />
            <div className="mt-2 h-4 w-3/4 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="px-4 md:px-12">
      <Slider {...sliderSettings}>
        {animes.map((anime) => (
          <div key={anime.id} className="pb-4 px-1">
            <div className="group w-full">
              <Link href={`/anime/${anime.slug}`}>
                <div className="relative overflow-hidden rounded-lg border border-[#05E1C6]/30 group-hover:border-[#05E1C6] transition-colors duration-300">
                  <Image
                    className="select-none w-full h-[200px] sm:h-[240px] object-cover transition-transform duration-300 group-hover:scale-105"
                    src={resolveImageUrl(api, anime.photo_cover)}
                    alt={anime.title}
                    width={220}
                    height={300}
                    style={{ borderRadius: "0.5rem" }}
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
                </div>
              </Link>
              <div className="mt-2 pr-1">
                <Link href={`/anime/${anime.slug}`}>
                  <h5 className="truncate text-sm font-semibold text-white group-hover:text-[#05E1C6] transition-colors leading-snug">
                    {anime.title}
                  </h5>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {{ movie: "Movie", series: "TV Series" }[anime.type] ??
                    anime.type}
                </p>
                <p className="flex items-center gap-1 text-xs font-medium text-gray-300 mt-0.5">
                  <StarFilled className="text-yellow-400 text-[10px]" />
                  {anime[ratingKey] ?? "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
