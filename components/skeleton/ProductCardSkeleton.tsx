export default function ProductCardSkeleton() {
  return (
    <div className="w-full h-full bg-white border border-black p-3 animate-pulse">
      <div className="relative w-full pb-[125%] bg-gray-100 border border-black/5" />

      <div className="flex flex-col gap-2 mt-3">
        <div className="h-6 bg-gray-200 rounded-none w-3/4" />
        <div className="h-12 bg-gray-200 rounded-none w-full" />
        <div className="flex items-center gap-2 mt-auto">
          <div className="h-6 w-20 bg-gray-200 rounded-none" />
          <div className="h-6 w-16 bg-gray-100 rounded-none" />
        </div>
      </div>
    </div>
  );
}
