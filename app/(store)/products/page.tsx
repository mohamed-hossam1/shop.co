import Products from "@/components/showProducts/ShowProducts";



export default async function ProductsPage({
  searchParams,
}: {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const search = typeof params?.search === "string" ? params.search : undefined;
  const category = typeof params?.category === "string" ? params.category : undefined;
  const isTopSelling = params?.is_top_selling === "true";
  const isNewArrival = params?.is_new_arrival === "true";

  return (
    <div>
      <Products
        searchQuery={search}
        categorySlug={category}
        isTopSelling={isTopSelling}
        isNewArrival={isNewArrival}
      />
    </div>
  );
}

