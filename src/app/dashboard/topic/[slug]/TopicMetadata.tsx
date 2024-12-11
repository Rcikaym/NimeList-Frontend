import React, { memo } from "react";
import {
  AiOutlineUser,
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineTag,
  AiOutlineClockCircle,
  AiOutlineTool,
} from "react-icons/ai";
import { TopicType } from "./types";
import renderDateTime from "@/utils/FormatDateTime";

interface TopicMetadataProps {
  topic: TopicType;
}

export const TopicMetadata: React.FC<TopicMetadataProps> = memo(({ topic }) => {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="flex">
            <AiOutlineUser className="mr-1 text-emerald-700" size={20} />
            <div className="flex gap-1 text-small">
              <span className="text-gray-800">User:</span>
              <span className="text-gray-800">{topic.user}</span>
            </div>
          </div>
          <div className="flex">
            <AiOutlineLike className="mr-1 text-emerald-700" size={20} />
            <div className="flex gap-1 text-small">
              <span className="text-gray-800">Likes:</span>
              <span className="text-gray-800">{topic.totalLikes}</span>
            </div>
          </div>
          <div className="flex">
            <AiOutlineDislike className="mr-1 text-emerald-700" size={20} />
            <div className="flex gap-1 text-small">
              <span className="text-gray-800">Dislikes:</span>
              <span className="text-gray-800">{topic.totalDislikes}</span>
            </div>
          </div>
          <div className="flex">
            <AiOutlineTag className="mr-1 text-emerald-700" size={20} />
            <div className="flex gap-1 text-small">
              <span className="text-gray-800">Anime:</span>
              <span className="text-gray-800">{topic.anime}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex">
            <div className="flex gap-1 text-small text-gray-400">
              <AiOutlineClockCircle size={20} />
              <span>{renderDateTime(topic.created_at)}</span>
            </div>
          </div>
          <div className="flex">
            <div className="flex gap-1 text-small text-gray-400">
              <AiOutlineTool size={20} />
              <span>{renderDateTime(topic.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
