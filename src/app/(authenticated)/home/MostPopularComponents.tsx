"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StarFilled } from "@ant-design/icons";
import { Image } from "@nextui-org/react";
import { AnimeType } from "./types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

export default function MostPopular() {
  const [animes, setAnimes] = useState<AnimeType[]>([]);
  const [total, setTotal] = useState(0); // State to store the total number of items
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMostPopular = async () => {
      try {
        const response = await fetch(`${api}/anime/get-most-popular`);
        const animeData = await response.json();
        const totalItems = parseInt(
          response.headers.get("X-Total-Count") || "0"
        ); // Get total items from headers
        setAnimes(animeData);
        setTotal(totalItems);
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };
    fetchMostPopular();
  }, []);
  function NextArrow(props: any) {
    const {
      className,
      style,
      onClick,
      currentSlide,
      slideCount,
      slidesToShow,
    } = props;
    return (
      <div
        className={
          "absolute top-1/2 transform -translate-y-1/2 right-0 lg:right-4 text-white bg-black bg-opacity-0 hover:bg-opacity-80 p-2 z-10 text-center justify-center"
        }
        style={{
          ...style,
          display: currentSlide >= slideCount - slidesToShow ? "none" : "block",
        }}
        onClick={onClick}
      >
        <BiSolidRightArrow className="w-5 h-5" />
      </div>
    );
  }

  function PrevArrow(props: any) {
    const { className, style, onClick, currentSlide } = props;
    return (
      <div
        className={
          "absolute top-1/2 transform -translate-y-1/2 left-0 lg:left-4 text-white bg-black bg-opacity-0 hover:bg-opacity-80 rounded-full p-2 z-10 text-center justify-center"
        }
        style={{ ...style, display: currentSlide === 0 ? "none" : "block" }}
        onClick={onClick}
      >
        <BiSolidLeftArrow className="w-5 h-5" />
      </div>
    );
  }

  const settings = {
    infinite: false,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
    ],
  };

  return (
    <>
      {/* <ul className="flex flex-wrap gap-6 ml-20 scrollbar-hide justify-start sm:ml-10 md:ml-14 lg:ml-20"> */}
      <Slider {...settings}>
        {animes.map((anime: AnimeType) => (
          <li
            key={anime.id}
            className="max-w-[13.75rem] h-auto pb-6 ml-[4.688rem]"
            style={{ width: 220 }}
          >
            <Link
              href={`/anime/${anime.id}/${anime.title
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              <Image
                className="select-none justify-center w-full h-[18.75rem] rounded border-4 border-[#05E1C6] hover:border-[#1a7b4e] object-cover"
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
                {anime.weighted_rating}
              </p>
            </div>
          </li>
        ))}
      </Slider>
      {/* </ul> */}
    </>
  );
}
