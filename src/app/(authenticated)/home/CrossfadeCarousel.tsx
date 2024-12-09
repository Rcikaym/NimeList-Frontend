"use client";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { BiBookmarkHeart, BiBookmarkPlus } from "react-icons/bi";
import { TiChevronRight, TiChevronLeft } from "react-icons/ti";
import { AnimeType } from "./types";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { HeroVideoDialog } from "@/components/magicui/HeroVideoPlayer";
import apiUrl from "@/hooks/api";
import { getAccessToken } from "@/utils/auth";

interface CarouselProps {
  interval: number;
}

const CrossfadeCarousel: React.FC<CarouselProps> = ({ interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animeData, setAnimeData] = useState<AnimeType[]>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [animeFav, setAnimeFav] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const token = getAccessToken();
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(`${api}/anime/get-newest?limit=3`);
        const { data } = await response.json();
        setAnimeData(data);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnimeData();
  }, []);

  useEffect(() => {
    if (token) {
      getAnimeFavorited();
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % animeData.length);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, animeData.length, interval]);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % animeData.length);
  };

  const getAnimeFavorited = async () => {
    try {
      const response = await apiUrl.get("/favorite-anime/user-favorites");
      setAnimeFav(await response.data);
    } catch (error) {
      console.error("Error fetching favorite:", error);
    }
  };

  const handleAddFavorite = async (id_anime: string) => {
    try {
      await apiUrl.post("/favorite-anime/post", {
        id_anime: id_anime,
      });
      getAnimeFavorited();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDelFavorite = async (id_anime: string) => {
    try {
      await apiUrl.delete("/favorite-anime/delete/", {
        data: {
          id_anime: id_anime,
        },
      });
      getAnimeFavorited();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + animeData.length) % animeData.length);
  };

  if (animeData.length === 0) return <div>Loading...</div>;

  const currentAnime = animeData[currentIndex];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center relative w-full h-auto overflow-hidden">
      {/* Left content (carousel) */}
      <div className="w-full lg:w-1/2 h-[350px] lg:h-[57.934rem] relative overflow-hidden shadow-lg rounded-lg">
        <div className="flex justify-center items-center h-full">
          {animeData.map((data, index) => (
            <img
              key={index}
              src={`${api}/images/${currentAnime.photo_cover}`}
              alt={`Carousel item ${index}`}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out transform ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              } shadow-lg rounded-lg`}
              style={{
                transform: index === currentIndex ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex flex-col items-start justify-center w-full lg:w-1/2 p-4 md:p-6 lg:p-10 text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 select-none">
          {currentAnime.title}
        </h1>
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
          {currentAnime.genres.map((genre) => (
            <Chip
              key={genre}
              classNames={{
                base: "bg-[#008576b7] text-white font-medium m-0",
              }}
              radius="sm"
              variant="flat"
              size="sm"
            >
              {genre}
            </Chip>
          ))}
        </div>
        <p className="text-gray-300 mb-6 text-sm lg:text-base px-4 lg:px-0 line-clamp-4">
          {currentAnime.synopsis}
        </p>
        <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
          <Button
            onPress={onOpen}
            className="bg-[#1ecab6] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#00BFA3] transition duration-300"
            startContent={<PlayIcon className="w-5 h-5" />}
          >
            WATCH THE TRAILER
          </Button>

          {animeFav.includes(currentAnime.id) && isLogin ? (
            <button onClick={() => handleDelFavorite(currentAnime.id)}>
              <BiBookmarkHeart className="text-2xl text-gray-400" />
            </button>
          ) : isLogin ? (
            <button onClick={() => handleAddFavorite(currentAnime.id)}>
              <BiBookmarkPlus className="text-2xl text-gray-400" />
            </button>
          ) : (
            <a href="/login">
              <BiBookmarkPlus className="text-2xl text-gray-400" />
            </a>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute top-1/2 transform -translate-y-1/2 left-1 text-white bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-2"
        onClick={handlePrev}
      >
        <TiChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute top-1/2 transform -translate-y-1/2 right-1 text-white bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-2"
        onClick={handleNext}
      >
        <TiChevronRight className="w-6 h-6" />
      </button>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          <ModalBody>
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc={currentAnime.trailer_link}
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CrossfadeCarousel;
