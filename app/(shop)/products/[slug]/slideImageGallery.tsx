"use client";

import { useState } from "react";
import clsx from "clsx";
import { SafeImage } from "@/app/ui/shared/safe-image";

export default function SlideImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbs = images.slice(0, 3);

  return (
    <div>
      <div className="pdp-stage">
        <SafeImage
          src={images[currentIndex]}
          alt={name}
          fill
          className="object-contain p-8 md:p-12"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={currentIndex === 0}
          fetchPriority={currentIndex === 0 ? "high" : "auto"}
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
      <div className="pdp-thumbs">
        {thumbs.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={clsx("pdp-thumb tile")}
            style={{
              aspectRatio: "1/1",
              outline:
                currentIndex === index
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              outlineOffset: 2,
            }}
          >
            <div style={{ position: "relative", width: "60%", height: "60%" }}>
              <SafeImage
                src={image}
                alt={`${name} ${index + 1}`}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
