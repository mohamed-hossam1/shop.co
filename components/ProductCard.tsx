import { ProductListItem } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = React.memo(({ product }: { product: ProductListItem }) => {
  const discount = product.min_price_before
    ? Math.round(
        ((product.min_price_before - product.min_price) / product.min_price_before) *
          100,
      )
    : 0;


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
          src={product.image_cover || '/images/default-fallback.png'}
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
            ${product.min_price}
          </span>
          {product.min_price_before &&
            product.min_price_before > product.min_price && (
              <>
                <span className="text-xl sm:text-2xl font-bold font-satoshi text-black/40 line-through">
                  ${product.min_price_before}
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
