import { ProductData } from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = React.memo(({ product }: { product: ProductData }) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="w-full md:min-w-60 min-w-40 max-w-84 bg-white rounded-2xl border overflow-hidden hover:shadow-lg mb-2 transition-all duration-300"
    >
      <div className="relative md:h-52 h-30 bg-white">
        <Image
          fill
          sizes="(max-width: 768px) 50vw, 250px"
          className="w-full h-full object-contain"
          src={product.image_cover}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="p-5 h-45 flex flex-col justify-around">
        <div className="flex items-center justify-between">
          <div className="font-bold truncate">{product.title}</div>
        </div>

        <div className="md:flex gap-3 ">
          <div className="mt-5 text-lg md:text-xl font-bold text-primary">
            {product.price_after} EGP
          </div>
          {product.price_before&&

            <div className="md:mt-5 relative top-[2px] md:top-[2px] line-through font-bold text-primary">
              {product.price_before} EGP
            </div>
          }
        </div>

        <div className="py-2 px-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867]  rounded-xl mt-2  transition-all duration-300 hover:scale-105">
          <p className="h-full w-full text-sm md:text-lg text-white flex justify-center items-center font-bold transition-all duration-300">
            View Product
          </p>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;