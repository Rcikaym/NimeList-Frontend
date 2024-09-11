"use client";

import { LeftCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Image, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AiFillStar,
  AiFillTags,
  AiOutlineCalendar,
  AiOutlinePaperClip,
  AiOutlinePlayCircle,
  AiOutlineStar,
  AiOutlineTags,
} from "react-icons/ai";

interface GenreType {
  id: string;
  name: string;
}

interface PhotosType {
  id: string;
  file_path: string;
}

interface AnimeType {
  anime: {
    title: string;
    synopsis: string;
    release_date: string;
    trailer_link: string;
    photos: PhotosType[];
    photo_cover: string;
    type: string;
    genres: GenreType[];
    created_at: string;
    updated_at: string;
  };
  averageRating: number;
}

import { useParams } from "react-router-dom";

const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Mengambil id dari URL
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4321/anime/get/${id}`
        );
        setAnime(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setError("Failed to fetch anime data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!anime) return <div>No anime data found</div>;

  const {
    title,
    photo_cover,
    synopsis,
    release_date,
    type,
    genres,
    trailer_link,
    photos,
    created_at,
    updated_at,
  } = anime.anime;

  const formatDateTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 karena bulan dimulai dari 0
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="p-2 text-lg font-semibold mb-3 rounded-lg bg-emerald-700">
        Anime Details
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex items-center">
          {/* Left column for image */}
          <div className="md:w-1/3 justify-center p-2 ml-3">
            {photo_cover && (
              <div>
                <Image
                  alt={title}
                  className="w-full h-auto object-cover rounded-md shadow-md hover:shadow-xl transition-shadow"
                  src={`http://localhost:4321/${photo_cover.replace(
                    /\\/g,
                    "/"
                  )}`}
                />
              </div>
            )}
          </div>

          {/* Right column for details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>

            <div className="flex mt-2">
              <AiOutlineCalendar className="mr-1 text-emerald-700" size={20} />
              <div className="flex gap-2">
                <h2 className="text-gray-800">Release Date:</h2>
                <span className="text-gray-800">{release_date}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <div className="flex gap-2">
                <div className="flex">
                  <AiOutlinePlayCircle
                    className="mr-1 text-emerald-700"
                    size={20}
                  />
                  <h2 className="text-gray-800">Type: </h2>
                </div>
                <span className="text-gray-800">{type}</span>
              </div>
              <div className="flex gap-2">
                <div className="flex">
                  <AiFillStar
                    className="mr-1"
                    style={{ color: "#fadb14" }}
                    size={20}
                  />
                  <h2 className="text-gray-800">Rating:</h2>
                </div>
                <span className="text-gray-800">{anime.averageRating}</span>
              </div>
            </div>

            {trailer_link && (
              <>
                <div className="flex gap-2 mt-2">
                  <h2 className="text-gray-800 flex items-center">
                    <AiOutlinePaperClip
                      className="mr-1 text-emerald-700"
                      size={20}
                    />
                    Trailer Link:
                  </h2>
                  <a
                    href={trailer_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    <span>{trailer_link}</span>
                  </a>
                </div>
              </>
            )}

            <div className="flex gap-2 items-center mb-3">
              <h2 className="text-gray-800 flex mt-2">
                <AiOutlineTags className="mr-1 text-emerald-700" size={20} />
                Genres:
              </h2>
              <div className="flex gap-2">
                {genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-xl px-2 py-1 text-sm bg-emerald-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-1">
              <span className="text-sm text-gray-600">
                Created At: {formatDateTime(created_at)}
              </span>
              <span className="text-sm text-gray-600">
                Updated At: {formatDateTime(updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Synopsis
          </h2>
          <p className="text-gray-600">{synopsis}</p>
        </div>

        {/* Photo gallery */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Photo Gallery
          </h2>
          <div className="flex gap-4 grid-cols-4">
            {photos?.map((photo, index) => (
              <>
                <div key={index}>
                  <Image
                    src={`http://localhost:4321/${photo.file_path.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={`${title} - Photo ${index + 1}`}
                    className="rounded-lg shadow-md hover:shadow-xl transition-shadow"
                    height={180}
                    width={280}
                  />
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      <div className="p-2 flex justify-end text-lg font-semibold mt-3 rounded-lg bg-emerald-700">
        <Button icon={<LeftCircleOutlined />} href="/dashboard/anime">
          Back
        </Button>
      </div>
    </>
  );
};

export default AnimeDetails;
