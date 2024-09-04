import Link from "next/link";
import { Space } from "antd";
import Image from "next/image";
type Anime = {
  id: number;
  title: string;
  type: string;
  // genre: string[];
  // episodes: number;
  rating: number;
  // synopsis: string;
  photo_cover: string;
  // trailer_link: string;
  // release_date: string;
};

export default async function Home() {
  const response = await fetch("http://localhost:3001/animes");
  const anime = await response.json();
  return (
    <div className="container mx-auto">
      <ul className="grid grid-cols-5 gap-4">
        {anime.map((anime: Anime) => (
          <li
            key={anime.id}
            className="max-w-md w-[208px] h-[375px]  shadow mb-6"
          >
            <Link href="#">
              <Image
                className=" select-none w-[208px] h-[247px] object-cover"
                // src={anime.photo_cover}
                src="/images/the-wind-rise.jpg"
                alt={anime.title}
                width={208}
                height={247}
              />
            </Link>
            <div className="p-5 max-w-md">
              <Link href="#">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {anime.title}
                </h5>
              </Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {anime.type}
              </p>
              {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{anime.synopsis}</p> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
