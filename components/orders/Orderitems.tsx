import { getOrderItems } from "@/actions/ordersAction";
import OrderDetails from "./OrderDetails";
import { Order } from "@/types/Order";

export default async function Orderitems({ order }: { order: Order }) {
  const items = (await getOrderItems(order.id)) || [];
  if (!items) return <></>;
  return (
    <div>
      <div className="flex flex-wrap gap-4">

        {items.map((item) => (
          <div key={item.id}>
            <div
              key={item.id}
              className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2"
            >
              <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700">{item.product_title}</span>
              <span className="text-xs text-gray-500">×{item.quantity}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4  border-gray-100">
        <OrderDetails order={order} items={items} />
      </div>
    </div>
  );
}
