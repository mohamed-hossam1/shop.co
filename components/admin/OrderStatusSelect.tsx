"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateOrderStatus } from "@/actions/ordersAction";
import { ADMIN_ORDER_STATUSES } from "@/lib/admin";
import { adminSelectClassName } from "@/components/admin/AdminUI";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const availableStatuses = ADMIN_ORDER_STATUSES.includes(currentStatus as never)
    ? ADMIN_ORDER_STATUSES
    : [currentStatus, ...ADMIN_ORDER_STATUSES];

  const handleSave = () => {
    startTransition(() => {
      void (async () => {
        const result = await updateOrderStatus(orderId, status);
        setMessage(result.success ? "Saved." : result.message);
        if (result.success) {
          router.refresh();
        }
      })();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          disabled={isPending}
          className={adminSelectClassName}
        >
          {availableStatuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || status === currentStatus}
          className="border border-black bg-black px-4 py-3 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving" : "Save"}
        </button>
      </div>
      {message ? (
        <p className="text-xs font-medium text-black/55">{message}</p>
      ) : null}
    </div>
  );
}
