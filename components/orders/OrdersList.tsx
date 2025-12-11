import { getUserOrders } from "@/app/actions/ordersAction";
import OrderCard from "./OrderCard";

export default async function OrdersList() {
  const orders = (await getUserOrders()) || [];

  if (!orders) return <></>;
  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}
