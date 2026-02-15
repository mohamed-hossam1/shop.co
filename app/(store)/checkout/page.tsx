"use client";

import CheckoutList from "@/components/checkout/CheckoutList";
import CartSkeleton from "@/components/skeleton/CartSkeleton";
import { useCart } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!cart || Object.keys(cart).length === 0) {
      router.replace("/cart");
    }
  }, []);

  if (isLoading || cart === null || Object.keys(cart).length === 0) {
    return (
      <div className="min-h-screen">
        {" "}
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CheckoutList />
    </div>
  );
}
