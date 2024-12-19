import React, { use, useEffect } from "react";
import { Modal, Rate } from "antd";
import { AiOutlineClockCircle, AiOutlineTool } from "react-icons/ai";
import { UserOutlined } from "@ant-design/icons";
import renderDateTime from "@/utils/FormatDateTime";
import { DataDetailReview } from "./types";
import DisplayLongText from "@/components/DisplayLongText";
import { BiPurchaseTag, BiTagAlt, BiUser } from "react-icons/bi";

interface ReviewDetailModalProps {
  visible: boolean;
  detailReview: DataDetailReview; // Sebaiknya gunakan tipe data lebih spesifik
  onClose: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  visible,
  detailReview,
  onClose,
}) => {
  useEffect(() => {
    console.log(detailReview);
  });
  return (
    <Modal
      title="Review Details"
      centered
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <BiPurchaseTag size={17} />
            <span>{detailReview.title_anime}</span>
          </div>
          <div className="flex gap-1 items-center">
            <BiUser size={17} />
            <span>{detailReview.username}</span>
          </div>
        </div>

        <div className="my-3">
          <DisplayLongText text={detailReview.review} />
        </div>

        <Rate
          count={10}
          disabled
          allowHalf
          defaultValue={0}
          value={parseFloat(detailReview.rating)}
        />
        
        <div className="flex gap-2">
          <div className="flex gap-2 items-center">
            <AiOutlineClockCircle size={15} />
            <span className="text-gray-400">
              {renderDateTime(detailReview.created_at)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <AiOutlineTool size={15} />
            <span className="text-gray-400">
              {renderDateTime(detailReview.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDetailModal;
