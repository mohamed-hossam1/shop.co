"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Edit, Trash2 } from "lucide-react";
import { PromoCode } from "@/types/PromoCode";
import { deletePromoCode } from "@/actions/promoCodeAction";
import {
  AdminStatusBadge,
  AdminEmptyState,
  adminInputClassName,
  adminSelectClassName,
  AdminNotice,
} from "@/components/admin/AdminUI";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getPromoStatusTone } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function PromoCodeTable({ initialData }: { initialData: PromoCode[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "status" && value === "all")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/admin/promo-codes?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const res = await deletePromoCode(deleteId);
      if (res.success) {
        setDeleteId(null);
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  };

  const getPromoStatus = (promo: PromoCode) => {
    const now = new Date();
    const isExpired = promo.expires_at ? new Date(promo.expires_at) < now : false;
    const isExhausted = promo.max_uses !== null && promo.used_count >= promo.max_uses;

    if (!promo.is_active) return "inactive";
    if (isExpired) return "expired";
    if (isExhausted) return "exhausted";
    return "active";
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
            Search Promo Codes
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
            <input
              type="text"
              placeholder="Search by code..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className={cn(adminInputClassName, "pl-12")}
            />
          </div>
        </div>

        <div className="w-full lg:w-48 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className={adminSelectClassName}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="exhausted">Usage Capped</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-black">
        <table className="w-full text-left">
          <thead className="border-b border-black bg-black/[0.02]">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Code
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Discount
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Usage
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Expiry
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
            {initialData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-0 py-0 border-none">
                  <AdminEmptyState
                    title={search || status !== "all" ? "No Matching Promo Codes" : "No Promo Codes Yet"}
                    description={search || status !== "all"
                      ? "Try adjusting your filters or search terms to find what you're looking for."
                      : "You haven't created any promo codes yet. Start by adding a new one for your campaigns."
                    }
                    actionLabel="Add Promo Code"
                    actionHref="/admin/promo-codes/new"
                  />
                </td>
              </tr>
            ) : (
              initialData.map((promo) => {
                const currentStatus = getPromoStatus(promo);
                return (
                  <tr key={promo.id} className="group hover:bg-black/[0.01]">
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-integral text-sm font-black uppercase tracking-tight text-black">
                          {promo.code}
                        </p>
                        <p className="text-[10px] font-bold text-black/40">
                          Min: {promo.min_purchase} EGP
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-black">
                        {promo.value}{promo.type === "percentage" ? "%" : " EGP"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-black">
                          {promo.used_count} / {promo.max_uses ?? "∞"}
                        </span>
                        <div className="mt-1 h-1 w-24 bg-black/5">
                          {promo.max_uses && (
                            <div
                              className="h-full bg-black"
                              style={{ width: `${Math.min(100, (promo.used_count / promo.max_uses) * 100)}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold uppercase tracking-wide text-black/60">
                        {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : "NEVER"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge
                        label={currentStatus === "exhausted" ? "Usage Capped" : currentStatus}
                        tone={getPromoStatusTone(currentStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/promo-codes/${promo.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center border border-black transition hover:bg-black hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(promo.id)}
                          className="flex h-8 w-8 items-center justify-center border border-black text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
        title="Delete Promo Code"
        description="Are you sure you want to permanently delete this promo code? This action cannot be undone and shoppers will no longer be able to use it."
        confirmLabel="Delete Promo Code"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
