"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StarFilled } from "@ant-design/icons";
import { Image } from "@nextui-org/react";
import { AnimeType } from "./types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";

export default function Recommended() {
  const [animes, setAnimes] = useState<AnimeType[]>([]);

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(`${api}/anime/recommended`);
        const animeData = await response.json();
        setAnimes(animeData);
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };
    fetchRecommended();
  }, []);

  function NextArrow(props: any) {
    const { style, onClick, currentSlide, slideCount, slidesToShow } = props;
    return (
      <div
        className={
          "absolute top-[40%] transform -translate-y-1/2 right-[-50px] lg:right-[-40px] text-white bg-black bg-opacity-0 hover:bg-opacity-80 rounded-full p-2 z-10 text-center cursor-pointer justify-center"
        }
        style={{
          ...style,
          display: currentSlide >= slideCount - slidesToShow ? "none" : "block",
        }}
        onClick={onClick}
      >
        <TiChevronRight className="w-8 h-8" />
      </div>
    );
  }

  function PrevArrow(props: any) {
    const { style, onClick, currentSlide } = props;
    return (
      <div
        className={
          "absolute top-[40%] transform -translate-y-1/2 left-[-50px] lg:left-[-40px] text-white bg-black bg-opacity-0 hover:bg-opacity-80 rounded-full p-2 z-10 text-center cursor-pointer justify-center"
        }
        style={{ ...style, display: currentSlide === 0 ? "none" : "block" }}
        onClick={onClick}
      >
        <TiChevronLeft className="w-8 h-8" />
      </div>
    );
  }

  const settings = {
    infinite: false, // No infinite looping
    speed: 1500, // Faster transition for a better UX
    slidesToShow: 7, // Default number of visible items on large screens
    slidesToScroll: 6, // Scroll 7 items per click
    initialSlide: 0, // Start at the first item
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1500, // Extra large screens
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1200, // Large screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // Small tablets and large phones
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Small phones
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Remove arrows for small screens for better UX
        },
      },
    ],
  };

  return (
    <>
      <div className="pl-12 pr-12">
        <Slider {...settings}>
          {animes.map((anime: AnimeType) => (
            <div
              key={anime.id}
              className="w-full h-full pb-6 justify-items-center"
            >
              <div className="w-[13.75rem]">
                <Link
                  href={`/anime/${anime.slug}`}
                >
                  <Image
                    className="select-none justify-center w-full h-[18.75rem] rounded border-4 border-[#05E1C6] hover:border-[#1a7b4e] object-cover"
                    src={`${api}/${anime.photo_cover}`}
                    alt={anime.title}
                    width={220}
                    height={300}
                  />
                </Link>
                <div className="mt-3 mb-3 mr-3">
                  <Link
                    href={`/anime/${anime.slug}`}
                  >
                    <h5 className="truncate mb-[2px] text-lg font-bold tracking-tight text-gray-900 dark:text-white">
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
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
