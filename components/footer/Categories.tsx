import { getAllCategories } from "@/actions/categoriesAction";
import ROUTES from "@/constants/routes";
import Link from "next/link";

export default async function Categories() {
  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];
  return (
    <ul className="space-y-2 text-gray-300">
      {categories?.map((category) => (
        <li key={category.id}>
          <Link 
            className="hover:text-white transition-colors"
            href={{pathname:ROUTES.PRODUCTS,query:{"category":`${category.id}`}}}
          >
            {category.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
