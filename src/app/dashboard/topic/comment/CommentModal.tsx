"use client";

import React from "react";
import { Modal } from "antd";
import {
  AiOutlineClockCircle,
  AiOutlineHeart,
  AiOutlineTag,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";
import DisplayLongText from "@/components/DisplayLongText";
import renderDateTime from "@/utils/FormatDateTime";
import { CommentType } from "./types";
import { LoadingOutlined } from "@ant-design/icons";

interface CommentModalProps {
  visible: boolean;
  detailComment: CommentType;
  loading: boolean;
  onCancel: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  detailComment,
  loading,
  onCancel,
}) => {
  return (
    <Modal
      title="Detail Comment"
      centered
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      {loading ? (
        <div className="flex items-center justify-center my-5">
          <LoadingOutlined style={{ fontSize: 24 }} />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <AiOutlineUser size={19} />
              <span>{detailComment.user}</span>
            </div>
            <div className="flex gap-2 items-center">
              <AiOutlineTag size={19} />
              <div className="break-words w-full">
                <span> {detailComment.topic}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <AiOutlineHeart size={19} />
              <span>{detailComment.likes}</span>
            </div>
          </div>

          <div className="bg-gray-100 p-3 w-full h-full rounded-md my-4">
            <DisplayLongText text={detailComment.comment} />
          </div>

          <div className="flex gap-2">
            <div className="flex gap-2 items-center">
              <AiOutlineClockCircle size={15} />
              <span className="text-gray-400">
                {renderDateTime(detailComment.created_at)}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <AiOutlineTool size={15} />
              <span className="text-gray-400">
                {renderDateTime(detailComment.updated_at)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CommentModal;
