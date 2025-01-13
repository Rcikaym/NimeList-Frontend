import React, { useState } from "react";
import { Modal, Radio, Select } from "antd";
import dayjs from "dayjs";

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
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Fungsi untuk menghandle perubahan pilihan
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleTimePeriodChange = (value: string) => {
    setSelectedTimePeriod(value);
    switch (value) {
      case "this-year":
        setTimePeriod(dayjs().startOf("year").format("YYYY-MM-DD").toString());
        break;
      case "this-month":
        setTimePeriod(dayjs().startOf("month").format("YYYY-MM-DD").toString());
        break;
      case "this-week":
        setTimePeriod(dayjs().startOf("week").format("YYYY-MM-DD").toString());
        break;
      case "today":
        setTimePeriod(dayjs().startOf("day").format("YYYY-MM-DD").toString());
        break;
      default:
        setTimePeriod("");
        break;
    }
  };

  // Mengaplikasikan filter dan menggabungkan hasil menjadi satu string
  const applyFilter = () => {
    const filterResult = `status=${selectedStatus}&period=${timePeriod}&platform=${selectedPlatform}`;
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
      title={
        <>
          <span className="text-xl font-semibold">Filter Transaction</span>
        </>
      }
      visible={isOpen}
      centered
      onCancel={onClose}
      footer={
        <>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("");
                setSelectedTimePeriod("");
                setTimePeriod("");
                setSelectedPlatform("");
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
              Apply
            </button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 mt-5">
        {/* Filter status */}
        <div>
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
        </div>

        {/* Filter periode waktu */}
        <div>
          <h4>Time Period</h4>
          <Radio.Group
            onChange={(e) => handleTimePeriodChange(e.target.value)}
            value={selectedTimePeriod}
            optionType="button"
          >
            <Radio value="this-year">This Year</Radio>
            <Radio value="this-month">This Month</Radio>
            <Radio value="this-week">This Week</Radio>
            <Radio value="today">Today</Radio>
          </Radio.Group>
        </div>

        <div>
          <h4>Payment Platform</h4>
          <Select
            value={selectedPlatform || null}
            placeholder="Select Payment Platform"
            className="w-[30%]"
            onChange={setSelectedPlatform}
            options={paymentPlatformOptions}
            listHeight={paymentPlatformOptions.length * 40}
            showSearch
            filterOption={(input, option: any) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            dropdownStyle={{
              maxHeight: 130,
              overflow: "auto",
              scrollbarWidth: "none",
              scrollbarColor: "none",
              msOverflowStyle: "none",
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
