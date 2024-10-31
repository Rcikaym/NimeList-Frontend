import { Image } from "antd";
import React from "react";

interface DynamicContentProps {
  content: string; // Prop untuk menerima konten HTML
}

const TopicBody: React.FC<DynamicContentProps> = ({ content }) => {
  // Fungsi untuk memperbarui src gambar
  const htmlParser = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Update src untuk gambar
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      const originalSrc = img.getAttribute("src"); // Ambil src yang asli
      if (originalSrc && !originalSrc.startsWith("http")) {
        img.setAttribute("src", `http://localhost:4321${originalSrc}`); // Ganti dengan URL yang diinginkan
        img.setAttribute("height", "full");
        img.setAttribute("width", "800");
        img.setAttribute("alt", "image");
        img.setAttribute("loading", "lazy");
      } else {
        img.setAttribute("height", "full");
        img.setAttribute("width", "800");
        img.setAttribute("alt", "image");
        img.setAttribute("loading", "lazy");
      }
    });

    // Tangani tag <p> kosong
    const paragraphs = doc.querySelectorAll("p");
    paragraphs.forEach((p) => {
      // Jika tag <p> kosong (tidak ada teks dan tidak ada elemen anak)
      if (p.textContent?.trim() === "" && p.children.length === 0) {
        // Buat elemen <div> baru
        const div = document.createElement("div");
        // Tambahkan karakter zero-width space ke dalam <div>
        div.innerHTML = "\u200B"; // Zero-width space
        // Gantikan <p> dengan <div>
        p.replaceWith(div);
      }
    });

    return doc.body.innerHTML;
  };

  const updatedContent = htmlParser(content); // Proses konten yang diberikan

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
    </div>
  );
};

export default TopicBody;
