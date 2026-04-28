import ProductCardSkeleton from "./ProductCardSkeleton";

export default function CardListSkeleton() {
  return (
    <div className="relative">
      <div className="flex overflow-auto custom-scroll mb-10 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full md:min-w-60 min-w-40 max-w-84 shrink-0">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}