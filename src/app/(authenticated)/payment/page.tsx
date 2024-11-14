"use client";

import { useState } from "react";
import { Button } from "antd";
import PaymentModal from "@/app/dashboard/transaction/paymentModal";

const Home: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="my-10 flex items-center justify-center">
      <div className="flex flex-col">
        <h1 className="text-center mb-6 text-white">
          Test Sistem Pembayaran Menggunakan Midtrans
        </h1>
        <div className="flex justify-center">
          <Button type="primary" onClick={showModal}>
            Buka Modal Pembayaran
          </Button>
        </div>
      </div>

      <PaymentModal show={isModalVisible} handleClose={handleClose} />
    </div>
  );
};

export default Home;
