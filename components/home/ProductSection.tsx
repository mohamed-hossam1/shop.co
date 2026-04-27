import { ProductListItem } from "@/types/Product";
import ProductCard from "../ProductCard";
import Link from "next/link";

interface ProductSectionProps {
  title: string;
  products: ProductListItem[];
  viewAllLink: string;
}

export default function ProductSection({ title, products, viewAllLink }: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full py-12 sm:py-20 bg-white border-b border-black/10 last:border-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl font-integral font-black text-center mb-8 sm:mb-14 tracking-[0.04em]">
          {title}
        </h2>
        
        <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[190px] sm:min-w-[280px] md:min-w-[300px] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 flex justify-center">
          <Link
            href={viewAllLink}
            className="px-14 py-4 border border-black/10 rounded-full font-satoshi font-medium hover:bg-black hover:text-white transition-all w-full sm:w-fit text-center"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
