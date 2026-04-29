"use client";

import { Order } from "@/types/Order";
import { AdminCard, AdminField } from "@/components/admin/AdminUI";

export function OrderAddressCard({ order }: { order: Order }) {
  return (
    <AdminCard className="space-y-4">
      <h3 className="font-integral text-sm font-black uppercase tracking-[0.08em] text-black border-b border-black/10 pb-3">
        Delivery Address
      </h3>
      
      <div className="space-y-4 pt-1">
        <AdminField label="Full Name">
          <div className="text-sm font-medium">{order.user_name || "—"}</div>
        </AdminField>

        <AdminField label="Phone">
          <div className="text-sm font-medium text-black/60">N/A</div>
        </AdminField>

        <AdminField label="City">
          <div className="text-sm font-medium">{order.city || "—"}</div>
        </AdminField>

        <AdminField label="Area">
          <div className="text-sm font-medium">{order.area || "—"}</div>
        </AdminField>

        <AdminField label="Address Line">
          <div className="text-sm font-medium">{order.address_line || "—"}</div>
        </AdminField>

        <AdminField label="Notes">
          <div className="text-sm font-medium">{order.notes || "—"}</div>
        </AdminField>
      </div>
    </AdminCard>
  );
}
