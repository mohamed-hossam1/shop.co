"use client";

import { OrderItem } from "@/types/Order";
import { AdminCard } from "@/components/admin/AdminUI";
import Image from "next/image";

export function OrderItemsTable({ items }: { items: OrderItem[] | undefined }) {
  if (!items || items.length === 0) {
    return (
      <AdminCard className="h-full flex items-center justify-center min-h-[200px]">
        <p className="text-sm font-medium text-black/60">No items found.</p>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black bg-admin-bg-alt">
            <tr>
              <th className="p-4 w-16"></th>
              <th className="p-4 font-black uppercase tracking-widest text-[11px]">
                Product
              </th>
              <th className="p-4 font-black uppercase tracking-widest text-[11px]">
                Unit Price
              </th>
              <th className="p-4 font-black uppercase tracking-widest text-[11px]">
                Qty
              </th>
              <th className="p-4 font-black uppercase tracking-widest text-[11px] text-right">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-black/2 transition-colors">
                <td className="p-4">
                  {item.product_image ? (
                    <div className="relative h-12 w-12 border border-black/10 bg-black/5 overflow-hidden">
                      <Image
                        src={item.product_image}
                        alt={item.product_title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 border border-black/10 bg-black/5 flex items-center justify-center">
                      <span className="text-[10px] font-black text-black/30">
                        N/A
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-medium text-black">
                    {item.product_title}
                  </div>
                  <div className="text-xs text-black/60 mt-1 flex items-center gap-2">
                    {item.variant_color && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full border border-black/20"
                          style={{ backgroundColor: item.variant_color }}
                        />
                        {item.variant_color}
                      </span>
                    )}
                    {item.variant_size && (
                      <span className="inline-block border border-black/20 px-1 bg-black/5">
                        {item.variant_size}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-black/70 font-medium">
                  EGP {Number(item.price_at_purchase).toFixed(2)}
                </td>
                <td className="p-4 text-black/70">{item.quantity}</td>
                <td className="p-4 text-right font-medium">
                  EGP{" "}
                  {(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
