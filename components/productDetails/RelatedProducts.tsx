import { getRelatedProducts } from "@/actions/productsAction"
import CardList from "../showProducts/CardList"


export default async function RelatedProducts({categoryId, productId}:{categoryId:number, productId:number}) {
  const {data:products} = await getRelatedProducts(categoryId, productId)

  return (
    <div>
      
      <CardList products={products??[]}/>
    </div>
  )
}
