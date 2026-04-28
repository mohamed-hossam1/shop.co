
export default function QuantityProductSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-4 w-24 bg-gray-100 mb-4"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 border border-black/10" />
          ))}
        </div>
      </div>

      <div>
        <div className="h-4 w-20 bg-gray-100 mb-4"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-16 h-10 bg-gray-200 border border-black/10" />
          ))}
        </div>
      </div>

      <div>
        <div className="h-4 w-24 bg-gray-100 mb-4"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-black p-4 space-x-6">
            <div className="w-6 h-6 bg-gray-200"></div>
            <div className="w-8 h-6 bg-gray-200"></div>
            <div className="w-6 h-6 bg-gray-200"></div>
          </div>
        </div>
      </div>

      <div className="h-14 w-full bg-black opacity-10"></div>
    </div>
  );
}
