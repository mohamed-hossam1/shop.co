import { ProductData } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = React.memo(({ product }: { product: ProductData }) => {
  const discount = product.price_before
    ? Math.round(
        ((product.price_before - product.price_after) / product.price_before) *
          100,
      )
    : 0;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const fillAmount = Math.min(Math.max(rating - i, 0), 1) * 100;
      return (
        <div key={i} className="relative w-4 h-4 sm:w-[18px] sm:h-[18px]">
          <svg
            viewBox="0 0 24 24"
            className="absolute inset-0 w-full h-full text-[#FFC633]"
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <div
            className="absolute inset-0 bg-[#F0EEED] overflow-hidden"
            style={{ left: `${fillAmount}%` }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[18.5px] h-[18.5px] sm:w-[22px] sm:h-[22px] text-[#F0EEED] relative -left-[0.2px]"
              fill="currentColor"
              style={{ left: `-${fillAmount}%` }}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
      );
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col gap-4 w-full"
    >
      <div className="relative aspect-square w-full bg-[#F0EEED] rounded-[20px] overflow-hidden">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          src={product.image_cover}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-1 sm:gap-2">
        <h3 className="font-satoshi font-bold text-base sm:text-lg lg:text-xl truncate">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl font-bold font-satoshi">
            ${product.price_after}
          </span>
          {product.price_before &&
            product.price_before > product.price_after && (
              <>
                <span className="text-xl sm:text-2xl font-bold font-satoshi text-black/40 line-through">
                  ${product.price_before}
                </span>
                <span className="bg-[#FF3333]/10 text-[#FF3333] text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
