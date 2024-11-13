import apiUrl from "@/hooks/api";
import React from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const imageHandler = () => {
  return new Promise((resolve, reject) => {
    const input: any = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await apiUrl.post(
          "http://localhost:4321/topic/upload-image",
          formData
        );
        const data = await response.data;
        resolve(data.imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
        reject("Upload failed");
      }
    };
  });
};

export const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      image: function (this: { quill: any }) {
        const quill = this.quill;
        imageHandler()
          .then((url) => {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);
          })
          .catch((error) => console.error("Image upload failed:", error));
      },
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
