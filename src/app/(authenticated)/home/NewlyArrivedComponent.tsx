"use client";

import { useState, useEffect } from "react";
import { AnimeType } from "./types";
import AnimeSlider from "./AnimeSlider";

export default function NewlyArrived() {
  const [animes, setAnimes] = useState<AnimeType[]>([]);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchNewlyArrived = async () => {
      try {
        const response = await fetch(`${api}/anime/get-newest?limit=21`);
        const animeData = await response.json();
        setAnimes(animeData.data);
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };
    fetchNewlyArrived();
  }, []);

  return <AnimeSlider animes={animes} ratingKey="avgRating" />;
}