"use client";

import { Order } from "@/types/Order";
import { AdminCard, AdminField, AdminNotice } from "@/components/admin/AdminUI";
import { formatAdminLabel } from "@/lib/admin";

export function OrderPaymentCard({ order }: { order: Order }) {
  return (
    <AdminCard className="space-y-4">
      <h3 className="font-integral text-sm font-black uppercase tracking-[0.08em] text-black border-b border-black/10 pb-3">
        Payment Details
      </h3>
      
      <div className="space-y-4 pt-1">
        <AdminField label="Method">
          <div className="text-sm font-medium">{formatAdminLabel(order.payment_method)}</div>
        </AdminField>

        <AdminField label="Payment Proof">
          {!order.payment_image ? (
            <AdminNotice tone="neutral">
              No payment proof provided.
            </AdminNotice>
          ) : (
            <AdminNotice tone="warning" title="Payment Proof">
              Stored filename: <strong>{order.payment_image}</strong>
              <br />
              This file cannot be retrieved from the dashboard. Only the filename is recorded.
            </AdminNotice>
          )}
        </AdminField>
      </div>
    </AdminCard>
  );
}
