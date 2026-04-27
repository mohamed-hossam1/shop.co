import { getProducts } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";
import SubTitle from "./SubTitle";
import CardList from "./CardList";
import { ProductListItem } from "@/types/Product";

interface GroupedProducts {
  [categoryName: string]: ProductListItem[];
}

export default async function ShowProducts({
  searchQuery,
  isTopSelling,
  isNewArrival,
}: {
  searchQuery?: string;
  isTopSelling?: boolean;
  isNewArrival?: boolean;
} = {}) {
  const productsRes = await getProducts({
    searchQuery,
    isTopSelling,
    isNewArrival,
  });
  const categoriesRes = await getAllCategories();

  const products = productsRes.success ? productsRes.data : [];

  const categories = categoriesRes.success ? categoriesRes.data : [];

  const categoryId: number[] = [];
  const categoryImage: string[] = [];

  const grouped: GroupedProducts = products.reduce<GroupedProducts>((acc: GroupedProducts, product: ProductListItem) => {
    const category = categories.find((c) => c.id === product.category_id);
    const categoryName = category?.title || "Unknown";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
      categoryImage.push(category?.image || "");
      categoryId.push(category?.id || 0);
    }

    acc[categoryName].push(product);

    return acc;
  }, {});

  return (
    <div className="max-w-[1600px] px-5 m-auto">
      {Object.entries(grouped).map(([categoryTitle, products], i) => (
        <div key={categoryId[i]}>
          <SubTitle
            categoryTitle={categoryTitle}
            categoryImage={categoryImage[i]}
            categoryId={categoryId[i]}
          />
          <CardList products={products} />
        </div>
      ))}
    </div>
  );
}
