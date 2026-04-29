import { notFound } from "next/navigation";
import { getCategoryById } from "@/actions/categoriesAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  const res = await getCategoryById(categoryId);

  if (!res.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Category"
        description={`Modify details for ${res.data.title}.`}
      />

      <CategoryForm category={res.data} />
    </div>
  );
}
