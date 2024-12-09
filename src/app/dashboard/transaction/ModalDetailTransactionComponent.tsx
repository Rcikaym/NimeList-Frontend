"use client";

import { TransactionDetails } from "@/app/dashboard/transaction/types";
import { Modal } from "antd";
import { useState } from "react";
import {
  AiFillCaretRight,
  AiOutlineClockCircle,
  AiOutlineTool,
} from "react-icons/ai";
import styles from "@/styles/toggleProductDetails.module.css";
import renderDateTime from "../../../utils/FormatDateTime";

interface ModalDetailTransactionProps {
  data: TransactionDetails;
  modalVisible: boolean;
  handleCancel: () => void;
}

const ModalDetailTransaction: React.FC<ModalDetailTransactionProps> = ({
  data,
  modalVisible,
  handleCancel,
}) => {
  const [productVisible, setProductVisible] = useState(false);

  function toTitleCase(str?: string): string {
    if (!str) {
      return "";
    }
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <Modal
      title="Transaction Details"
      open={modalVisible && data !== null && data !== undefined}
      footer={null}
      centered
      onCancel={handleCancel}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-5 mb-2 border-b-1 border-gray-300 py-2">
            <div className="flex flex-col gap-2 font-semibold">
              <span>Username</span>
              <span>Order Id</span>
              <span>Status</span>
              <span>Total</span>
              <span>Payment Platform</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>{data.username}</span>
              <span>{data.order_id}</span>
              <span>{toTitleCase(data.status)}</span>
              <span>
                {`Rp${new Intl.NumberFormat("id-ID").format(data.total)}`}
              </span>
              <span>{toTitleCase(data.payment_platform)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <button
                onClick={() => setProductVisible(!productVisible)}
                className="flex items-center gap-2"
              >
                <span className="font-semibold">Product Details</span>
                <AiFillCaretRight
                  size={14}
                  className={`transition-transform duration-400 ${
                    productVisible ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
            </div>
            <div
              className={`${styles.additionalContent} ${
                productVisible ? styles.visible : styles.hidden
              }`}
            >
              <div className="flex flex-col bg-gray-100 gap-2 rounded-md p-2">
                <div className="flex gap-8">
                  <div className="flex flex-col gap-2 font-semibold">
                    <span>Name</span>
                    <span>Duration</span>
                    <span>Price</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span>{data.premium?.name}</span>
                    <span>{data.premium?.duration} days</span>
                    <span>
                      {`Rp${new Intl.NumberFormat("id-ID").format(
                        data.premium?.price
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2 items-center">
            <AiOutlineClockCircle size={15} />
            <span className="text-gray-400">
              {renderDateTime(data.created_at)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <AiOutlineTool size={15} />
            <span className="text-gray-400">
              {renderDateTime(data.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetailTransaction;
