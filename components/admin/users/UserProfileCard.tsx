"use client";

import { User } from "@/types/User";
import { AdminSection, AdminField } from "@/components/admin/AdminUI";
import UserRoleSelect from "@/components/admin/UserRoleSelect";
import DeleteUserAccessButton from "@/components/admin/DeleteUserAccessButton";
import { Data } from "@/lib/data";

interface UserProfileCardProps {
  user: User;
  isSelf: boolean;
}

export default function UserProfileCard({ user, isSelf }: UserProfileCardProps) {
  return (
    <div className="space-y-6">
      <AdminSection title="Account Metadata" description="Primary identification and system metadata.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField label="Full Name">
            <p className="border border-black bg-black/[0.03] px-4 py-3 text-sm font-medium text-black">
              {user.name || "N/A"}
            </p>
          </AdminField>
          <AdminField label="Email Address">
            <p className="border border-black bg-black/[0.03] px-4 py-3 text-sm font-medium text-black">
              {user.email}
            </p>
          </AdminField>
          <AdminField label="Phone Number">
            <p className="border border-black bg-black/[0.03] px-4 py-3 text-sm font-medium text-black">
              {user.phone || "N/A"}
            </p>
          </AdminField>
          <AdminField label="Registration Date">
            <p className="border border-black bg-black/[0.03] px-4 py-3 text-sm font-medium text-black">
              {user.created_at ? Data(user.created_at)["24h"] : "N/A"}
            </p>
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title="Role Management" description="Modify the administrative privileges for this account.">
        <UserRoleSelect userId={user.id} currentRole={user.role} isSelf={isSelf} />
      </AdminSection>

      <AdminSection title="Platform Access" description="Revoke authentication access for this account. This action is destructive but preserves historical records.">
        <DeleteUserAccessButton userId={user.id} disabled={isSelf} />
      </AdminSection>
    </div>
  );
}
