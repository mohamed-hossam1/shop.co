import { getOrderItems } from "@/actions/ordersAction";
import OrderDetails from "./OrderDetails";
import { Order } from "@/types/Order";
import Image from "next/image";

export default async function Orderitems({ order }: { order: Order }) {
  const items = (await getOrderItems(order.id)) || [];
  
  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-4 p-4 border border-black/5 bg-gray-50/50"
          >
            <div className="w-16 h-16 border border-black bg-white shrink-0 relative overflow-hidden">
              {item.product_image ? (
                <Image
                  src={item.product_image}
                  alt={item.product_title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-bold text-black/20">
                  No img
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-black truncate uppercase tracking-tight">
                {item.product_title}
              </h4>
              <p className="text-xs text-black/50 mt-1 uppercase tracking-widest font-medium">
                {item.variant_size} / {item.variant_color}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-black">
                x{item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end pt-4 border-t border-black/5">
        <OrderDetails order={order} items={items} />
      </div>
    </div>
  );
}
