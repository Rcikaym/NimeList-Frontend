import { Image } from "antd";
import React from "react";

interface DynamicContentProps {
  content: string; // Prop untuk menerima konten HTML
}

const TopicBody: React.FC<{ content: string }> = ({ content }) => {
  // Fungsi untuk memperbarui src gambar dan menyesuaikan ukuran header dan elemen lainnya
  const htmlParser = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Menyesuaikan indentasi baris pada elemen p yang kosong
    const paragraphs = doc.querySelectorAll("p");
    paragraphs.forEach((p) => {
      if (p.textContent?.trim() === "") {
        // Buat elemen <br>
        const br = document.createElement("br");
        // Ganti elemen <p> kosong dengan <br>
        p.replaceWith(br);
      }
    });

    // Menyesuaikan ukuran font untuk elemen header (h1, h2, h3, ...)
    const headers = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headers.forEach((header: Element) => {
      const h = header as HTMLElement;
      switch (h.tagName) {
        case "H1":
          h.style.fontSize = "2.5rem";
          break;
        case "H2":
          h.style.fontSize = "2rem";
          break;
        case "H3":
          h.style.fontSize = "1.75rem";
          break;
        case "H4":
          h.style.fontSize = "1.5rem";
          break;
        case "H5":
          h.style.fontSize = "1.25rem";
          break;
        case "H6":
          h.style.fontSize = "1rem";
          break;
        default:
          break;
      }
    });

    // Menangani blockquote
    const blockquotes = doc.querySelectorAll("blockquote");
    blockquotes.forEach((blockquote) => {
      blockquote.style.fontStyle = "italic";
      blockquote.style.borderLeft = "4px solid #ccc";
      blockquote.style.paddingLeft = "16px";
      blockquote.style.margin = "16px 0";
    });

    // Menangani daftar (ul, ol, li)
    const lists = doc.querySelectorAll("ul, ol");
    lists.forEach((list: Element) => {
      const li = list as HTMLElement;
      li.style.margin = "16px";
      li.style.paddingLeft = "20px"; // Beri indentasi pada daftar
      if (list.tagName === "UL") {
        // Untuk unordered list (UL), gunakan bullet
        li.style.listStyleType = "disc"; // Menampilkan titik sebagai bullet
      } else if (list.tagName === "OL") {
        // Untuk ordered list (OL), gunakan angka
        li.style.listStyleType = "decimal"; // Menampilkan angka
      }
    });

    const listItems = doc.querySelectorAll("li");
    listItems.forEach((li: HTMLElement) => {
      li.style.marginBottom = "8px"; // Menambahkan jarak antar list item
    });

    // Mengembalikan HTML yang telah dimodifikasi
    return doc.body.innerHTML;
  };

  const updatedContent = htmlParser(content);

  return (
    <div
      className="text-black"
      dangerouslySetInnerHTML={{ __html: updatedContent }}
    />
  );
};

export default TopicBody;
