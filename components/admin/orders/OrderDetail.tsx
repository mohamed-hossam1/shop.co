"use client";

import { Order } from "@/types/Order";
import { AdminStatusBadge, AdminCard } from "@/components/admin/AdminUI";
import { Data } from "@/lib/data";
import { OrderItemsTable } from "./OrderItemsTable";
import { OrderAddressCard } from "./OrderAddressCard";
import { OrderPaymentCard } from "./OrderPaymentCard";
import OrderStatusSelect from "../OrderStatusSelect";

export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-white border border-black p-4 lg:p-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h2 className="font-integral text-xl font-black uppercase tracking-[0.08em] text-black">
              Order #{order.id}
            </h2>
            {order.user_id === null && (
              <AdminStatusBadge label="Guest Order" tone="neutral" />
            )}
          </div>
          <p className="text-sm font-medium text-black/60">
            Placed on {Data(order.created_at || new Date().toISOString())["12h"]}
          </p>
        </div>
        <div className="sm:w-64">
          <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-2 text-black/50">
            Order Status
          </label>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderItemsTable items={order.items} />
        </div>
        <div className="space-y-6">
          <OrderAddressCard order={order} />
          <OrderPaymentCard order={order} />
        </div>
      </div>

      <AdminCard className="lg:w-1/2 ml-auto">
        <h3 className="font-integral text-sm font-black uppercase tracking-[0.08em] text-black border-b border-black/10 pb-3 mb-4">
          Order Totals
        </h3>
        <div className="space-y-3 text-sm font-medium">
          <div className="flex justify-between text-black/70">
            <span>Subtotal</span>
            <span>EGP {Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black/70">
            <div className="flex flex-col">
              <span>Discount</span>
              <span className="text-[10px] font-black tracking-[0.05em] uppercase text-black/40 mt-1">
                Note: Original promo code string is not stored.
              </span>
            </div>
            <span>-EGP {Number(order.discount_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black/70">
            <span>Delivery Fee</span>
            <span>EGP {Number(order.delivery_fee).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-black/10 flex justify-between text-black text-base font-bold">
            <span>Grand Total</span>
            <span>EGP {Number(order.total_price).toFixed(2)}</span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
