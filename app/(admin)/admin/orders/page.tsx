import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getAdminOrders } from "@/actions/ordersAction";
import { AdminOrderFilters } from "@/types/Admin";
import { OrderTable } from "@/components/admin/orders/OrderTable";

export const metadata = {
  title: "Admin - Orders",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const filters: AdminOrderFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    paymentMethod: typeof params.paymentMethod === "string" ? params.paymentMethod : undefined,
    customerType: params.customerType === "guest" || params.customerType === "user"
      ? params.customerType : undefined,
    dateFrom: typeof params.dateFrom === "string" ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === "string" ? params.dateTo : undefined,
  };

  const response = await getAdminOrders(filters);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch orders");
  }

  const orders = response.data;

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Orders" 
        description="Manage all customer and guest orders, review fulfillment details, and update order statuses."
      />
      <OrderTable orders={orders || []} filters={filters} />
    </div>
  );
}
