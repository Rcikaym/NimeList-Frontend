import React from "react";
import dynamic from "next/dynamic";
import { BiCrown, BiGlobe, BiEdit, BiTrashAlt } from "react-icons/bi"; // Ikon tetap di-load secara langsung
import renderDateTime from "@/utils/FormatDateTime";
import { ReviewDataType } from "./types";
import DisplayLongText from "@/components/DisplayLongText";
import Link from "next/link";
import Image from "next/image";

// Dynamic import untuk komponen berat
const Rate = dynamic(() => import("antd/lib/rate"), { ssr: false });
const LoadingOutlined = dynamic(
  () => import("@ant-design/icons/LoadingOutlined"),
  { ssr: false }
);
const InfiniteScroll = dynamic(
  () => import("react-infinite-scroll-component"),
  { ssr: false }
);

interface ReviewListProps {
  reviews: ReviewDataType[];
  hasMore: boolean;
  totalReview: number;
  onLoadMore: () => void;
  onDelete: (id: string) => void;
}

const api = process.env.NEXT_PUBLIC_API_URL;

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  hasMore,
  totalReview,
  onLoadMore,
  onDelete,
}) => {
  return (
    <div className="mt-6 p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">{totalReview} REVIEWS</h2>
      </div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <InfiniteScroll
          dataLength={reviews.length}
          next={onLoadMore}
          hasMore={hasMore}
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
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg border-emerald-500 p-5 my-3 flex items-center justify-between"
            >
              <div className="flex">
                <div>
                  <Link href={`/profile/${review.username}`}>
                    <Image
                      src={`${api}/${review.user_photo}`}
                      alt="User Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover hover:cursor-pointer mr-4"
                    />
                  </Link>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold bg-[#005B50] p-2 flex items-center gap-2 w-fit rounded-md">
                      <span className="text-white">{review.name}</span>
                      {review.status_premium === "active" ? (
                        <BiCrown size={15} className="text-yellow-300" />
                      ) : (
                        <BiGlobe size={15} className="text-[#05E5CB]" />
                      )}
                    </div>
                    <span className="text-[0.75rem] text-gray-500">
                      {review.created_at === review.updated_at
                        ? renderDateTime(review.created_at)
                        : `${renderDateTime(review.created_at)} (edited)`}
                    </span>
                  </div>
                  <div className="my-3">
                    <DisplayLongText text={review.review} />
                  </div>
                  <Rate
                    count={10}
                    disabled
                    allowHalf
                    defaultValue={0}
                    value={review.rating}
                    className="text-small"
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div
                  className="w-fit cursor-pointer"
                  onClick={() => onDelete(review.id)}
                >
                  <BiTrashAlt size={23} className="text-emerald-700" />
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ReviewList;
