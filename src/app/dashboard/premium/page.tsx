// pages/index.tsx
"use client";

import React, { useState } from "react";
import { Button, Row, Col, Typography } from "antd";
import PaymentModal from "@/components/paymentModal";

const { Title } = Typography;

const Home: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Row justify="center">
        <Col>
          <Title level={2} className="text-center mb-6">
            Selamat Datang di Sistem Pembayaran Membership
          </Title>
          <div className="flex justify-center">
            <Button type="primary" onClick={showModal}>
              Buka Modal Pembayaran
            </Button>
          </div>
        </Col>
      </Row>

      <PaymentModal show={isModalVisible} handleClose={handleClose} />
    </div>
  );
};

export default Home;
