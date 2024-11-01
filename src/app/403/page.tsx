"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ForbiddenPage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>403 - Forbidden</h1>
        <p style={styles.message}>
          You don’t have permission to access this page.
        </p>
        {/* Gambar contoh. Sesuaikan path atau URL sesuai kebutuhan */}
        <Image
          src="/images/forbidden.png" // Path gambar lokal atau URL eksternal
          alt="Forbidden"
          width={300}
          height={300}
          style={styles.image}
        />
        <button style={styles.button} onClick={() => router.push("/home")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

// Gaya CSS in JS
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f8f8",
    textAlign: "center" as const,
  },
  content: {
    maxWidth: "500px",
    padding: "20px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#333",
  },
  message: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "1.5rem",
  },
  image: {
    marginBottom: "1.5rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ForbiddenPage;
