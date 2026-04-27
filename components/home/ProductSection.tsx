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
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
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
