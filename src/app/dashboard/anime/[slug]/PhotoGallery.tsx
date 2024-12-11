import React, { memo } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  photos: string[];
  title: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = memo(({ photos, title }) => {
  const api = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="flex gap-4 grid-cols-5">
      {photos?.map((photo, index) => (
        <div key={index}>
          <Image
            src={`${api}/${photo}`}
            alt={`${title} - Photo ${index + 1}`}
            className="rounded-sm shadow-xl hover:shadow-lg hover:shadow-gray-400 transition-shadow"
            height={160}
            width={260}
          />
        </div>
      ))}
    </div>
  );
});

export default PhotoGallery;
