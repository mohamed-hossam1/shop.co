"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Edit, Trash2 } from "lucide-react";
import { AdminProductListItem, Category } from "@/types/Product";
import { deleteProduct } from "@/actions/productsAction";
import {
  AdminStatusBadge,
  AdminEmptyState,
  adminInputClassName,
  adminSelectClassName,
  adminCheckboxClassName,
  AdminNotice,
} from "@/components/admin/AdminUI";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

export default function ProductTable({
  products,
  categories,
}: {
  products: AdminProductListItem[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const showDeleted = searchParams.get("showDeleted") === "true";
  const isNewArrival = searchParams.get("isNewArrival") === "true";
  const isTopSelling = searchParams.get("isTopSelling") === "true";

  const updateFilters = (updates: Record<string, string | boolean | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const res = await deleteProduct(deleteId);
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

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className={cn(adminInputClassName, "pl-12")}
            />
          </div>
        </div>

        <div className="w-full lg:w-48 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => updateFilters({ categoryId: e.target.value })}
            className={adminSelectClassName}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-6 pb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => updateFilters({ isNewArrival: e.target.checked })}
              className={adminCheckboxClassName}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/65">
              New Arrival
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isTopSelling}
              onChange={(e) => updateFilters({ isTopSelling: e.target.checked })}
              className={adminCheckboxClassName}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/65">
              Top Selling
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => updateFilters({ showDeleted: e.target.checked })}
              className={adminCheckboxClassName}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/65">
              Show Deleted
            </span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto border border-black">
        <table className="w-full text-left">
          <thead className="border-b border-black bg-black/[0.02]">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Product
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Category
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Price
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-0 py-0 border-none">
                  <AdminEmptyState
                    title={search || categoryId || isNewArrival || isTopSelling || showDeleted ? "No Matching Products" : "No Products Yet"}
                    description={search || categoryId || isNewArrival || isTopSelling || showDeleted 
                      ? "Try adjusting your filters or search terms to find what you're looking for." 
                      : "Your catalog is empty. Start by adding your first product with variants and images."
                    }
                    actionLabel="Add Product"
                    actionHref="/admin/products/new"
                  />
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const category = categories.find((c) => c.id === product.category_id);
                return (
                  <tr key={product.id} className="group hover:bg-black/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 border border-black bg-white overflow-hidden">
                          {product.image_cover ? (
                            <Image
                              src={product.image_cover}
                              alt={product.title}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-black/5 text-[10px] font-bold text-black/20">
                              NO IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black uppercase tracking-tight text-black">
                            {product.title}
                          </p>
                          <p className="text-[10px] font-bold text-black/40">
                            ID: #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold uppercase tracking-wide text-black/60">
                        {category?.title || "None"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-black">
                        {product.min_price} EGP
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {product.is_deleted ? (
                          <AdminStatusBadge label="Deleted" tone="danger" />
                        ) : (
                          <AdminStatusBadge label="Active" tone="success" />
                        )}
                        
                        {(() => {
                          const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) ?? 0;
                          const hasOutOfStock = product.variants?.some(v => v.stock === 0);
                          
                          if (totalStock === 0) {
                            return <AdminStatusBadge label="Out of Stock" tone="danger" />;
                          } else if (hasOutOfStock) {
                            return <AdminStatusBadge label="Partial OOS" tone="warning" />;
                          } else if (totalStock <= 5) {
                            return <AdminStatusBadge label="Low Stock" tone="warning" />;
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center border border-black transition hover:bg-black hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {!product.is_deleted && (
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="flex h-8 w-8 items-center justify-center border border-black text-red-600 transition hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
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
        title="Delete Product"
        description="Are you sure you want to delete this product? It will be hidden from shoppers but remain in the admin list."
        confirmLabel="Delete Product"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
