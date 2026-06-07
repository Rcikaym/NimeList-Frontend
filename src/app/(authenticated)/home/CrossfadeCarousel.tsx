"use client";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
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
    <div className="flex flex-col lg:flex-row items-stretch gap-0 w-full rounded-xl overflow-hidden">

      {/* ── Image panel ── */}
      <div className="relative w-full lg:w-[45%] h-[280px] sm:h-[360px] md:h-[420px] lg:h-[520px] shrink-0 overflow-hidden">
        {animeData.map((data, index) => (
          <img
            key={index}
            src={resolveImageUrl(api, data.photo_cover)}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? "scale(1.04)" : "scale(1)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          />
        ))}

        {/* gradient overlay at bottom for mobile text bleed */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-24 lg:hidden"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        />

        {/* nav buttons */}
        <button
          aria-label="Previous"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 rounded-full p-1.5 z-10 transition"
          onClick={handlePrev}
        >
          <TiChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Next"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 rounded-full p-1.5 z-10 transition"
          onClick={handleNext}
        >
          <TiChevronRight className="w-5 h-5" />
        </button>

        {/* dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {animeData.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 h-2 bg-[#05E1C6]"
                  : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Info panel ── */}
      <div className="flex flex-col justify-center w-full lg:w-[55%] px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 select-none leading-tight">
          {currentAnime.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {currentAnime.genres.map((genre) => (
            <Chip
              key={genre}
              classNames={{ base: "bg-[#008576b7] text-white font-medium" }}
              radius="sm"
              variant="flat"
              size="sm"
            >
              {genre}
            </Chip>
          ))}
        </div>

        <p className="text-gray-300 text-sm lg:text-base leading-relaxed line-clamp-4 mb-6">
          {currentAnime.synopsis}
        </p>

        <div className="flex items-center gap-4">
          <Button
            onPress={onOpen}
            className="bg-[#1ecab6] text-black font-semibold rounded-lg hover:bg-[#00BFA3] transition"
            startContent={<PlayIcon className="w-4 h-4" />}
            size="md"
          >
            Watch Trailer
          </Button>

          {isLogin ? (
            animeFav.includes(currentAnime.id) ? (
              <button
                aria-label="Remove from favorites"
                onClick={() => handleDelFavorite(currentAnime.id)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <FaHeart className="text-xl text-rose-500" />
              </button>
            ) : (
              <button
                aria-label="Add to favorites"
                onClick={() => handleAddFavorite(currentAnime.id)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <FaRegHeart className="text-xl text-gray-400 hover:text-white transition" />
              </button>
            )
          ) : (
            <a href="/login" aria-label="Log in to favorite" className="p-2 rounded-full hover:bg-white/10 transition">
              <FaRegHeart className="text-xl text-gray-400" />
            </a>
          )}
        </div>
      </div>

      {/* ── Trailer modal ── */}
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