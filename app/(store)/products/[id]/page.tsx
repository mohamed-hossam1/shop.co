import ProductDetails from "@/components/productDetails/ProductDetails";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Product | Cura Store`,
    description:
      "Browse our premium organic beauty and personal care products.",
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      type: "website",
      url: `/products/${id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails id={id} />
    </Suspense>
  );
}
