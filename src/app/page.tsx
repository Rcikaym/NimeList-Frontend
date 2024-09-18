"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push("/home");
    }
  }, [router]);

  return <div style={{}}></div>;
}