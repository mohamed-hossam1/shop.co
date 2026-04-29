import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getAdminOrderById } from "@/actions/ordersAction";
import ROUTES from "@/constants/routes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrderDetail } from "@/components/admin/orders/OrderDetail";

export const metadata = {
  title: "Admin - Order Detail",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  const response = await getAdminOrderById(orderId);

  if (!response.success || !response.data) {
    notFound();
  }

  const order = response.data;

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title={`Order #${order.id}`}
        description={`View details, items, and payment for Order #${order.id}.`}
        actions={
          <Link 
            href={ROUTES.ADMIN_ORDERS} 
            className="inline-flex border border-black bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black/5"
          >
            Back to Orders
          </Link>
        }
      />
      <OrderDetail order={order} />
    </div>
  );
}
