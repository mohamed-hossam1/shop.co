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
      className="group flex flex-col h-full w-full bg-white border border-transparent hover:border-black transition-all p-3"
    >
      <div className="relative w-full pb-[125%] bg-white border border-black overflow-hidden shrink-0">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          src={product.image_cover || '/images/default-fallback.png'}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-2 mt-3 flex-1">
        <h3 className="font-satoshi font-bold text-base sm:text-lg line-clamp-2 uppercase tracking-tight min-h-12 leading-tight">
          {product.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <span className="text-lg sm:text-xl font-black font-satoshi">
            {product.min_price} EGP
          </span>
          {product.min_price_before &&
            product.min_price_before > product.min_price && (
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold font-satoshi text-black/40 line-through">
                  {product.min_price_before} EGP
                </span>
                <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  -{discount}%
                </span>
              </div>
            )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
