import { getRelatedProducts } from "@/app/actions/productsAction"
import CardList from "../showProducts/CardList"


export default async function RelatedProducts({categoryId, prodactId}:{categoryId:number, prodactId:number}) {
  const {data:products} = await getRelatedProducts(categoryId, prodactId)

  return (
    <div>
      
      <CardList products={products}/>
    </div>
  )
}
