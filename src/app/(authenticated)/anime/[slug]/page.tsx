"use client";

import { useEffect, useState } from "react";
import { Image, message, Modal } from "antd";
import { Button } from "@nextui-org/react";
import {
  BiPlus,
  BiSolidStar,
  BiStar,
  BiMinus,
  BiGlobe,
  BiCrown,
  BiSolidStarHalf,
  BiEdit,
  BiTrashAlt,
} from "react-icons/bi";
import { Spacer } from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/react";
import DisplayLongText from "@/components/DisplayLongText";
import { AnimeType, GenreType, ReviewType } from "./types";
import ReviewModal from "./RateComponent";
import apiUrl from "@/hooks/api";
import { getAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import timeToDay from "@/utils/TimeToDay";

type AnimeDetailProps = {
  params: {
    slug: string;
  };
};

const AnimeDetail: React.FC<AnimeDetailProps> = ({ params }) => {
  const { slug } = params;
  const [animeData, setAnimeData] = useState<AnimeType | null>(null); // State for anime data
  const [genres, setGenres] = useState<GenreType[]>([]); // State for genres
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [favorite, setFavorite] = useState<string[]>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [username, setUsername] = useState("");
  const token = getAccessToken();
  const { confirm } = Modal;
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      if (slug) {
        // Fetch anime details using the slug
        const response = await fetch(`${api}/anime/get/${slug}`);
        if (!response.ok) {
          throw new Error("Error fetching anime");
        }
        const data = await response.json();
        setAnimeData(data);
        setGenres(data.genres);
        setReviews(data.review.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (token) {
      const decodedToken: { username: string } = jwtDecode(token);
      console.log(decodedToken);
      setUsername(decodedToken.username);
      setIsLogin(true);
    }
  }, [token]);

  useEffect(() => {
    // Panggil getFav jika animeData sudah ada
    if (animeData?.anime?.id && isLogin) {
      getFav();
      getUserRating();
    }
  }, [animeData, isLogin]);

  const getUserRating = async () => {
    try {
      const response = await apiUrl.get(
        `/review/user-rating?id_anime=${animeData?.anime?.id}`
      );
      setUserRating(await response.data);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await apiUrl.delete(`/review/delete/${id}`);
      message.success(response.data.message);
      fetchData();
      getUserRating();
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const showDeleteConfirm = async (id: string) => {
    confirm({
      title: "Are you sure delete this review?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      centered: true,
      okText: "Yes",
      okType: "danger",
      onOk() {
        handleDeleteReview(id);
      },
    });
  };

  const getFav = async () => {
    try {
      const response = await apiUrl.get(`/favorite-anime/user-favorites`);
      console.log(response.data);
      setFavorite(await response.data);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleDelFavorite = async (id_anime: string) => {
    try {
      const response = await apiUrl.delete(
        "/favorite-anime/delete/" + id_anime
      );
      getFav(); // Mengambil id_anime dari state();
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleAddFavorite = async (id_anime: string) => {
    try {
      const response = await apiUrl.post("/favorite-anime/post", {
        id_anime: id_anime,
      });
      getFav(); // Mengambil id_anime dari state();
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  if (!animeData) {
    return (
      <div className="w-full h-full text-center mx-auto my-auto container">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-6">
        <div className="w-full h-[88px] gap-1">
          <h1 className="text-5xl font-bold m-0">{animeData.anime.title}</h1>
          <p className="text-gray-500 font-semibold mb-0 mt-3">
            {animeData.anime.type} • {animeData.anime.release_date}
          </p>
        </div>
        <div className="flex mb-5">
          {/* <div className="flex flex-col"> */}
          <div className="pt-3 w-full max-w-xs h-auto">
            <Image
              //   src={anime.photo_cover}
              src={`${api}/${animeData.anime.photo_cover.replace(/\\/g, "/")}`}
              width={300} // 2:3 aspect ratio (300x450)
              height={450}
              className="object-cover w-full"
              alt={animeData.anime.title}
            />
            {favorite.includes(animeData.anime.id) && isLogin ? (
              <Button
                size="lg"
                radius="sm"
                startContent={<BiMinus />}
                // color="success"
                onClick={() => handleDelFavorite(animeData.anime.id)}
                className="w-[300px] mt-3 text-white bg-[#014A42]"
              >
                Delete To Favorite
              </Button>
            ) : isLogin ? (
              <Button
                size="lg"
                radius="sm"
                startContent={<BiPlus />}
                // color="success"
                onClick={() => handleAddFavorite(animeData.anime.id)}
                className="w-[300px] mt-3 text-white bg-[#014A42]"
              >
                Add To Favorite
              </Button>
            ) : (
              <Button
                size="lg"
                radius="sm"
                startContent={<BiPlus />}
                className="w-[300px] mt-3 text-white bg-[#014A42]"
              >
                <Link href="/login">Add To Favorite</Link>
              </Button>
            )}
          </div>
          <Spacer x={5} />
          <div className="h-full">
            <iframe
              className="w-[900px] h-[471px] pt-3 select-none"
              src={animeData.anime.trailer_link}
              title={animeData.anime.title}
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="flex flex-row mt-3">
              {/* Genre Tags */}
              <div className="flex space-x-2 mb-4">
                {genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    classNames={{
                      base: "bg-[#008576b7] text-white font-medium",
                    }}
                    variant="flat"
                    size="md"
                  >
                    {genre.name}
                  </Chip>
                ))}
              </div>
            </div>
            <ScrollShadow className="w-[900px] max-h-[150px]" hideScrollBar>
              <p className="text-[#f5f5f5] opacity-100 font-medium scroll-smooth tracking-wider">
                <DisplayLongText text={animeData.anime.synopsis} />
              </p>
            </ScrollShadow>
          </div>
          <Spacer x={5} />
          <div className="pt-3 font-jakarta">
            <div className="mb-1 w-[228px] h-[228px] relative rounded-r-md p-[2px] bg-gradient-to-b from-[#00CAB2] to-[#037F71]">
              <div className="w-full h-full bg-[#151515] rounded-r-md flex items-center justify-center">
                <div className="text-center p-4 text-white">
                  <div className="flex items-center justify-center">
                    <BiSolidStar className="w-[30px] h-[30px] text-[#ffd500] mr-2" />
                    <span className="text-4xl font-bold">
                      {animeData.avgRating}
                    </span>
                    <span className="text-xl font-bold opacity-70">/10</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">AVG. RATING</p>
                </div>
              </div>
            </div>

            <div className="mt-1 w-[228px] h-[228px] relative rounded-r-md p-[2px] bg-gradient-to-b from-[#00CAB2] to-[#037F71]">
              <div className="w-full h-full bg-[#151515] rounded-r-md flex items-center justify-center">
                <div className="flex flex-col justify-center text-center items-center p-4 text-white">
                  <p className="text-xl font-semibold">YOUR RATING</p>
                  {userRating > 0 && isLogin ? (
                    <>
                      <BiSolidStar className="w-[69px] h-[69px] text-[#ffd500]" />
                      <span className="text-2xl font-bold mt-2">
                        {userRating}/10
                      </span>
                      <div className="mt-2"></div>
                    </>
                  ) : isLogin ? (
                    <>
                      <BiStar className="w-[69px] h-[69px] text-[#05E5CB]" />
                      <ReviewModal animeId={animeData.anime.id} />
                    </>
                  ) : (
                    <>
                      <BiStar className="w-[69px] h-[69px] text-[#05E5CB]" />
                      <Link
                        href="/login"
                        className="bg-transparent text-xl font-semibold text-[#05E5CB]"
                      >
                        RATE
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews mt-6">
          <div className="flex justify-between">
            <h2 className="text-xl underline font-bold text-[#05E5CB] select-none">
              {reviews.length} REVIEWS
            </h2>
          </div>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul>
              {reviews
                .sort((a, b) => {
                  if (a.username === username) return -1;
                  if (b.username === username) return 1;
                  return 0;
                })
                .map((review) =>
                  review.status_premium === "active" ? (
                    <li
                      key={review.id}
                      className="container border rounded-lg border-[#05e5cbc3] p-5 my-5 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex">
                          <div className="font-bold bg-[#005B50] p-2 flex items-center gap-2 w-fit rounded-md mb-2">
                            <span className="text-white">{review.name}</span>
                            <BiCrown size={15} className="text-yellow-300" />
                          </div>
                          {review.created_at === review.updated_at ? (
                            <span className="text-[0.75rem] p-2 text-gray-500">
                              {timeToDay(review.created_at)}
                            </span>
                          ) : (
                            <span className="text-[0.75rem] p-2 text-gray-500">
                              {`${timeToDay(review.updated_at)} (diedit)`}
                            </span>
                          )}
                        </div>
                        {/* <div className="font-bold bg-[#005B50] p-2 flex items-center gap-2 w-fit rounded-md mb-2">
                          <span className="text-white">{review.name}</span>
                          <BiCrown size={15} className="text-yellow-300" />
                        </div> */}
                        <p>{review.review}</p>
                        <p>Rating: {review.rating}/10</p>
                      </div>
                      {isLogin && username === review.username && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-fit cursor-pointer">
                              <BiEdit size={25} className="text-[#05E5CB]" />
                            </div>
                            <div
                              className="w-fit cursor-pointer"
                              onClick={() => showDeleteConfirm(review.id)}
                            >
                              <BiTrashAlt
                                size={25}
                                className="text-[#05E5CB]"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </li>
                  ) : (
                    <li
                      key={review.id}
                      className="container border rounded-lg border-[#05e5cbc3] p-5 my-5"
                    >
                      <div className="font-bold bg-[#005B50] text-white p-2 flex items-center gap-2 w-fit rounded-md mb-2">
                        <span>{review.name}</span> <BiGlobe size={15} />
                      </div>
                      <p>{review.review}</p>
                      <p>Rating: {review.rating}/10</p>
                    </li>
                  )
                )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AnimeDetail;
