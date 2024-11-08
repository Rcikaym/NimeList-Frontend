"use client";

import { checkPremium } from "@/utils/premiumStatus";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TopicPage() {
  const router = useRouter();

  const handleCheckPremium = async () => {
    try {
      await checkPremium();
    } catch (error) {
      router.push("/payment");
    }
  };

  useEffect(() => {
    handleCheckPremium();
  }, []);

  return (
    <>
      <h1>Welcome to the topic page</h1>
    </>
  );
}
