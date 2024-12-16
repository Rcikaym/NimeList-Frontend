import React from "react";
import { BiCrown, BiGlobe, BiEdit, BiTrashAlt, BiHeart } from "react-icons/bi";
import { Rate } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import renderDateTime from "@/utils/FormatDateTime";
import { CommentDataType } from "./types";
import DisplayLongText from "@/components/DisplayLongText";

interface CommentListProps {
  comments: CommentDataType[];
  hasMore: boolean;
  totalReview: number;
  onLoadMore: () => void;
  onDelete: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  hasMore,
  totalReview,
  onLoadMore,
  onDelete,
}) => {
  return (
    <div className="mt-6 p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold select-none">
          {totalReview} COMMENTS
        </h2>
      </div>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <InfiniteScroll
          dataLength={comments.length}
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
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg border-emerald-500 p-5 my-5 flex items-center justify-between"
            >
              <div>
                <div className="flex gap-2 items-center">
                  <div className="font-bold flex bg-[#005b50] p-2 gap-1 w-fit rounded-md">
                    <span className="text-white">{comment.name}</span>
                    <BiCrown size={15} className="text-yellow-300" />
                  </div>
                  <p className="text-[0.75rem] text-gray-500">
                    {comment.created_at === comment.updated_at
                      ? renderDateTime(comment.created_at)
                      : `${renderDateTime(comment.created_at)} (diedit)`}
                  </p>
                </div>
                <div className="my-2">
                  <DisplayLongText text={comment.comment} />
                </div>
                <div className="flex items-center gap-1">
                  <BiHeart size={20} />
                  <span>{comment.total_likes}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div
                  className="w-fit cursor-pointer"
                  onClick={() => onDelete(comment.id)}
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

export default CommentList;
