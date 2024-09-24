import { Image } from "antd";
import React from "react";

interface DynamicContentProps {
  content: string; // Prop untuk menerima konten HTML
}

const DynamicContent: React.FC<DynamicContentProps> = ({ content }) => {
  // Fungsi untuk memperbarui src gambar
  const updateImageSources = (htmlString: string): string => {
    // Membuat parser untuk mengubah string HTML menjadi DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Temukan semua tag <img>
    const images = doc.querySelectorAll("img");

    // Ganti src untuk setiap tag <img>
    images.forEach((img) => {
      const originalSrc = img.getAttribute("src"); // Ambil src yang asli
      if (originalSrc) {
        img.setAttribute("src", `http://localhost:4321${originalSrc}`); // Ganti dengan URL yang diinginkan
        img.setAttribute("height", "full");
        img.setAttribute("width", "600");
        img.setAttribute("alt", "image");
        img.setAttribute("loading", "lazy");
      }
    });

    // Kembalikan HTML yang sudah dimodifikasi
    return doc.body.innerHTML;
  };

  const updatedContent = updateImageSources(content); // Proses konten yang diberikan

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
    </div>
  );
};

export default DynamicContent;
