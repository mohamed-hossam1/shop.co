import { getRelatedProducts } from "@/actions/productsAction"
import CardList from "../showProducts/CardList"


export default async function RelatedProducts({categoryId, productId}:{categoryId:number, productId:number}) {
  const result = await getRelatedProducts(categoryId, productId);
  const products = "data" in result ? result.data : [];

  return (
    <div>
      
      <CardList products={products ?? []} />
    </div>
  )
}
