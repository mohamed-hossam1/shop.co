import { getAllCategories } from "@/actions/categoriesAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import ProductForm from "@/components/admin/products/ProductForm";

export default async function NewProductPage() {
  const categoriesRes = await getAllCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Product"
        description="Create a new product with multiple variants and gallery images."
      />

      <ProductForm categories={categories} />
    </div>
  );
}
