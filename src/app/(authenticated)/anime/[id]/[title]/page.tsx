"use client";

import { useEffect, useState } from "react";
import { Image } from "antd";
import { Button } from "@nextui-org/react";
import { BiPlus, BiSolidStar, BiStar, BiMessageAdd } from "react-icons/bi";
import { Spacer } from "@nextui-org/react";
import { Rate } from "antd";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/react";
import DisplayLongText from "@/components/DisplayLongText";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { AnimeType, GenreType, ReviewType } from "./types";
import ReviewModal from "./RateComponent";

type AnimeDetailProps = {
  params: {
    id: string;
    title: string;
  };
};

const AnimeDetail: React.FC<AnimeDetailProps> = ({ params }) => {
  const { id } = params;
  const [animeData, setAnimeData] = useState<AnimeType | null>(null); // State for anime data
  const [genres, setGenres] = useState<GenreType[]>([]); // State for genres
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch anime details using the ID
          const response = await fetch(
            // `http://localhost:3001/animes/${id}`
            `${api}/anime/get/${id}`
          );
          if (!response.ok) {
            throw new Error("Error fetching anime");
          }
          const data = await response.json();
          setAnimeData(data);
          setGenres(data.genres);
          setReviews(data.review.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!animeData) {
    return (
      <div className="w-full h-full text-center mx-auto my-auto container">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-6">
        <div className="w-full h-[88px] gap-1">
          <h1 className="text-5xl font-bold m-0">{animeData.anime.title}</h1>
          <p className="text-gray-500 font-semibold mb-0 mt-3">
            {animeData.anime.type} • {animeData.anime.release_date}
          </p>
        </div>
        <div className="flex mb-5">
          {/* <div className="flex flex-col"> */}
          <div className="pt-3 w-full max-w-xs h-auto">
            <Image
              //   src={anime.photo_cover}
              src={`${api}/${animeData.anime.photo_cover.replace(/\\/g, "/")}`}
              width={300} // 2:3 aspect ratio (300x450)
              height={450}
              className="object-cover w-full"
              alt={animeData.anime.title}
            />
            <Button
              size="lg"
              radius="sm"
              startContent={<BiPlus />}
              // color="success"
              className="w-[300px] mt-3 text-white bg-[#014A42]"
            >
              Add To Favorite
            </Button>
          </div>
          <Spacer x={5} />
          <div className="h-full">
            <iframe
              className="w-[900px] h-[471px] pt-3 select-none"
              src={animeData.anime.trailer_link}
              title={animeData.anime.title}
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="flex flex-row mt-3">
              {/* Genre Tags */}
              <div className="flex space-x-2 mb-4">
                {genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    classNames={{
                      base: "bg-[#008576b7] text-white font-medium",
                    }}
                    variant="flat"
                    size="md"
                  >
                    {genre.name}
                  </Chip>
                ))}
              </div>
            </div>
            <ScrollShadow className="w-[900px] max-h-[150px]" hideScrollBar>
              <p className="text-[#f5f5f5] opacity-100 font-medium scroll-smooth tracking-wider">
                <DisplayLongText text={animeData.anime.synopsis} />
              </p>
            </ScrollShadow>
          </div>
          <Spacer x={5} />
          <div className="pt-3 font-jakarta">
            <div className="mb-1 w-[228px] h-[228px] relative rounded-r-md p-[2px] bg-gradient-to-b from-[#00CAB2] to-[#037F71]">
              <div className="w-full h-full bg-[#151515] rounded-r-md flex items-center justify-center">
                <div className="text-center p-4 text-white">
                  <div className="flex items-center justify-center">
                    <BiSolidStar className="w-[30px] h-[30px] text-[#ffd500] mr-2" />
                    <span className="text-4xl font-bold">
                      {animeData.avgRating}
                    </span>
                    <span className="text-xl font-bold opacity-70">/10</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">AVG. RATING</p>
                </div>
              </div>
            </div>

            <div className="mt-1 w-[228px] h-[228px] relative rounded-r-md p-[2px] bg-gradient-to-b from-[#00CAB2] to-[#037F71]">
              <div className="w-full h-full bg-[#151515] rounded-r-md flex items-center justify-center">
                <div className="flex flex-col justify-center text-center items-center p-4 text-white">
                  <p className="text-xl font-semibold">YOUR RATING</p>
                  <BiStar className="w-[69px] h-[69px] text-[#05E5CB]" />
                  {/* <Button
                    onPress={onOpen}
                    className="bg-transparent text-xl font-semibold text-[#05E5CB]"
                  >
                    {/* {reviews.rating ? reviews.rating : "Not rated"} */}
                  {/* </Button> */} 
                    <ReviewModal animeId={id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews mt-6">
          <div className="flex justify-between">
            <h2 className="text-xl underline font-bold text-[#05E5CB] select-none">
              {reviews.length} REVIEWS
            </h2>
          </div>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="container border rounded-lg border-[#05e5cbc3] p-5 my-5"
                >
                  <h2 className="font-bold">{review.username}</h2>
                  <p>{review.review}</p>
                  <p>Rating: {review.rating}/10</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AnimeDetail;
