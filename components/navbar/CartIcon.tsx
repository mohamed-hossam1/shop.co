"use client";

import ROUTES from "@/constants/routes";
import { useCart } from "@/stores/cartStore";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { quantity } = useCart();

  return (
    <div>
      <Link
        className="relative p-1 text-black transition-all duration-300"
        href={ROUTES.CART}
      >
        <ShoppingCart className="w-6 h-6 hover:text-black/70 transition-colors" />
        {quantity !== 0 && (
          <div className="absolute top-4 -right-4 bg-black text-white w-4 h-4 rounded-full flex justify-center items-center text-[10px]">
            {quantity}
          </div>
        )}
      </Link>
    </div>
  );
}
