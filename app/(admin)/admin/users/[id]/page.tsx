import { notFound } from "next/navigation";
import { AdminPageHeader, AdminNotice } from "@/components/admin/AdminUI";
import { getAdminUserById, GetUser } from "@/actions/userAction";
import { getAdminOrders } from "@/actions/ordersAction";
import ROUTES from "@/constants/routes";
import UserProfileCard from "@/components/admin/users/UserProfileCard";
import UserOrdersTable from "@/components/admin/users/UserOrdersTable";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Load data in parallel
  const [userResult, ordersResult, currentUserResult] = await Promise.all([
    getAdminUserById(id),
    getAdminOrders({ userId: id }),
    GetUser(),
  ]);

  if (!userResult.success) {
    if (userResult.message === "User not found") {
      notFound();
    }
    return (
      <AdminNotice tone="danger" title="Error Loading User">
        {userResult.message}
      </AdminNotice>
    );
  }

  const user = userResult.data;
  const orders = ordersResult.success ? ordersResult.data : [];
  const isSelf = currentUserResult.success && currentUserResult.data.id === id;

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="User Detail" 
        description={`Managing account for ${user.name || user.email}`}
        backHref={ROUTES.ADMIN_USERS}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <UserProfileCard user={user} isSelf={isSelf} />
        </div>
        <div className="lg:col-span-2">
          <UserOrdersTable orders={orders} />
        </div>
      </div>
    </div>
  );
}
