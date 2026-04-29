"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/Product";
import { createCategory, updateCategory } from "@/actions/categoriesAction";
import {
  AdminField,
  AdminNotice,
  adminInputClassName,
} from "@/components/admin/AdminUI";

interface CategoryFormProps {
  category?: Category;
}

const toSlug = (input: string) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState(category?.title || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [image, setImage] = useState(category?.image || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!category && !slugManuallyEdited) {
      setSlug(toSlug(title));
    }
  }, [title, category, slugManuallyEdited]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Required";
    if (!slug.trim()) errors.slug = "Required";
    if (slug && !/^[a-z0-9-]+$/.test(slug)) {
      errors.slug = "Invalid format: lowercase alphanumeric and hyphens only";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      title,
      slug,
      image: image || null,
    };

    startTransition(async () => {
      const res = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (res.success) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        // Handle database unique constraint error if it occurs
        if (res.message.toLowerCase().includes("unique") || res.message.toLowerCase().includes("slug")) {
          setFieldErrors({ slug: "This slug is already in use" });
        } else {
          setError(res.message);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <AdminNotice tone="danger" title="Server Error">
          {error}
        </AdminNotice>
      )}

      <div className="grid grid-cols-1 gap-8 border border-black bg-white p-8">
        <AdminField label="Category Title" error={fieldErrors.title}>
          <input
            type="text"
            placeholder="e.g. Beauty & Wellness"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={adminInputClassName}
          />
        </AdminField>

        <AdminField 
          label="URL Slug" 
          hint="Must be unique" 
          error={fieldErrors.slug}
        >
          <input
            type="text"
            placeholder="e.g. beauty-wellness"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManuallyEdited(true);
            }}
            className={adminInputClassName}
          />
        </AdminField>

        <AdminField label="Thumbnail Image URL" hint="Optional">
          <input
            type="text"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className={adminInputClassName}
          />
        </AdminField>
      </div>

      <div className="flex justify-end gap-4 border border-black bg-white p-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="inline-flex border border-black bg-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex border border-black bg-black px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black disabled:opacity-50"
        >
          {isPending ? "Saving..." : category ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}
