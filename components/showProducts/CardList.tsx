import { ProductListItem } from "@/types/Product";
import ProductCard from "../ProductCard";

interface CardListProp{
  products: ProductListItem[]|[]
}

export default function CardList({ products }:CardListProp) {
  

  return (
    <div className="relative">
      <div className="flex overflow-auto custom-scroll mb-10 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {
          [...Array(5 - products.length)].map((_,i)=>(
            <div key={i} className="w-full md:min-w-60 min-w-40 max-w-84"></div>
          ))
        }
      </div>
    </div>
  );
}