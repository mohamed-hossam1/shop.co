"use client";

import { User } from "@/types/User";
import { AdminEmptyState, AdminStatusBadge } from "@/components/admin/AdminUI";
import { formatAdminLabel, getRoleTone } from "@/lib/admin";
import { Data } from "@/lib/data";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import UserFilterBar from "./UserFilterBar";

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="space-y-4">
      <UserFilterBar />
      
      {users.length === 0 ? (
        <AdminEmptyState
          title="No Users Found"
          description="Try adjusting your filters or search query to find the user accounts you're looking for."
        />
      ) : (
        <div className="overflow-x-auto border border-black bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black bg-admin-bg-alt">
              <tr>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Name</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Email</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Phone</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Role</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px]">Joined</th>
                <th className="p-4 font-black uppercase tracking-[0.1em] text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="p-4 font-medium text-black">{user.name || "Unnamed"}</td>
                  <td className="p-4 text-black/70">{user.email}</td>
                  <td className="p-4 text-black/70">{user.phone || "N/A"}</td>
                  <td className="p-4">
                    <AdminStatusBadge 
                      label={formatAdminLabel(user.role)} 
                      tone={getRoleTone(user.role) as any} 
                    />
                  </td>
                  <td className="p-4 text-black/70">
                    {user.created_at ? Data(user.created_at)["12h"] : "N/A"}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`${ROUTES.ADMIN_USERS}/${user.id}`}
                      className="inline-flex text-[11px] font-black uppercase tracking-[0.2em] text-admin-accent hover:underline"
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
