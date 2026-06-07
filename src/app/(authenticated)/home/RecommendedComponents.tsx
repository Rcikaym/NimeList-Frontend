"use client";

import { useState, useEffect } from "react";
import { AnimeType } from "./types";
import AnimeSlider from "./AnimeSlider";

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

  return <AnimeSlider animes={animes} ratingKey="avgRating" />;
}