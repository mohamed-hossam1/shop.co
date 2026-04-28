"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ImageSlider({ images }: { images: string[] }) {
  const [curSlide, setCurSlide] = useState(0);

  const sliderRight = () => {
    setCurSlide((prev) => (prev + 1) % images.length);
  };

  const sliderLeft = () => {
    setCurSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      sliderRight();
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setEndX(e.clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = endX - startX;
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        sliderLeft();
      } else {
        sliderRight();
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="mx-6 items-center relative">
        <div className="relative h-[420px] mb-6 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="mx-6 items-center relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="relative h-[500px] mb-6 border border-black overflow-hidden bg-white">
        {images.map((image, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(${100 * (i - curSlide)}%)`,
            }}
          >
            <Image
              fill
              className="object-contain"
              src={image}
              alt={`Image ${i + 1}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center justify-center flex-wrap">
        {images.map((image, i) => (
          <div
            key={i}
            className={`cursor-pointer w-20 h-20 border transition-all duration-300 relative bg-white ${
              i === curSlide
                ? "border-black ring-2 ring-black ring-offset-2"
                : "border-gray-200 opacity-60 hover:opacity-100"
            }`}
            onClick={() => setCurSlide(i)}
          >
            <Image
              fill
              className="object-cover"
              src={image}
              alt={`Thumbnail ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
