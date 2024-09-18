"use client";

// import "/globals.css";
import { useEffect, useState } from "react";
import { Image } from "antd";
import { Button } from "@nextui-org/react";
import { BiPlus, BiSolidStar, BiStar, BiMessageAdd } from "react-icons/bi";
import { Spacer } from "@nextui-org/react";
import { Rate } from "antd";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

type Anime = {
  id: number;
  title: string;
  type: string;
  rating: number;
  synopsis: string;
  trailer_link: string;
  release_date: string;
  photo_cover: string;
  genre: string[];
  episode: number;
};

type Review = {
  id: number;
  anime_id: number;
  reviewer: string;
  comment: string;
  rating: number;
};

type AnimeDetailProps = {
  params: {
    id: string;
    title: string;
  };
};

const AnimeDetail: React.FC<AnimeDetailProps> = ({ params }) => {
  const { id, title } = params;
  const [anime, setAnime] = useState<Anime | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch anime details using the ID
          const animeResponse = await fetch(
            `http://localhost:3001/animes/${id}`
          );
          if (!animeResponse.ok) {
            throw new Error("Error fetching anime");
          }
          const animeData = await animeResponse.json();
          setAnime(animeData);

          // Fetch reviews for the anime
          const reviewsResponse = await fetch(
            `http://localhost:3001/reviews?anime_id=${id}`
          );
          if (!reviewsResponse.ok) {
            throw new Error("Error fetching reviews");
          }
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!anime) {
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
          <h1 className="text-5xl font-jakarta font-bold m-0">{anime.title}</h1>
          <p className="text-gray-500 font-semibold mb-0 mt-2">
            {anime.type} • {anime.release_date}
          </p>
        </div>
        <div className="flex mb-5">
          {/* <div className="flex flex-col"> */}
          <div className="pt-3 w-full max-w-xs h-auto">
            <Image
              //   src={anime.photo_cover}
              src="/images/the-wind-rise.jpg"
              width={300} // 2:3 aspect ratio (300x450)
              height={450}
              className="object-cover w-full"
              alt={anime.title}
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
              src="https://www.youtube.com/embed/PhHoCnRg1Yw?si=ST2GFJQJj99I53JR"
              title="The Wind Rises Trailer"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="flex flex-row mt-3">
              {/* Genre Tags */}
              <div className="flex space-x-2 mb-4">
                {anime.genre.map((genre) => (
                  <Chip
                    key={genre}
                    classNames={{
                      base: "bg-[#008576b7] text-white font-medium",
                    }}
                    variant="flat"
                    size="md"
                  >
                    {genre}
                  </Chip>
                ))}
              </div>
            </div>
            <ScrollShadow className="w-[900px] max-h-[150px]" hideScrollBar>
              <p className="text-[#f5f5f5] opacity-100 font-medium scroll-smooth">
                {anime.synopsis}
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
                    <span className="text-4xl font-bold">{anime.rating}</span>
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
                  <Button
                    onPress={onOpen}
                    className="bg-transparent text-xl font-semibold text-[#05E5CB]"
                  >
                    {/* {reviews.rating ? reviews.rating : "Not rated"} */} RATE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          backdrop="opaque"
          classNames={{
            base: "bg-[#014A42] items-center",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader></ModalHeader>
                <ModalBody>
                  <Rate
                    allowClear={false}
                    allowHalf
                    defaultValue={10}
                    count={10}
                    // className="size-28"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="text-foreground-100"
                    variant="light"
                    onPress={onClose}
                    size="sm"
                  >
                    Not Now
                  </Button>
                  <Button
                    className="text-foreground-100 bg-[#03302b]"
                    size="sm"
                    onPress={onClose}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className="reviews mt-6">
          <div className="flex justify-between">
            <h2 className="text-xl underline font-bold text-[#05E5CB] select-none">
              {reviews.length} REVIEWS
            </h2>
            <button>
              <span className="flex items-center text-[#05E5CB]">
                <BiMessageAdd className="w-[24px] h-[24px] mt-1 mr-1" />
                Add Review
              </span>
            </button>
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
                  <h2 className="font-bold">{review.reviewer}</h2>
                  <p>{review.comment}</p>
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
