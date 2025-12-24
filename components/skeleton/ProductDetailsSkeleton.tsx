import ImageSliderSkeleton from "./ImageSliderSkeleton";
import QuantityProductSkeleton from "./QuantityProductSkeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-[1450px] px-5 m-auto mt-12">
      <div className="w-11/12 m-auto">
        <div className="md:flex justify-between mb-6">
          <div className="flex-8  justify-center items-center bg-white md:mr-16">
            <div className="flex w-full flex-col gap-4 ">
              <div className="mb-6">
                <ImageSliderSkeleton />
              </div>


            </div>
          </div>
          <div className="flex-10 pt-5">
            <h1 className="text-3xl font-bold mb-10 bg-gray-200  animate-pulse w-1/3 h-8"></h1>
            <QuantityProductSkeleton />
          </div>
        </div>
        <div className="mb-20">
          <div className="flex border-b ">
            <span className="py-1 text-lg text-primary border-b-2 border-primary font-medium ">
              Description
            </span>
          </div>
          <h2 className="pt-4 text-xl font-semibold bg-gray-200  animate-pulse h-10 w-1/2  mt-6"></h2>
        </div>
      </div>
    </div>
  );
}
