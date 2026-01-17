import Cart from "@/components/cart/Cart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Cura",
  description: "Review your shopping cart and proceed to checkout.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/cart",
  },
};

export default function page() {
  return (
    <div className="min-h-screen">
      <Cart />
    </div>
  );
}
