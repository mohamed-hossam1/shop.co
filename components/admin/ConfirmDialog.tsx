"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmTone?: "danger" | "neutral";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  confirmTone = "danger",
  isPending,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-[70]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden border border-black bg-white p-8 text-left transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full max-w-lg font-satoshi"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <DialogTitle className="font-integral text-2xl font-black uppercase tracking-wider text-black">
                  {title}
                </DialogTitle>
                <div className="h-1 w-12 bg-black" />
                <p className="text-sm font-medium leading-6 text-black/60">
                  {description}
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isPending}
                  className="inline-flex items-center justify-center border border-black bg-white px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isPending}
                  className={cn(
                    "inline-flex items-center justify-center border px-6 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition disabled:opacity-50",
                    confirmTone === "danger"
                      ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                      : "border-black bg-black text-white hover:bg-white hover:text-black"
                  )}
                >
                  {isPending ? "Processing..." : confirmLabel}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
