import React from "react";

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <div className="relative aspect-square w-full bg-[#F0EEED] rounded-[20px] overflow-hidden" />
      <div className="flex flex-col gap-2">
        <div className="h-6 bg-[#F0EEED] rounded-md w-3/4" />
        <div className="h-4 bg-[#F0EEED] rounded-md w-1/2" />
        <div className="h-8 bg-[#F0EEED] rounded-md w-1/3 mt-1" />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="px-14 py-4 border border-black/10 rounded-full w-full sm:w-40 h-14 bg-[#F0EEED] animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export const CategoriesSkeleton = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div className="bg-[#F0F0F0] rounded-[20px] sm:rounded-[40px] p-6 sm:p-16 lg:p-20">
        <h2 className="text-3xl sm:text-5xl font-integral font-black text-center mb-10 sm:mb-16 tracking-[0.04em]">
          BROWSE BY STYLE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="md:col-span-1 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-[20px] animate-pulse" />
          <div className="md:col-span-2 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-[20px] animate-pulse" />
          <div className="md:col-span-2 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-[20px] animate-pulse" />
          <div className="md:col-span-1 h-[200px] sm:h-[289px] bg-[#F0EEED] rounded-[20px] animate-pulse" />
        </div>
      </div>
    </section>
  );
};
