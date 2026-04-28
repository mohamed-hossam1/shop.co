import { getRelatedProducts } from "@/actions/productsAction";
import CardList from "../showProducts/CardList";

export default async function RelatedProducts({
  categoryId,
  productId,
}: {
  categoryId: number;
  productId: number;
}) {
  const result = await getRelatedProducts(categoryId, productId);
  const products = "data" in result ? result.data : [];

  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="text-3xl font-bold mb-10 font-integral uppercase">
        Related Products
      </h3>

      <CardList products={products} />
    </div>
  );
}
