import React from "react";

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse p-3 border border-transparent">
      <div className="relative w-full pb-[125%] bg-[#F0EEED] rounded-none border border-black/5 overflow-hidden" />
      <div className="flex flex-col gap-2 mt-3">
        <div className="h-6 bg-[#F0EEED] rounded-none w-3/4" />
        <div className="h-12 bg-[#F0EEED] rounded-none w-full" />
        <div className="h-8 bg-[#F0EEED] rounded-none w-1/3 mt-auto" />
      </div>
    </div>
  );
};

export const ProductSectionSkeleton = ({ title }: { title: string }) => {
  return (
    <section className="w-full py-12 sm:py-20 bg-white border-b border-black/10 last:border-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl font-integral font-black text-center mb-8 sm:mb-14 tracking-[0.04em]">
          {title}
        </h2>
        <div className="flex gap-4 sm:gap-5 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[190px] sm:min-w-[280px] md:min-w-[300px] shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="px-14 py-4 border border-black rounded-none w-full sm:w-40 h-14 bg-[#F0EEED] animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export const CategoriesSkeleton = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-16">
      <div className="max-w-[1400px] mx-auto bg-hero-background border border-black rounded-none p-6 sm:p-14 lg:p-16">
        <h2 className="text-3xl sm:text-5xl font-integral font-black text-center mb-10 sm:mb-16 tracking-[0.04em]">
          BROWSE BY STYLE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="md:col-span-1 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-none border border-black/5 animate-pulse" />
          <div className="md:col-span-2 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-none border border-black/5 animate-pulse" />
          <div className="md:col-span-2 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-none border border-black/5 animate-pulse" />
          <div className="md:col-span-1 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-none border border-black/5 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
