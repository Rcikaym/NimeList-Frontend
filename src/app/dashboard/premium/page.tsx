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
    <div className="h-screen flex items-center justify-center">
      <Row justify="center">
        <Col>
          <Title level={2} className="text-center mb-6">
            Test Sistem Pembayaran Menggunakan Midtrans
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
