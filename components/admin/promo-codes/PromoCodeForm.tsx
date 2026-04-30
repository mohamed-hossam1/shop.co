"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PromoCode } from "@/types/PromoCode";
import { createPromoCode, updatePromoCode } from "@/actions/promoCodeAction";
import {
  AdminField,
  AdminSection,
  AdminNotice,
  adminInputClassName,
  adminSelectClassName,
  adminCheckboxClassName,
} from "@/components/admin/AdminUI";

interface PromoCodeFormProps {
  initialData?: PromoCode;
}

export function PromoCodeForm({ initialData }: PromoCodeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form state
  const [code, setCode] = useState(initialData?.code || "");
  const [type, setType] = useState<"percentage" | "fixed">(initialData?.type || "percentage");
  const [value, setValue] = useState(initialData?.value?.toString() || "");
  const [minPurchase, setMinPurchase] = useState(initialData?.min_purchase?.toString() || "0");
  const [maxUses, setMaxUses] = useState(initialData?.max_uses?.toString() || "");
  const [expiresAt, setExpiresAt] = useState(
    initialData?.expires_at ? new Date(initialData.expires_at).toISOString().split("T")[0] : ""
  );
  const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!code.trim()) errors.code = "Required";
    if (value === "" || parseFloat(value) <= 0) errors.value = "Must be a positive number";
    if (type === "percentage" && parseFloat(value) > 100) errors.value = "Percentage cannot exceed 100%";
    if (minPurchase === "" || parseFloat(minPurchase) < 0) errors.minPurchase = "Cannot be negative";
    if (maxUses !== "" && parseInt(maxUses) < 0) errors.maxUses = "Cannot be negative";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      code: code.trim(),
      type,
      value: parseFloat(value),
      min_purchase: parseFloat(minPurchase) || 0,
      max_uses: maxUses === "" ? null : parseInt(maxUses),
      expires_at: expiresAt || null,
      is_active: isActive,
    };

    startTransition(async () => {
      const res = initialData
        ? await updatePromoCode(initialData.id, data)
        : await createPromoCode(data);

      if (res.success) {
        router.push("/admin/promo-codes");
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <AdminNotice tone="danger" title="Error">
          {error}
        </AdminNotice>
      )}

      <AdminSection title="Core Details" description="Define the code string and discount value.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <AdminField label="Promo Code" error={fieldErrors.code} hint="Unique code shoppers enter">
            <input
              type="text"
              placeholder="e.g. SUMMER2024"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={adminInputClassName}
            />
          </AdminField>

          <div className="grid grid-cols-2 gap-4">
            <AdminField label="Discount Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                className={adminSelectClassName}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (EGP)</option>
              </select>
            </AdminField>

            <AdminField label="Value" error={fieldErrors.value}>
              <input
                type="number"
                step="any"
                placeholder={type === "percentage" ? "10" : "100"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={adminInputClassName}
              />
            </AdminField>
          </div>
        </div>
      </AdminSection>

      <AdminSection title="Usage Rules" description="Control how and when this code can be used.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <AdminField label="Minimum Purchase" error={fieldErrors.minPurchase} hint="Optional (EGP)">
            <input
              type="number"
              step="any"
              placeholder="0"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Maximum Uses" error={fieldErrors.maxUses} hint="Blank for unlimited">
            <input
              type="number"
              placeholder="Unlimited"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Expiry Date" hint="Optional">
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <div className="flex items-center pt-8">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className={adminCheckboxClassName}
              />
              <span className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
                Is Active
              </span>
            </label>
          </div>
        </div>
      </AdminSection>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="inline-flex border border-black bg-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex border border-black bg-black px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black disabled:opacity-50"
        >
          {isPending ? "Saving..." : initialData ? "Update Promo Code" : "Create Promo Code"}
        </button>
      </div>
    </form>
  );
}
