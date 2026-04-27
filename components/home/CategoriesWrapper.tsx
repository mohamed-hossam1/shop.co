import { getAllCategories } from "@/actions/categoriesAction";
import BrowseByStyle from "@/components/home/BrowseByStyle";

export default async function CategoriesWrapper() {
  const categoriesRes = await getAllCategories();
  const categories =
    categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];

  return <BrowseByStyle categories={categories as any} />;
}
