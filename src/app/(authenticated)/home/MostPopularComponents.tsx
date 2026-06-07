"use client";

import { useState, useEffect } from "react";
import { AnimeType } from "./types";
import AnimeSlider from "./AnimeSlider";

export default function MostPopular() {
  const [animes, setAnimes] = useState<AnimeType[]>([]);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMostPopular = async () => {
      try {
        const response = await fetch(`${api}/anime/get-most-popular`);
        const animeData = await response.json();
        setAnimes(animeData);
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };
    fetchMostPopular();
  }, []);

  return <AnimeSlider animes={animes} ratingKey="weighted_rating" />;
}