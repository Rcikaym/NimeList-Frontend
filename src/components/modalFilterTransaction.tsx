import React, { useState } from "react";
import { Modal, Radio } from "antd";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filterResult: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPremium, setSelectedPremium] = useState("");

  // Fungsi untuk menghandle perubahan pilihan
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handlePremiumChange = (premium: string) => {
    setSelectedPremium(premium);
  };

  // Mengaplikasikan filter dan menggabungkan hasil menjadi satu string
  const applyFilter = () => {
    const filterResult = `status=${selectedStatus}&premium=${selectedPremium}`;
    onApply(decodeURIComponent(filterResult));
    onClose();
  };

  return (
    <Modal
      title="Filter Transaksi dan Premium Type"
      visible={isOpen}
      onCancel={onClose}
      footer={
        <>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("");
                setSelectedPremium("");
              }}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={applyFilter}
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
            >
              Terapkan
            </button>
          </div>
        </>
      }
    >
      <h4>Transaction Status</h4>
      <Radio.Group
        onChange={(e) => handleStatusChange(e.target.value)}
        value={selectedStatus}
        optionType="button"
      >
        <Radio value="success">Success</Radio>
        <Radio value="pending">Pending</Radio>
        <Radio value="failed">Failed</Radio>
      </Radio.Group>

      <h4 style={{ marginTop: "16px" }}>Premium Type</h4>
      <Radio.Group
        onChange={(e) => handlePremiumChange(e.target.value)}
        value={selectedPremium}
        optionType="button"
      >
        <Radio value="One-Month Heroes">One-Month Heroes</Radio>
        <Radio value="Six-Month Heroes">Six-Month Heroes</Radio>
        <Radio value="Yearly Heroes">Yearly Heroes</Radio>
      </Radio.Group>
    </Modal>
  );
};

export default FilterModal;
