import Orders from "@/components/orders/Orders";
import OrdersList from "@/components/orders/OrdersList";
import { Suspense } from "react";
import CardListSkeleton from "@/components/skeleton/CardListSkeleton";

export default function OrdersPage() {
  return (
    <Orders>
      <Suspense fallback={<CardListSkeleton />}>
        <OrdersList />
      </Suspense>
    </Orders>
  );
}
