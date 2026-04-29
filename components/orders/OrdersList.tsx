import { getUserOrders } from "@/actions/ordersAction";
import OrderCard from "./OrderCard";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default async function OrdersList() {
  const orders = (await getUserOrders()) || [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-black border-dashed">
        <p className="text-black/50 uppercase tracking-widest text-sm font-bold mb-6">
          No orders found yet
        </p>
        <Link 
          href={ROUTES.PRODUCTS}
          className="px-8 py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black border border-black transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}
