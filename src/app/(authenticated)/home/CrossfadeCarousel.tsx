"use client";
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon, BookmarkIcon as RegBookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { AnimeType } from "./types";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { HeroVideoDialog } from "@/components/magicui/HeroVideoPlayer";
import apiUrl from "@/hooks/api";
import { getAccessToken } from "@/utils/auth";
import { resolveImageUrl } from "@/mocks/mockApi";

interface CarouselProps {
  interval: number;
}

const CrossfadeCarousel: React.FC<CarouselProps> = ({ interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animeData, setAnimeData] = useState<AnimeType[]>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [animeFav, setAnimeFav] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    const token = getAccessToken();
    if (token) {
      getAnimeFavorited();
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    if (animeData.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeData.length);
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex, animeData.length, interval]);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % animeData.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + animeData.length) % animeData.length);

  const getAnimeFavorited = async () => {
    try {
      const response = await apiUrl.get("/favorite-anime/user-favorites");
      setAnimeFav(response.data);
    } catch (error) {
      console.error("Error fetching favorite:", error);
    }
  };

  const handleAddFavorite = async (id_anime: string) => {
    try {
      await apiUrl.post("/favorite-anime/post", { id_anime });
      getAnimeFavorited();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDelFavorite = async (id_anime: string) => {
    try {
      await apiUrl.delete("/favorite-anime/delete/", { data: { id_anime } });
      getAnimeFavorited();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (animeData.length === 0)
    return (
      <div className="w-full h-[320px] md:h-[420px] rounded-xl bg-white/5 animate-pulse" />
    );

  const currentAnime = animeData[currentIndex];

  return (
    <div className="relative w-full px-10 md:px-14 lg:px-16 py-4">
      {/* ── Outer Chevrons ── */}
      <button
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-20"
        onClick={handlePrev}
      >
        <ChevronLeftIcon className="w-8 h-8 md:w-10 md:h-10" />
      </button>
      <button
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-20"
        onClick={handleNext}
      >
        <ChevronRightIcon className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto">
        {/* ── Image panel ── */}
        <div className="relative w-full lg:w-[45%] h-[300px] sm:h-[380px] md:h-[440px] lg:h-[520px] shrink-0 overflow-hidden bg-black rounded-lg">
          {animeData.map((data, index) => (
            <img
              key={index}
              src={resolveImageUrl(api, data.backdrop)}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transform: index === currentIndex ? "scale(1.04)" : "scale(1)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            />
          ))}

          {/* Vignette overlays for smooth blending into black background */}
          <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-[25%] bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-[15%] bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </div>

        {/* ── Info panel ── */}
        <div className="flex flex-col justify-between w-full lg:w-[50%] min-h-[300px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[520px] py-4">
          <div className="flex flex-col justify-center my-auto">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight font-serif tracking-normal">
              {currentAnime.title}
            </h1>

            {/* Genres */}
            <div className="text-gray-400 italic text-xs md:text-sm mb-4 font-sans select-none">
              {currentAnime.genres.join(", ")}
            </div>

            {/* Synopsis */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-sans line-clamp-5 max-w-xl">
              {currentAnime.synopsis}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onPress={onOpen}
                className="bg-[#05E1C6] hover:bg-[#04C4B0] text-white font-bold px-6 py-2.5 rounded-md transition duration-200 tracking-wider text-xs uppercase"
                startContent={<PlayIcon className="w-4 h-4 stroke-[3]" />}
                size="md"
              >
                Watch the Trailer
              </Button>

              {isLogin ? (
                animeFav.includes(currentAnime.id) ? (
                  <button
                    aria-label="Remove from favorites"
                    onClick={() => handleDelFavorite(currentAnime.id)}
                    className="p-2.5 rounded-md hover:bg-white/5 transition border border-gray-800"
                  >
                    <SolidBookmarkIcon className="w-5 h-5 text-[#05E1C6]" />
                  </button>
                ) : (
                  <button
                    aria-label="Add to favorites"
                    onClick={() => handleAddFavorite(currentAnime.id)}
                    className="p-2.5 rounded-md hover:bg-white/5 transition border border-gray-800"
                  >
                    <RegBookmarkIcon className="w-5 h-5 text-[#05E1C6] hover:text-white" />
                  </button>
                )
              ) : (
                <a
                  href="/login"
                  aria-label="Log in to favorite"
                  className="p-2.5 rounded-md hover:bg-white/5 transition border border-gray-800 flex items-center justify-center"
                >
                  <RegBookmarkIcon className="w-5 h-5 text-[#05E1C6]" />
                </a>
              )}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-end gap-1.5 mt-auto pt-6 pr-4">
            {animeData.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-10 bg-[#05E1C6]"
                    : "w-6 bg-[#004d40]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          <ModalBody>
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc={currentAnime.trailer_link}
              thumbnailSrc={
                currentAnime.backdrop === null
                  ? "https://startup-template-sage.vercel.app/hero-light.png"
                  : resolveImageUrl(api, currentAnime.backdrop)
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CrossfadeCarousel;