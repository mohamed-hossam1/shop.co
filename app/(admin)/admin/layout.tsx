import { getCurrentUserProfile, isAdminRole } from "@/lib/auth/admin";
import AdminChrome from "@/components/admin/AdminChrome";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserProfile();

  if (!user || !isAdminRole(user.role)) {
    return <AdminAccessDenied userName={user?.name} />;
  }

  return <AdminChrome currentUser={user}>{children}</AdminChrome>;
}
