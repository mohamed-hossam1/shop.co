import Products from "@/components/showProducts/ShowProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Cura - Premium Beauty & Personal Care",
  description:
    "Browse our complete collection of premium organic beauty products, skincare, shampoos, conditioners, and personal care items.",
  keywords:
    "products, beauty products, skincare, cosmetics, personal care, organic products",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "All Products | Cura",
    description:
      "Browse our complete collection of premium beauty and personal care products.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <div>
      <Products />
    </div>
  );
}
