"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteUserAccess } from "@/actions/userAction";
import ROUTES from "@/constants/routes";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(false);
    startTransition(() => {
      void (async () => {
        const result = await deleteUserAccess(userId, { confirmRemoval: true });
        setMessage(result.success ? "Access removed." : result.message);
        if (result.success) {
          router.push(ROUTES.ADMIN_USERS);
          router.refresh();
        }
      })();
    });
  };

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          disabled={disabled || isPending}
          className="border border-red-600 bg-red-600 px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Removing" : "Remove Access"}
        </button>
        {message ? <p className="text-xs font-medium text-black/55">{message}</p> : null}
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Remove Platform Access?"
        description="This will revoke the user's ability to sign in. All historical commerce records and order history will be preserved for administrative record-keeping."
        confirmLabel="Confirm Removal"
        confirmTone="danger"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
