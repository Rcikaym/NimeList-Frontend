"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  useEffect(() => {
    if (id) {
      // Fetch anime details using the ID
      fetch(`http://localhost:3001/animes/${id}`)
        .then((response) => response.json())
        .then((data) => setAnime(data))
        .catch((error) => console.error("Error fetching anime:", error));

      // Fetch reviews for the anime
      fetch(`http://localhost:3001/reviews?anime_id=${id}`)
        .then((response) => response.json())
        .then((data) => setReviews(data))
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [id]);

  if (!anime) {
    return (
      <div className="text-center mx-auto my-auto container">Loading...</div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-2xl ">{anime.title}</h1>
        <p>{anime.synopsis}</p>
        <div className="mt-6">
          <Image
            //   src={anime.photo_cover}
            src="/images/the-wind-rise.jpg"
            className="object-fit"
            width={300}
            height={450}
            alt={anime.title}
          />
          {/* <a
            href={anime.trailer_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch Trailer
          </a> */}
        </div>

        <div className="reviews mt-6">
          <h2 className="text-xl">Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="border-b py-2">
                  <p>
                    <strong>{review.reviewer}:</strong> {review.comment}
                  </p>
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
