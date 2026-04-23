import { getAllProduct } from "@/actions/productsAction";
import SubTitle from "./SubTitle";
import CardList from "./CardList";
import { ProductData } from "@/types/Product";

interface GroupedProducts {
  [categoryName: string]: ProductData[];
}

export default async function ShowProducts() {
  const { data: products } = (await getAllProduct()) || { data: [] };

  const categoryId: number[] = [];

  const categoryImage: string[] = [];

  const grouped: GroupedProducts = products?.reduce<GroupedProducts>((acc, item) => {
    const product = item as unknown as ProductData;
    const category = product.categories;
    const categoryName = category?.title || "Unknown";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
      categoryImage.push(category?.image || "");
      categoryId.push(category?.id || 0);
    }

    acc[categoryName].push(product);

    return acc;
  }, {}) || {};

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
