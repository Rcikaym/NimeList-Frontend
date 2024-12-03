// components/PaymentModal.js

import React, { useState, useEffect } from "react";
import { Button, Form, InputNumber, message, Modal, Select, Spin } from "antd";
import { Option } from "antd/es/mentions";
import { getAccessToken } from "@/utils/auth";
import apiUrl from "@/hooks/api";
import { on } from "events";

declare global {
  interface Window {
    snap: any;
  }
}

const PaymentModal = ({ show, handleClose }: any) => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState<any>("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const fetchData = async () => {
    try {
      const response = await fetch(`${api}/premium/get-all`);
      setMemberships(await response.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Fetch premium dan set user id dari token local storage
  useEffect(() => {
    fetchData();
  }, []);

  // Update total price ketika premium dipilih
  useEffect(() => {
    if (selectedMembership) {
      const membership: any = memberships.find(
        (m: any) => m.id === selectedMembership
      );
      if (membership) {
        setTotalPrice(membership.price);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedMembership, memberships]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const id_premium = selectedMembership;
      console.log(id_premium);

      const response = await apiUrl.post(`/transactions/create`, {
        id_premium: id_premium,
      });
      const { token } = await response.data;

      // Redirect ke Midtrans
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );
      document.body.appendChild(script);
      script.onload = () => {
        window.snap.pay(token, {
          onSuccess: () => {
            window.location.href = "/payment";
          },
          onPending: () => {
            window.location.href = "/payment";
          }
        });
      };
      setLoading(false);
    } catch (err: any) {
      message.error("Error creating transaction:", err);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Pembayaran Membership"
      open={show}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose} disabled={loading}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spin /> : "Bayar"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Jenis Membership">
          <Select
            placeholder="Pilih Membership"
            onChange={(value: string) => setSelectedMembership(value)}
            value={selectedMembership}
          >
            {memberships &&
              memberships.map((membership: any) => (
                <Option key={membership.id} value={membership.id}>
                  {membership.name} - Rp {membership.price.toLocaleString()}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Total Harga">
          <InputNumber
            value={totalPrice}
            disabled
            style={{ width: "100%" }}
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value: any) => value.replace(/\Rp\s?|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
