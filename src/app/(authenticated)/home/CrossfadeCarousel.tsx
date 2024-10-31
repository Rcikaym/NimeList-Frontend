"use client";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { BiBookmarkPlus } from "react-icons/bi";
import { TiChevronRight, TiChevronLeft } from "react-icons/ti";
import { AnimeType } from "./types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { HeroVideoDialog } from "@/components/magicui/HeroVideoPlayer";

interface CarouselProps {
  interval: number; // interval in milliseconds
}

const CrossfadeCarousel: React.FC<CarouselProps> = ({ interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animeData, setAnimeData] = useState<AnimeType[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Fetch anime data from the API
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(`${api}/anime/get-newest`);
        const { data } = await response.json();
        setAnimeData(data);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnimeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % animeData.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, animeData.length, interval]);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % animeData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + animeData.length) % animeData.length);
  };

  if (animeData.length === 0) return <div>Loading...</div>;

  const currentAnime = animeData[currentIndex];

  return (
    <>
      {/* Left content (carousel) */}
      <div className="w-[52.625rem] h-[57.934rem] lg:w-1/2 lg:h-auto relative overflow-hidden">
        <div className="flex justify-center items-center h-full">
          {animeData.map((data, index) => (
            <img
              key={index}
              src={`${api}/${data.photo_cover.replace(/\\/g, "/")}`}
              alt={`Carousel item ${index}`}
              className={`absolute w-auto h-full object-contain transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-5xl font-bold mb-2 select-none">
          {currentAnime.title}
        </h1>
        <div className="flex gap-2">
          {currentAnime.genres.map((genre: any) => (
            <Chip
              key={genre.id}
              classNames={{
                base: "bg-[#008576b7] text-white font-medium m-0",
              }}
              radius="sm"
              variant="flat"
              size="sm"
            >
              {genre.name}
            </Chip>
          ))}
        </div>
        <p className="text-gray-300 mb-6 text-sm lg:text-base line-clamp-4">
          {currentAnime.synopsis}
        </p>
        <div className="flex items-center mb-6">
          <Button
            onPress={onOpen}
            className="bg-[#1ecab6] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00BFA3] transition duration-300"
            startContent={<PlayIcon className="w-5 h-5" />}
          >
            WATCH THE TRAILER
          </Button>
          <span className="lg:inline-block mx-4 text-gray-400 select-none">
            |
          </span>
          <a>
            <BiBookmarkPlus className="text-2xl mt-0 lg:mt-0" />
          </a>
        </div>
      </div>
      {/* Navigation buttons (prev and next) */}
      <button
        className="absolute h-full top-0 left-0 p-4 text-white bg-black bg-opacity-0 hover:bg-opacity-100 "
        onClick={handlePrev}
      >
        <TiChevronLeft className="text-2xl" />
      </button>
      <button
        className="absolute h-full top-0 right-0 p-4 text-white bg-black bg-opacity-0 hover:bg-opacity-100 "
        onClick={handleNext}
      >
        <TiChevronRight className="text-2xl" />
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalBody>
              <div className="w-full h-full">
                <HeroVideoDialog
                  className="hidden dark:block"
                  animationStyle="from-center"
                  videoSrc={currentAnime.trailer_link}
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                />
                <HeroVideoDialog
                  className="dark:hidden block"
                  animationStyle="from-center"
                  videoSrc={currentAnime.trailer_link}
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                />
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CrossfadeCarousel;
