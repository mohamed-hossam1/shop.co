"use client";

import { Order } from "@/types/Order";
import { AdminSection, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminUI";
import { formatAdminLabel, getStatusTone } from "@/lib/admin";
import { Data } from "@/lib/data";
import Link from "next/link";
import ROUTES from "@/constants/routes";

interface UserOrdersTableProps {
  orders: Order[];
}

export default function UserOrdersTable({ orders }: UserOrdersTableProps) {
  return (
    <AdminSection title="Order History" description="Historical commerce records for this account.">
      {orders.length === 0 ? (
        <AdminEmptyState
          title="No Orders"
          description="This user has not placed any orders yet."
        />
      ) : (
        <div className="overflow-x-auto border border-black bg-white mt-4">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black bg-admin-bg-alt">
              <tr>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Order ID</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Date</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Status</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Total</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="p-4 font-medium text-black/60">#{order.id}</td>
                  <td className="p-4 text-black/70">
                    {Data(order.created_at)["12h"]}
                  </td>
                  <td className="p-4">
                    <AdminStatusBadge 
                      label={formatAdminLabel(order.status)} 
                      tone={getStatusTone(order.status) as any} 
                    />
                  </td>
                  <td className="p-4 font-medium">
                    EGP {Number(order.total_price).toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}
                      className="inline-flex text-[11px] font-black uppercase tracking-[0.2em] text-admin-accent hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminSection>
  );
}
