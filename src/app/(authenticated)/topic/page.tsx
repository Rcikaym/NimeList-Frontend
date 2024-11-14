"use client";

import { checkAdminRole } from "@/utils/adminRole";
import { checkPremium } from "@/utils/premiumStatus";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TopicPage() {
  const router = useRouter();

  const handleCheckEnableAccess = async () => {
    try {
      const isPremium = await checkPremium();
      const isAdmin = checkAdminRole();

      if (!isPremium && !isAdmin) {
        router.push("/payment");
      }

      return;
    } catch (error) {
      router.push("/payment");
    }
  };

  useEffect(() => {
    handleCheckEnableAccess();
  }, []);

  return (
    <>
      <h1>Welcome to the topic page</h1>
    </>
  );
}
