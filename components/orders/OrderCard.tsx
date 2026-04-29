import Orderitems from "./Orderitems";
import { Data } from "@/lib/data";
import { Order } from "@/types/Order";
import { Package, Calendar, Tag } from "lucide-react";

export default function OrderCard({ order }: { order: Order }) {
  const statusColors = {
    pending: "bg-orange-500",
    processing: "bg-blue-500",
    shipped: "bg-black",
    delivered: "bg-green-600",
    cancelled: "bg-red-600",
  };

  const currentStatus = order.status?.toLowerCase() as keyof typeof statusColors;

  return (
    <div className="border border-black bg-white group hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-black pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 mb-1">
                Order Reference
              </p>
              <h3 className="text-xl font-black font-integral tracking-wider text-black">
                #{order.id}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Date
              </span>
              <p className="text-sm font-bold text-black uppercase tracking-wide">
                {Data(order?.created_at?.toString())?.["12h"]}
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 mb-1 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Total
              </span>
              <p className="text-sm font-black text-black">
                {order.total_price.toFixed(0)} EGP
              </p>
            </div>

            <div className="sm:ml-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-black bg-white">
                <div className={`w-2 h-2 rounded-full ${statusColors[currentStatus] || "bg-gray-400"}`} />
                <span className="text-xs font-black uppercase tracking-widest text-black">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Orderitems order={order} />
        </div>
      </div>
    </div>
  );
}
