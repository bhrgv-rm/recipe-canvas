"use client";
import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface Props {
  img: string;
  title: string;
  url: string;
  author?: string;
  diff?: number;
}

const SM_Card: React.FC<Props> = ({ img, title, url, author, diff }) => {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  const fallbackImage =
    "https://images.pexels.com/photos/29684840/pexels-photo-29684840/free-photo-of-colorful-vietnamese-cafe-interior-with-decor.jpeg";

  return (
    <a className="link_card" href={url}>
      <img
        src={imgError ? fallbackImage : img}
        alt={title}
        width={500}
        height={250}
        onError={handleError}
      />
      <div className="flex justify-between items-center">
        <p>{title}</p>
        <p className="flex items-center gap-1">
          {diff && diff > 0 && (
            <>
              {diff} <StarIcon className="size-4" />
            </>
          )}
        </p>
      </div>
    </a>
  );
};

export default SM_Card;
