import ProductDetails from "@/components/productDetails/ProductDetails";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import { Suspense } from "react";



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
