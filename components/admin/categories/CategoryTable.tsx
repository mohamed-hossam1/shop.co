"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/types/Product";
import { deleteCategory } from "@/actions/categoriesAction";
import {
  AdminNotice,
  AdminEmptyState,
} from "@/components/admin/AdminUI";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

export default function CategoryTable({
  categories,
  productCounts,
}: {
  categories: Category[];
  productCounts: Record<number, number>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const res = await deleteCategory(deleteId);
      if (res.success) {
        setDeleteId(null);
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <AdminNotice tone="danger" title="Error">
          {error}
        </AdminNotice>
      )}

      <div className="overflow-x-auto border border-black">
        <table className="w-full text-left">
          <thead className="border-b border-black bg-black/[0.02]">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Category
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Slug
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Products
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-0 py-0 border-none">
                  <AdminEmptyState
                    title="No Categories Yet"
                    description="Your catalog doesn't have any categories. Create one to start organizing your products."
                    actionLabel="Add Category"
                    actionHref="/admin/categories/new"
                  />
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const count = productCounts[category.id] || 0;
                const canDelete = count === 0;

                return (
                  <tr key={category.id} className="group hover:bg-black/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 border border-black bg-white overflow-hidden">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.title}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-black/5 text-[10px] font-bold text-black/20">
                              NO IMG
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-black uppercase tracking-tight text-black">
                          {category.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-bold text-black/60">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-black">
                        {count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center border border-black transition hover:bg-black hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => setDeleteId(category.id)}
                            disabled={!canDelete}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center border border-black transition",
                              canDelete 
                                ? "text-red-600 hover:bg-red-600 hover:text-white" 
                                : "opacity-35 cursor-not-allowed"
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {!canDelete && (
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-20">
                              <div className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 whitespace-nowrap border border-black shadow-xl">
                                Remove {count} products first
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete Category"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
