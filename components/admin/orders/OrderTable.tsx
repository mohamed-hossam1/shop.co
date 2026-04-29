"use client";

import { Order } from "@/types/Order";
import { AdminOrderFilters } from "@/types/Admin";
import { AdminEmptyState, AdminStatusBadge } from "@/components/admin/AdminUI";
import { formatAdminLabel, getStatusTone } from "@/lib/admin";
import { Data } from "@/lib/data";
import Link from "next/link";
import { OrderFilterBar } from "./OrderFilterBar";
import ROUTES from "@/constants/routes";

export function OrderTable({ 
  orders, 
}: { 
  orders: Order[];
  filters?: AdminOrderFilters;
}) {
  return (
    <div className="space-y-4">
      <OrderFilterBar />
      
      {orders.length === 0 ? (
        <AdminEmptyState
          title="No Orders Found"
          description="Try adjusting your filters or search query to find what you're looking for."
        />
      ) : (
        <div className="overflow-x-auto border border-black bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black bg-admin-bg-alt">
              <tr>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">#</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Customer</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Date</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Status</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Total</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Payment</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="p-4 font-medium text-black/60">{order.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium max-w-[150px] truncate" title={order.user_name}>
                        {order.user_name}
                      </span>
                      {order.user_id === null && (
                        <AdminStatusBadge label="(Guest)" tone="neutral" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-black/70">
                    {Data(order.created_at || new Date().toISOString())["12h"]}
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
                  <td className="p-4 text-black/70">
                    {formatAdminLabel(order.payment_method)}
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
          {orders.length >= 100 && (
             <div className="p-4 text-center text-xs font-medium text-black/50 border-t border-black/10 bg-admin-bg-alt">
               Showing maximum results. Narrow your search if you cannot find an order.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
