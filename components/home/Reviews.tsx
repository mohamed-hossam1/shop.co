"use client";

import { Star, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    text: "I'm blown away by the quality and style of the clothes I received from Elaris. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    rating: 5,
  },
  {
    id: 2,
    name: "Alex K.",
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Elaris. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    rating: 5,
  },
  {
    id: 3,
    name: "James L.",
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Elaris. The selection of clothes is not only diverse but also on-point with the latest trends.",
    rating: 5,
  },
  {
    id: 4,
    name: "Mooen M.",
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Elaris. The selection of clothes is not only diverse but also on-point with the latest trends.",
    rating: 5,
  },
  {
    id: 5,
    name: "Samantha D.",
    text: "I've been shopping at Elaris for a while now and I'm always impressed by the quality of their products and the level of customer service they provide.",
    rating: 5,
  }
];

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-12 sm:py-20 bg-white overflow-hidden mb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl font-integral font-black tracking-[0.04em] uppercase">
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll("left")}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {REVIEWS.map((review, index) => (
            <div
              key={review.id}
              className="min-w-full sm:min-w-[400px] bg-white border border-black/10 rounded-[20px] p-6 sm:p-8 flex flex-col gap-3 sm:gap-4 snap-start"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? "fill-[#FFC633] text-[#FFC633]" : "text-black/10"}`} 
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold font-satoshi">{review.name}</span>
                <CheckCircle2 className="w-5 h-5 fill-[#01AB31] text-white" />
              </div>
              
              <p className="text-black/60 font-satoshi text-sm sm:text-base leading-relaxed">
                &quot;{review.text}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
