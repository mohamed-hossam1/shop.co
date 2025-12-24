"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Slider() {
  const slides = [
    {
      bgcolor: "#212844",
      bgcolor2: "#3d4771a9",
      buColor: "#d3daf9",
      text: "Hair Care",
      text2: "UP to 30% OFF",
      buText: "Hair Care",
      img: "https://www.tyoemcosmetic.com/wp-content/uploads/%E8%BA%AB%E4%BD%93%E6%8A%A4%E7%90%86-banner.png",
      category: "68e93cbce2507605cbba84d2",
    },
    {
      bgcolor: "#212844",
      bgcolor2: "#3d4771a9",
      buColor: "#d3daf9",
      text: "Skincare",
      text2: "UP to 30% OFF",
      buText: "Skincare",
      img: "https://www.tyoemcosmetic.com/wp-content/uploads/%E9%BB%91%E5%8F%91%E6%8A%A4%E7%90%86banner.png",
      category: "68e93cbce2507605cbba84d2",
    },
    {
      bgcolor: "#212844",
      bgcolor2: "#3d4771a9",
      buColor: "#d3daf9",
      text: "Body Care",
      text2: "UP to 30% OFF",
      buText: "Body Care",
      img: "https://www.kadusprofessional.com/sites/default/files/styles/menu_category/public/images/packshot/Kadus_NEW%20Care%20Products%20Baseline_523x300_4.png.webp?itok=BuwgSiMS",
      category: "68e93cbce2507605cbba84d2",
    },
  ];

  const [curSlide, setCurSlide] = useState(0);

  const sliderRight = () => {
    setCurSlide((prev) => (prev + 1) % slides.length);
  };

  const sliderLeft = () => {
    setCurSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     sliderRight();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, []);

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

  return (
    <section
      className=" max-w-[1000px] px-5 sm:px-15 m-auto items-center h-[350px] relative mb-17 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <button
        className="w-18 h-18 rounded-full bg-primary-foreground absolute top-1/2 -translate-y-1/2 left-5 items-center justify-center transform duration-200 border-8 border-white cursor-pointer z-30 hidden sm:flex group"
        onClick={sliderLeft}
      >
        <ArrowLeft
          className="text-primary group-hover:scale-110 transform-all duration-300"
          size={37}
        />
      </button>

      <button
        className="w-18 h-18 rounded-full bg-primary-foreground absolute top-1/2 -translate-y-1/2 right-5   items-center justify-center transform duration-200 border-8 border-white cursor-pointer z-30 hidden sm:flex group"
        onClick={sliderRight}
      >
        <ArrowRight
          className="text-primary group-hover:scale-110 transform-all duration-300"
          size={37}
        />

        <i className="fa-solid fa-angle-right text-2xl text-primary group-hover:scale-110 transform-all duration-300"></i>
      </button>

      <div className="h-full pt-4 relative rounded-2xl transform-all duration-200 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            className={`absolute w-full h-full bg-gradient-to-r from-[#1a1a5c] to-[#14274E] pb-10 rounded-2xl overflow-hidden z-10 transition-transform duration-700 ease-in-out`}
            key={i}
            style={{
              transform: `translateX(${100 * (i - curSlide)}%)`,
            }}
          >
            <div
              className={`absolute w-[750px] h-[750px] rounded-full -top-[115%] -right-7 -z-10`}
              style={{ backgroundColor: slide.bgcolor2 }}
            ></div>
            <div
              className={`absolute w-[800px] h-[800px] rounded-full -top-[116%] -right-12 bg-[#ffffff00] border-4 -z-10`}
              style={{ borderColor: slide.bgcolor2 }}
            ></div>

            <div className="flex justify-between h-full items-center text-white ">
              <div className="flex-4 lg:flex flex-col m-32 gap-8 hidden mt-40">
                <span className="text-5xl xl:text-5xl font-extrabold">
                  {slide.text}
                </span>
                <span className="text-2xl xl:text-xl font-bold">
                  {slide.text2}
                </span>
                <Link
                  href={`/category/${slide.category}`}
                  className="hidden lg:block w-40 text-center relative text-xl border-2 border-black rounded-xl px-5 py-3 font-bold text-black overflow-hidden lg:mb-10 z-[1] transition-all duration-500 ease-in-out hover:text-white bg-white before:content-[''] before:absolute before:left-0 before:top-0 before:w-1/2 before:h-full before:bg-primary-hover before:-translate-y-full before:transition-all before:duration-500 before:ease-in-out hover:before:translate-y-0 before:z-[-1] after:content-[''] after:absolute after:left-[50%] after:top-0 after:w-1/2 after:h-full after:bg-primary-hover after:translate-y-full after:transition-all after:duration-500 after:ease-in-out after:delay-[300ms] hover:after:translate-y-0 after:z-[-1]"
                >
                  {slide.buText}
                </Link>
              </div>

              {/* <div className="flex-3 h-70 relative flex flex-col items-center gap-6 lg:w-2/5 lg:mr-32 ">
                
                <Image
                  src={slide.img}
                  alt={slide.text}
                  width={260}
                  height={260}
                  loading="eager"
                  className="md:hidden translate-y-4"
                />
                <Link
                  href={`/category/${slide.category}`}
                  className="lg:hidden relative text-2xl  border-2 border-black rounded-xl px-3 py-1.5 md:px-5 md:py-3 top-8 md:top-0 font-bold text-black overflow-hidden lg:mb-10 z-[1] transition-all duration-500 ease-in-out hover:text-white bg-white before:content-[''] before:absolute before:left-0 before:top-0 before:w-1/2 before:h-full before:bg-primary-hover before:-translate-y-full before:transition-all before:duration-500 before:ease-in-out hover:before:translate-y-0 before:z-[-1] after:content-[''] after:absolute after:left-[50%] after:top-0 after:w-1/2 after:h-full after:bg-primary-hover after:translate-y-full after:transition-all after:duration-500 after:ease-in-out after:delay-[300ms] hover:after:translate-y-0 after:z-[-1]"
                >
                  {slide.buText}
                </Link>
              </div> */}

              <div className="flex-3 h-70 relative flex flex-col items-center gap-6 lg:w-2/5 lg:mr-32 ">
                <Image
                  src={slide.img}
                  alt={slide.text}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                  className="hidden md:block"
                />
                <Image
                  src={slide.img}
                  alt={slide.text}
                  width={260}
                  height={260}
                  loading="eager"
                  className="md:hidden  flex-1"
                />
                <Link
                  href={`/category/${slide.category}`}
                  className="lg:hidden relative text-2xl  border-2 border-black rounded-xl px-3 py-1.5 md:px-5 md:py-3 md:top-0 font-bold text-black overflow-hidden lg:mb-10 z-[1] transition-all duration-500 ease-in-out hover:text-white bg-white before:content-[''] before:absolute before:left-0 before:top-0 before:w-1/2 before:h-full before:bg-primary-hover before:-translate-y-full before:transition-all before:duration-500 before:ease-in-out hover:before:translate-y-0 before:z-[-1] after:content-[''] after:absolute after:left-[50%] after:top-0 after:w-1/2 after:h-full after:bg-primary-hover after:translate-y-full after:transition-all after:duration-500 after:ease-in-out after:delay-[300ms] hover:after:translate-y-0 after:z-[-1]"
                >
                  {slide.buText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3.5 z-40">
        {slides.map((_, i) => (
          <button
            className={`cursor-pointer min-w-5 h-5 border-2 rounded-full ${
              i === curSlide ? "bg-primary-hover" : "bg-primary-foreground"
            }`}
            key={i}
            onClick={() => setCurSlide(i)}
          ></button>
        ))}
      </div>

      
    </section>
  );
}
