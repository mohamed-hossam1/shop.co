import { getTopSelling } from "@/actions/productsAction";
import ProductSection from "@/components/home/ProductSection";

export default async function TopSellingWrapper() {
  const topSellingRes = await getTopSelling(10);
  const topSelling =
    topSellingRes.success && topSellingRes.data ? topSellingRes.data : [];

  if (topSelling.length === 0) return null;

  return (
    <ProductSection
      title="TOP SELLING"
      products={topSelling}
      viewAllLink="/products?is_top_selling=true"
    />
  );
}

