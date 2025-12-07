"use client";

import CheckoutList from "@/components/checkout/CheckoutList";
import CartSkeleton from "@/components/skeleton/CartSkeleton";
import { useCart } from "@/Context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cart === undefined || cart === null) return <CartSkeleton />;

    if (!cart || Object.keys(cart).length === 0) {
      router.replace("/cart");
      return;
    }

  }, [cart, router]);

  
  if (isLoading || cart === null || Object.keys(cart).length === 0) {
    return <CartSkeleton />;
  }

  return <div><CheckoutList /></div>;
}
