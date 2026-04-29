import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllCategories } from "@/actions/categoriesAction";
import { getProducts } from "@/actions/productsAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import CategoryTable from "@/components/admin/categories/CategoryTable";

export default async function AdminCategoriesPage() {
  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  const productCounts: Record<number, number> = {};
  
  if (categories.length > 0) {
    const productsRes = await getProducts({ showDeleted: true });
    const products = productsRes.success ? productsRes.data : [];
    
    products.forEach(p => {
      if (p.category_id) {
        productCounts[p.category_id] = (productCounts[p.category_id] || 0) + 1;
      }
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organize your products into logical groupings for easier browsing."
        actions={
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        }
      />

      <CategoryTable categories={categories} productCounts={productCounts} />
    </div>
  );
}
