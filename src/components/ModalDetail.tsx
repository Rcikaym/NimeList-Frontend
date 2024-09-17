// components/DetailModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';

interface DetailModalProps {
  id: number | string | null;
  visible: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ id, visible, onClose }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Fetch data by ID (contoh API call, bisa ganti sesuai API yang digunakan)
      axios.get(`http://localhost:4321/review/get/${id}`)
        .then((res) => res.data)
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  return (
    <Modal
      title="Detail Information"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {data ? (
        <div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
          {/* Add more details as necessary */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default DetailModal;
