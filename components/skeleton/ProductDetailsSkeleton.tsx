import ImageSliderSkeleton from "./ImageSliderSkeleton";
import QuantityProductSkeleton from "./QuantityProductSkeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-[1450px] px-5 m-auto mt-12 animate-pulse">
      <div className="w-11/12 m-auto">
        <div className="md:flex justify-between mb-6 gap-12">
          <div className="flex-1 md:flex-[0.8] justify-center items-center bg-white">
            <div className="flex w-full flex-col gap-4 ">
              <div className="mb-6">
                <ImageSliderSkeleton />
              </div>
            </div>
          </div>
          <div className="flex-1 pt-5">
            <div className="h-10 bg-gray-200 w-3/4 mb-10"></div>
            <QuantityProductSkeleton />
          </div>
        </div>
        <div className="mb-20">
          <div className="flex border-b border-black mb-6">
            <span className="pb-3 text-xl font-black font-integral uppercase border-b-2 border-black tracking-widest opacity-20">
              Description
            </span>
          </div>
          <div className="h-32 bg-gray-100 w-full mt-6"></div>
        </div>
      </div>
    </div>
  );
}
