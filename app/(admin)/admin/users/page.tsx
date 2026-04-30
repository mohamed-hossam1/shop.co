import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getAdminUsers } from "@/actions/userAction";
import { AdminRole } from "@/types/Admin";
import UserTable from "@/components/admin/users/UserTable";
import { AdminNotice } from "@/components/admin/AdminUI";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const filters = {
    search: params.search,
    role: params.role as AdminRole,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };

  const result = await getAdminUsers(filters);

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="User Administration" 
        description="Manage user accounts, roles, and platform access."
      />
      
      {!result.success ? (
        <AdminNotice tone="danger" title="Error Loading Users">
          {result.message}
        </AdminNotice>
      ) : (
        <UserTable users={result.data} />
      )}
    </div>
  );
}
