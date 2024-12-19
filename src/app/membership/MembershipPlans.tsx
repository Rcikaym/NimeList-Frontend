"use client";
import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${api}/premium/get-all`);
      setPlans(await response.json());
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const buttonText = ["Join Monthly", "Get 6 Months", "Join For a Year"];

  useEffect(() => {
    fetchPlans();
  });

  // function untuk format duration
  const formatDuration = (days: number): string => {
    switch (days) {
      case 30:
        return "Monthly";
      case 180:
        return " For 6 Months";
      case 360:
        return "Annual";
      default:
        return `For ${days} Days`; // Fallback untuk durasi custom
    }
  };

  const handleOpenModal = (plan: any) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPlan(null);
  };

  return (
    <>
      {plans.map((plan: any, index: number) => (
        <div
          key={plan.id}
          className="w-full max-w-lg bg-[#1E1E1E] rounded-3xl flex flex-col justify-start items-start shadow-lg"
        >
          <div className="p-6 w-full">
            <h2 className="text-left text-3xl font-bold text-white mb-2">
              {plan.name} Plan
            </h2>
            <hr className="border-t-large border-gray-700 my-4" />
            <p className="text-left text-lg text-gray-400 mt-2 mb-0">
              {formatDuration(plan.duration)}
            </p>
            {/* Price with Rupiah Formatting */}
            <h2 className="text-left text-2xl font-semibold text-white">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(plan.price)}
            </h2>
            {/* CTA Button */}
            <button onClick={() => handleOpenModal(plan)} className="mt-6 w-64 font-semibold border border-green-400 text-green-400 py-2 rounded-full hover:bg-green-400 hover:text-black transition">
              {buttonText[index]}
            </button>
          </div>
        </div>
      ))}
        <PaymentModal
        show={modalVisible}
        handleClose={handleCloseModal}
        selectedPlan={selectedPlan}
      />
    </>
  );
}
