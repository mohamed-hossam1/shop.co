
export default function ImageSliderSkeleton() {
  return (
    <section className="mx-6 items-center relative animate-pulse">
      <div className="relative h-[500px] mb-6 border border-black bg-gray-100 overflow-hidden" />

      <div className="flex gap-4 items-center justify-center flex-wrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-20 border border-black/10 bg-gray-200" />
        ))}
      </div>
    </section>
  );
}
