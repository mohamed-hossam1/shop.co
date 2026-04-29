"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateUserRole } from "@/actions/userAction";
import { adminSelectClassName } from "@/components/admin/AdminUI";
import { ADMIN_ROLES } from "@/lib/admin";

export default function UserRoleSelect({
  userId,
  currentRole,
  isSelf = false,
}: {
  userId: string;
  currentRole: string;
  isSelf?: boolean;
}) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(() => {
      void (async () => {
        const result = await updateUserRole(userId, role === "admin" ? "admin" : "user");
        setMessage(result.success ? "Saved." : result.message);
        if (result.success) {
          router.refresh();
        }
      })();
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          disabled={isPending}
          className={adminSelectClassName}
        >
          {ADMIN_ROLES.map((value) => (
            <option key={value} value={value} disabled={isSelf && value !== "admin"}>
              {value}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || role === currentRole}
          className="border border-black bg-black px-4 py-3 text-[11px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving" : "Save"}
        </button>
      </div>
      {message ? (
        <p className="text-xs font-medium text-black/55">{message}</p>
      ) : null}
    </div>
  );
}
