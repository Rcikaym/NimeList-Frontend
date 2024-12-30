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
import { AnimeType, GenreType, ReviewDataType, ReviewType } from "./types";
import ReviewModal from "./RateComponent";
import apiUrl from "@/hooks/api";
import { getAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import timeToDay from "@/utils/TimeToDay";
import InfiniteScroll from "react-infinite-scroll-component";

type AnimeDetailProps = {
  params: {
    slug: string;
  };
};

const AnimeDetail: React.FC<AnimeDetailProps> = ({ params }) => {
  const { slug } = params;
  const [animeData, setAnimeData] = useState<AnimeType | null>(null); // State for anime data
  const [genres, setGenres] = useState<GenreType[]>([]); // State for genres
  const [reviews, setReviews] = useState<ReviewDataType[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [username, setUsername] = useState("");
  const [totalReview, setTotalReview] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
        fetchReview(page, data.anime.id);
        setGenres(data.genres);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchReview = async (page: number, id_anime?: string) => {
    try {
      const response = await fetch(
        `${api}/review/get/by-anime/${id_anime}?page=${page}&limit=5`,
        {
          method: "GET",
        }
      );
      const res: ReviewType = await response.json();
      console.log(res.data.length);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setTotalReview(res.total);
        setReviews((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      }
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const decodedToken: { username: string } = jwtDecode(token);
      console.log(decodedToken);
      setUsername(decodedToken.username);
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    // Lakukan eksekusi ini ketika animeData telah siap dan sudah login
    if (animeData?.anime?.id && isLogin) {
      getFav();
      getUserRating();
    }
  }, [animeData, isLogin]);

  useEffect(() => {
    if (animeData?.anime?.id && page > 1) {
      setTimeout(() => fetchReview(page, animeData.anime.id), 500);
    }
  }, [page, animeData?.anime?.id]);

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
      // Perbarui review di state
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );

      // Perbarui total review di state
      setTotalReview((prevTotal) => prevTotal - 1);

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
      const response = await apiUrl.get(`/favorite-anime/is-favorite`, {
        params: {
          id_anime: animeData?.anime?.id,
        },
      });
      setIsFavorite(await response.data);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleDelFavorite = async (id_anime: string) => {
    try {
      await apiUrl.delete("/favorite-anime/delete/", {
        data: {
          id_anime: id_anime,
        },
      });
      getFav(); // Mengambil id_anime dari state();
    } catch (error: any) {
      console.error(error.message);
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

  const renderFavoriteButton = () => {
    if (isLogin) {
      return isFavorite ? (
        <Button
          size="lg"
          radius="sm"
          startContent={<BiMinus />}
          className="w-[300px] mt-3 text-white bg-[#014A42]"
          onClick={() => handleDelFavorite(animeData.anime.id)}
        >
          Delete To Favorite
        </Button>
      ) : (
        <Button
          size="lg"
          radius="sm"
          startContent={<BiPlus />}
          // color="success"
          className="w-[300px] mt-3 text-white bg-[#014A42]"
          onClick={() => handleAddFavorite(animeData.anime.id)}
        >
          Add To Favorite
        </Button>
      );
    } else {
      return (
        <Button
          size="lg"
          radius="sm"
          startContent={<BiPlus />}
          // color="success"
          className="w-[300px] mt-3 text-white bg-[#014A42]"
        >
          <Link href="/login">Add To Favorite</Link>
        </Button>
      );
    }
  };

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
              src={`${api}/${animeData.anime.photo_cover}`}
              width={300} // 2:3 aspect ratio (300x450)
              height={450}
              className="object-cover w-full"
              alt={animeData.anime.title}
            />
            {renderFavoriteButton()}
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
              {totalReview} REVIEWS
            </h2>
          </div>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <InfiniteScroll
              dataLength={reviews.length}
              next={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore && reviews.length < totalReview}
              style={{ height: "fit" }}
              loader={
                <div
                  style={{
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "2rem",
                  }}
                >
                  <LoadingOutlined />
                </div>
              }
            >
              <div>
                {reviews
                  .sort((a, b) => {
                    if (a.username === username) return -1;
                    if (b.username === username) return 1;
                    return 0;
                  })
                  .map((review) => (
                    <div
                      key={review.id}
                      className="container border rounded-lg border-emerald-500 p-5 my-5 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex">
                          <div className="font-bold bg-[#005B50] p-2 flex items-center gap-2 w-fit rounded-md mb-2">
                            <span className="text-white">{review.name}</span>
                            {review.status_premium === "active" ? (
                              <BiCrown size={15} className="text-yellow-300" />
                            ) : (
                              <BiGlobe size={15} className="text-[#05E5CB]" />
                            )}
                          </div>
                          {review.created_at === review.updated_at ? (
                            <span className="text-[0.75rem] p-2 text-gray-500">
                              {timeToDay(review.created_at)}
                            </span>
                          ) : (
                            <span className="text-[0.75rem] p-2 text-gray-500">
                              {`${timeToDay(review.created_at)} (diedit)`}
                            </span>
                          )}
                        </div>
                        <p>{review.review}</p>
                        <p>Rating: {review.rating}/10</p>
                      </div>
                      {isLogin && review.username === username && (
                        <div className="flex gap-2 items-center">
                          <div className="w-fit cursor-pointer">
                            <BiEdit size={23} className="text-emerald-700" />
                          </div>
                          <div
                            className="w-fit cursor-pointer"
                            onClick={() => showDeleteConfirm(review.id)}
                          >
                            <BiTrashAlt
                              size={23}
                              className="text-emerald-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
};

export default AnimeDetail;
