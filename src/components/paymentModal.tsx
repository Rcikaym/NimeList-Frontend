// components/PaymentModal.js

import { useState, useEffect } from "react";
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
  const [memberships, setMemberships] = useState<any>([]);
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

  // Fetch memberships and users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipsRes, usersRes] = await Promise.all([
          axios.get(`${api}/premium/get-all`),
          axios.get(`${api}/user/get-all`),
        ]);
        setMemberships(membershipsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  // Update total price when membership changes
  useEffect(() => {
    if (selectedMembership) {
      const membership = memberships.find((m: any) => m.id);
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

      const response = await axios.post(`${api}/transactions/create`, payload);
      const token = response.data;

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
          await fetch(`${api}/transactions/success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
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
            loading={!users && !setError}
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
