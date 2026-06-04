"use client";
import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
import { getAccessToken } from "@/utils/auth";
import { FaCheck, FaCrown } from "react-icons/fa";

const api = process.env.NEXT_PUBLIC_API_URL;

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token in useEffect to avoid server/client hydration issues
  useEffect(() => {
    setToken(getAccessToken());
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${api}/premium/get-all`);
      setPlans(await response.json());
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const formatDuration = (days: number): string => {
    switch (days) {
      case 30:
        return "Monthly Plan";
      case 180:
        return "6 Months Plan";
      case 360:
        return "Annual Plan";
      default:
        return `${days} Days Plan`;
    }
  };

  const getButtonText = (days: number): string => {
    switch (days) {
      case 30:
        return "Join Monthly";
      case 180:
        return "Get 6 Months";
      case 360:
        return "Join For a Year";
      default:
        return "Subscribe Now";
    }
  };

  const getFeatures = (days: number): string[] => {
    const baseFeatures = [
      "Access members-only forums",
      "Create new topic discussions",
      "Earn exclusive profile badges",
    ];
    switch (days) {
      case 30:
        return [...baseFeatures, "Standard member styling"];
      case 180:
        return [...baseFeatures, "Silver badge styling", "10% equivalent savings"];
      case 360:
        return [
          ...baseFeatures,
          "Yearly Champion gold badge",
          "Standout profile styling",
          "Best value subscription",
        ];
      default:
        return baseFeatures;
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
      {plans.map((plan: any) => {
        const isYearly = plan.duration === 360;
        const features = getFeatures(plan.duration);
        return (
          <div
            key={plan.id}
            className={`w-full relative rounded-3xl flex flex-col justify-between items-start transition-all duration-300 p-8 shadow-2xl h-full transform-gpu ${
              isYearly
                ? "bg-zinc-900/90 border-2 border-green-500 shadow-[0_0_40px_rgba(0,153,81,0.2)] md:scale-[1.03] z-10"
                : "bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
            }`}
          >
            {isYearly && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase absolute -top-3.5 left-1/2 transform -translate-x-1/2 shadow-lg tracking-wider flex items-center gap-1">
                <FaCrown className="w-3 h-3" /> Best Value
              </div>
            )}

            <div className="w-full flex-grow flex flex-col">
              <span className={`text-xs font-bold uppercase tracking-widest ${isYearly ? 'text-green-400' : 'text-zinc-500'}`}>
                {formatDuration(plan.duration)}
              </span>
              <h2 className="text-left text-3xl font-extrabold text-white mt-1 mb-4">
                {plan.name}
              </h2>
              
              <hr className="border-t border-zinc-800 my-2" />
              
              <div className="my-4">
                <span className="text-4xl font-extrabold text-white">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(plan.price)}
                </span>
                <span className="text-zinc-500 text-sm ml-1">
                  / {plan.duration === 30 ? "mo" : plan.duration === 180 ? "6mo" : "yr"}
                </span>
              </div>

              {/* Feature list */}
              <ul className="space-y-3.5 my-6 text-left w-full flex-grow">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isYearly ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      <FaCheck className="w-2.5 h-2.5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="w-full pt-4 mt-auto">
              <button
                onClick={() =>
                  token
                    ? handleOpenModal(plan)
                    : (window.location.href = "/login")
                }
                className={`w-full py-3.5 rounded-full font-bold transition duration-300 text-sm tracking-wide shadow-md ${
                  isYearly
                    ? "bg-green-500 hover:bg-green-400 text-black shadow-green-500/10 hover:shadow-green-500/20"
                    : "border-2 border-green-500/80 text-green-400 hover:bg-green-500 hover:text-black hover:border-transparent"
                }`}
              >
                {getButtonText(plan.duration)}
              </button>
            </div>
          </div>
        );
      })}
      <PaymentModal
        show={modalVisible}
        handleClose={handleCloseModal}
        selectedPlan={selectedPlan}
      />
    </>
  );
}
