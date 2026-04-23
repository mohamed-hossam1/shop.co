import Hero from "@/components/home/Hero";
import ProductSection from "@/components/home/ProductSection";
import { getNewArrivals, getTopSelling } from "@/actions/productsAction";
import BrowseByStyle from "@/components/home/BrowseByStyle";
import Reviews from "@/components/home/Reviews";
import { getAllCategories } from "@/actions/categoriesAction";

export default async function Home() {
  const { data: newArrivals = [] } = await getNewArrivals(4);
  const { data: topSelling = [] } = await getTopSelling(4);
  const { data: categories = [] } = (await getAllCategories()) as any;

  return (
    <main>
      <Hero />
      <ProductSection
        title="NEW ARRIVALS"
        products={newArrivals || []}
        viewAllLink="/products?filter=new-arrivals"
      />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-black/10" />
      </div>
      <ProductSection
        title="TOP SELLING"
        products={topSelling || []}
        viewAllLink="/products?filter=top-selling"
      />
      <BrowseByStyle categories={categories || []} />
      <Reviews />
    </main>
  );
}
