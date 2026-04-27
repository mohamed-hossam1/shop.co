import { getProductById } from "@/actions/productsAction";
import QuantityProduct from "./QuantityProduct";
import RelatedProducts from "./RelatedProducts";
import { Suspense } from "react";
import CardListSkeleton from "../skeleton/CardListSkeleton";
import ImageSlider from "./ImageSlider";

export default async function ProductDetails({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  const product = response.success ? response.data : null;

  if (!product) {
    return (
      <div className="max-w-[1450px] px-5 m-auto mt-12 text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }


  return (
    <div className="max-w-[1450px] px-5 m-auto mt-12 font-satoshi">
      <div className="w-11/12 m-auto">
        <div className="md:flex justify-between mb-6 gap-12">
          <div className="flex-1 md:flex-[0.8] justify-center items-center bg-white">
            <div className="flex w-full flex-col gap-4">
              <div className="mb-6">
                <ImageSlider images={[...(product.image_cover ? [product.image_cover] : []), ...(product.images?.map((img: any) => img.url) || [])]} />
              </div>
            </div>
          </div>
          <div className="flex-1 pt-5">
            <h1 className="text-4xl font-bold mb-6 font-integral uppercase">{product.title}</h1>
            <QuantityProduct product={product} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-10 mb-20">
          {product.description && (
            <div>
              <div className="flex border-b mb-4">
                <span className="pb-2 text-xl font-bold font-integral uppercase border-b-2 border-black">
                  Description
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg italic">
                {product.description}
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-3xl font-bold mb-10 font-integral uppercase">Related Products</h3>
          <Suspense fallback={<CardListSkeleton />}>
            <RelatedProducts
              categoryId={product.category_id || 0}
              productId={product.id}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
