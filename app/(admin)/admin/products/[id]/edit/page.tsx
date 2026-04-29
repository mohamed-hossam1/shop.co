import { notFound } from "next/navigation";
import { getProductById } from "@/actions/productsAction";
import { getAllCategories } from "@/actions/categoriesAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import ProductForm from "@/components/admin/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  const [productRes, categoriesRes] = await Promise.all([
    getProductById(productId),
    getAllCategories(),
  ]);

  if (!productRes.success) {
    notFound();
  }

  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Product"
        description={`Modify details for ${productRes.data.title}.`}
      />

      <ProductForm product={productRes.data} categories={categories} />
    </div>
  );
}
