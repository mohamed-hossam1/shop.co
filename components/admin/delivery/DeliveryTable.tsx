"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Delivery } from "@/types/deliveryFee";
import { deleteDeliverySetting } from "@/actions/deliveryAction";
import {
  AdminEmptyState,
  AdminNotice,
} from "@/components/admin/AdminUI";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function DeliveryTable({ initialData }: { initialData: Delivery[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const res = await deleteDeliverySetting(deleteId);
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
                City
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Delivery Fee
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.2em] text-black/45">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {initialData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-0 py-0 border-none">
                  <AdminEmptyState
                    title="No Delivery Settings Yet"
                    description="You haven't configured any delivery cities or fees. Shoppers will not be able to select a city at checkout until you add one."
                    actionLabel="Add City"
                    actionHref="/admin/delivery/new"
                  />
                </td>
              </tr>
            ) : (
              initialData.map((setting) => (
                <tr key={setting.id} className="group hover:bg-black/[0.01]">
                  <td className="px-6 py-4">
                    <span className="text-sm font-black uppercase tracking-tight text-black">
                      {setting.city}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-black">
                      {setting.delivery_fee} EGP
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/delivery/${setting.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center border border-black transition hover:bg-black hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(setting.id)}
                        className="flex h-8 w-8 items-center justify-center border border-black text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Delivery Setting"
        description="Are you sure you want to remove this city? Shoppers will no longer be able to select it at checkout. Historical orders will remain unchanged."
        confirmLabel="Remove City"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
