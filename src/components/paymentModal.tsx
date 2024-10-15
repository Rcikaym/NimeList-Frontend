// components/PaymentModal.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button, Form, InputNumber, Modal, Select, Spin } from "antd";
import { Option } from "antd/es/mentions";

declare global {
  interface Window {
    snap: any;
  }
}

const PaymentModal = ({ show, handleClose }: any) => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>("");
  const [selectedMembership, setSelectedMembership] = useState<any>("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  // Fungsi untuk memuat skrip Midtrans Snap secara dinamis
  const loadMidtransScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window is undefined"));
        return;
      }

      if (document.getElementById("midtrans-snap")) {
        // Skrip sudah dimuat
        setIsScriptLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "midtrans-snap";
      script.type = "text/javascript";
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Ganti dengan production jika perlu
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );

      script.onload = () => {
        setIsScriptLoaded(true);
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Midtrans Snap script failed to load"));
      };

      document.body.appendChild(script);
    });
  };

  // Fetch premium dan user saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipsRes, usersRes]: any = await Promise.all([
          await fetch(`${api}/premium/get-all`),
          await fetch(`${api}/user/get-all`),
        ]);
        setMemberships(await membershipsRes.json());
        setUsers(await usersRes.json());
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  // Update total price ketika premium dipilih
  useEffect(() => {
    if (selectedMembership) {
      const membership: any = memberships.find((m: any) => m.id);
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
    await loadMidtransScript();
    setError("");
    setLoading(true);

    try {
      const payload = {
        id_user: selectedUser,
        id_premium: selectedMembership,
      };

      const response = await fetch(`${api}/transactions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const token = await response.json();

      // Redirect ke Midtrans
      window.snap.pay(token, {
        onSuccess: async function (result: any) {
          const data = {
            order_id: result.order_id,
            total: Math.round(result.gross_amount),
            id_user: selectedUser,
            id_premium: selectedMembership,
            payment_platform: result.payment_type,
          };
          if (result.payment_type === "bank_transfer") {
            data.payment_platform = result.va_numbers[0].bank;
          }
          await fetch(`${api}/transactions/success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        },
        onPending: async function (result: any) {
          console.log("closed", result);
        },
      });
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError("Gagal memproses pembayaran. Silakan coba lagi.");
    } finally {
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
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
        />
      )}
      <Form layout="vertical">
        <Form.Item label="User">
          <Select
            placeholder="Pilih User"
            onChange={(value: string) => setSelectedUser(value)}
            value={selectedUser}
            loading={!users}
          >
            {users &&
              users.map((user: any) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Jenis Membership">
          <Select
            placeholder="Pilih Membership"
            onChange={(value: string) => setSelectedMembership(value)}
            value={selectedMembership}
            loading={!memberships && !setError}
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
