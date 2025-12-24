"use client";

import ROUTES from "@/constants/routes";
import { useCart } from "@/Context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { quantity } = useCart() ;


  return (
    <div >
      <Link
        className="relative p-2 text-primary transition-all duration-300"
        href={ROUTES.CART}
      >
        <svg
          className="w-6 h-6 hover:animate-wiggle hover:text-primary-hover"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
          ></path>
        </svg>
        {
          quantity!=0&&(
            <div className="absolute bg-gradient-to-r from-[#1F1F6F] to-[#14274E] top-4 left-4 w-5 h-5 rounded-full flex justify-center items-center">
              <p className="text-white text-sm relative top-[1.5px] -left-[.5px]">{quantity}</p>
            </div>
          )
        }
      </Link>
    </div>
  );
}
