import Hero from "@/components/home/Hero";
import Reviews from "@/components/home/Reviews";
import { Suspense } from "react";
import NewArrivalsWrapper from "@/components/home/NewArrivalsWrapper";
import TopSellingWrapper from "@/components/home/TopSellingWrapper";
import CategoriesWrapper from "@/components/home/CategoriesWrapper";
import {
  CategoriesSkeleton,
  ProductSectionSkeleton,
} from "@/components/home/HomeSkeletons";

export default function Home() {
  return (
    <main>
      <Hero />

      <Suspense fallback={<ProductSectionSkeleton title="NEW ARRIVALS" />}>
        <NewArrivalsWrapper />
      </Suspense>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-black/10" />
      </div>

      <Suspense fallback={<ProductSectionSkeleton title="TOP SELLING" />}>
        <TopSellingWrapper />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesWrapper />
      </Suspense>

      <Reviews />
    </main>
  );
}

