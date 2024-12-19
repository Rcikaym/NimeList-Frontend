"use client";
import { useState } from "react";
import apiUrl from "@/hooks/api";
import { Button, Modal, message, Spin } from "antd";

const PaymentModal = ({ show, handleClose, selectedPlan }: any) => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handlePaymentConfirmation = () => {
    // Close Payment Modal and Open Confirmation Modal
    handleClose();
    setConfirmModalVisible(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const id_premium = selectedPlan?.id;

      const response = await apiUrl.post(`/transactions/post`, {
        id_premium: id_premium,
      });
      const { token } = await response.data;

      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );
      document.body.appendChild(script);
      script.onload = () => {
        window.snap.pay(token, {
          onSuccess: () => (window.location.href = "/payment"),
          onPending: () => (window.location.href = "/payment"),
        });
      };
      setLoading(false);
      setConfirmModalVisible(false);
    } catch (err: any) {
      message.warning("Error creating transaction:", err);
      setLoading(false);
      setConfirmModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        title={selectedPlan?.name + " Payment Confirmation"}
        open={show}
        onCancel={handleClose}
        centered
        footer={[
          <Button key="back" onClick={handleClose} disabled={loading}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handlePaymentConfirmation} // Updated to handlePaymentConfirmation
            disabled={loading}
          >
            {loading ? <Spin /> : "Bayar"}
          </Button>,
        ]}
      >
        <p>
          You have selected the <strong>{selectedPlan?.name}</strong> package
          with a price of{" "}
          <strong>
            {selectedPlan &&
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(selectedPlan.price)}
          </strong>
          .
        </p>
        <p>
          This package offers a duration of{" "}
          <strong>{selectedPlan?.duration}</strong> days, ensuring you get the
          best value for your membership.
        </p>
        <p>
          Enjoy exclusive benefits and features tailored to your needs by
          subscribing to this premium package today!
        </p>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Payment"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={() => setConfirmModalVisible(false)}
            disabled={loading}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spin /> : "Confirm"}
          </Button>,
        ]}
      >
        <p>Are you sure you want to proceed with the payment?</p>
      </Modal>
    </>
  );
};

export default PaymentModal;
