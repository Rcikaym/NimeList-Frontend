import React, { memo } from "react";
import {
  AiOutlineCalendar,
  AiOutlinePlayCircle,
  AiOutlineStar,
  AiOutlinePaperClip,
  AiOutlineTags,
} from "react-icons/ai";
import { AnimeType, GenreType } from "./types";

interface AnimeMetadataProps {
  anime: AnimeType["anime"];
  averageRating: number;
  totalFav: number;
  genres: GenreType[];
}

const AnimeMetadata: React.FC<AnimeMetadataProps> = memo(
  ({ anime, averageRating, totalFav, genres }) => {
    return (
      <>
        {/* Release Date */}
        <div className="flex mt-auto">
          <AiOutlineCalendar className="mr-1 text-emerald-700" size={20} />
          <div className="flex gap-1">
            <h2 className="text-gray-800">Release Date:</h2>
            <span className="text-gray-800">{anime.release_date}</span>
          </div>
        </div>

        {/* Episodes and Type */}
        <div className="flex gap-2 mt-2">
          <div className="flex gap-1">
            <AiOutlinePlayCircle className="mr-1 text-emerald-700" size={20} />
            <h2 className="text-gray-800">Episodes:</h2>
            <span className="text-gray-800">{anime.episodes}</span>
          </div>
          <div className="flex gap-1">
            <h2 className="text-gray-800">Type:</h2>
            <span className="text-gray-800">{anime.type}</span>
          </div>
        </div>

        {/* Rating and Favorites */}
        <div className="flex mt-2 gap-2">
          <div className="flex">
            <AiOutlineStar className="mr-1 text-emerald-700" size={20} />
            <div className="flex gap-1">
              <h2 className="text-gray-800">Rating:</h2>
              <span className="text-gray-800">{averageRating}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <h2 className="text-gray-800">Total Fav:</h2>
            <span className="text-gray-800">{totalFav}</span>
          </div>
        </div>

        {/* Trailer and Watch Links */}
        {anime.trailer_link && anime.watch_link && (
          <>
            <div className="flex gap-1 mt-2">
              <h2 className="text-gray-800 flex">
                <AiOutlinePaperClip
                  className="mr-1 text-emerald-700"
                  size={20}
                />
                Trailer Link:
              </h2>
              <a
                href={anime.trailer_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-500"
              >
                <span>{anime.trailer_link}</span>
              </a>
            </div>

            <div className="flex gap-1 mt-2">
              <h2 className="text-gray-800 flex">
                <AiOutlinePaperClip
                  className="mr-1 text-emerald-700"
                  size={20}
                />
                Watch Link:
              </h2>
              <a
                href={anime.watch_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-500"
              >
                <span>{anime.watch_link}</span>
              </a>
            </div>
          </>
        )}

        {/* Genres */}
        <div className="flex gap-2 items-center mb-auto">
          <h2 className="text-gray-800 flex mt-2">
            <AiOutlineTags className="mr-1 text-emerald-700" size={20} />
            Genres:
          </h2>
          <div className="flex gap-2">
            {genres?.map((genre) => (
              <span
                key={genre.id}
                className="rounded-md py-1 px-2 text-sm bg-emerald-700 text-white"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  }
);

export default AnimeMetadata;
