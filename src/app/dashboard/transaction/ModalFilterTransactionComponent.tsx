import React, { useState } from "react";
import { Modal, Radio, Select } from "antd";

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
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Fungsi untuk menghandle perubahan pilihan
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handlePremiumChange = (premium: string) => {
    setSelectedPremium(premium);
  };

  // Mengaplikasikan filter dan menggabungkan hasil menjadi satu string
  const applyFilter = () => {
    const filterResult = `status=${selectedStatus}&premium=${selectedPremium}&platform=${selectedPlatform}`;
    onApply(filterResult);
    onClose();
  };

  const paymentPlatformOptions = [
    { value: "gopay", label: "GoPay" },
    { value: "airpay shopee", label: "ShopeePay" },
    { value: "dana", label: "Dana" },
    { value: "ovo", label: "OVO" },
    { value: "linkaja", label: "LinkAja" },
    { value: "bca", label: "BCA" },
    { value: "bri", label: "BRI" },
    { value: "bni", label: "BNI" },
    { value: "cimb", label: "CIMB" },
  ];

  return (
    <Modal
      title="Transaction and Premium Filter"
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
                setSelectedPlatform(null);
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
      <div style={{ marginTop: "16px" }}>
        <h4>Payment Platform</h4>
        <Select
          value={selectedPlatform}
          placeholder="Select Payment Platform"
          className="w-[30%]"
          onChange={setSelectedPlatform}
          options={paymentPlatformOptions}
          showSearch
          filterOption={(input, option: any) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          dropdownStyle={{
            maxHeight: 100,
            overflow: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        />
      </div>
    </Modal>
  );
};

export default FilterModal;
