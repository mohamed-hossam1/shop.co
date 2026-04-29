import { AdminPageHeader } from "@/components/admin/AdminUI";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Category"
        description="Create a new grouping for your products."
      />

      <CategoryForm />
    </div>
  );
}
