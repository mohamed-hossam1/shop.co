"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteUserAccess } from "@/actions/userAction";
import ROUTES from "@/constants/routes";

export default function DeleteUserAccessButton({
  userId,
  disabled = false,
}: {
  userId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("Remove this user's sign-in access? Historical order records will remain in the database.")) {
      return;
    }

    startTransition(() => {
      void (async () => {
        const result = await deleteUserAccess(userId);
        setMessage(result.success ? "Access removed." : result.message);
        if (result.success) {
          router.push(ROUTES.ADMIN_USERS);
          router.refresh();
        }
      })();
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={disabled || isPending}
        className="border border-red-600 bg-red-600 px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Removing" : "Remove Access"}
      </button>
      {message ? <p className="text-xs font-medium text-black/55">{message}</p> : null}
    </div>
  );
}
