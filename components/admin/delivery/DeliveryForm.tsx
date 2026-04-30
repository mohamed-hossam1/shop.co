"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Delivery } from "@/types/deliveryFee";
import { createDeliverySetting, updateDeliverySetting } from "@/actions/deliveryAction";
import {
  AdminField,
  AdminSection,
  AdminNotice,
  adminInputClassName,
} from "@/components/admin/AdminUI";

interface DeliveryFormProps {
  initialData?: Delivery;
}

export function DeliveryForm({ initialData }: DeliveryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form state
  const [city, setCity] = useState(initialData?.city || "");
  const [deliveryFee, setDeliveryFee] = useState(initialData?.delivery_fee?.toString() || "");

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!city.trim()) errors.city = "Required";
    if (deliveryFee === "" || parseFloat(deliveryFee) <= 0) {
      errors.deliveryFee = "Must be a positive number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      city: city.trim(),
      delivery_fee: parseFloat(deliveryFee),
    };

    startTransition(async () => {
      const res = initialData
        ? await updateDeliverySetting(initialData.id, data)
        : await createDeliverySetting(data);

      if (res.success) {
        router.push("/admin/delivery");
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

      <AdminSection title="Delivery Details" description="Define the city and its associated delivery fee.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <AdminField label="City Name" error={fieldErrors.city}>
            <input
              type="text"
              placeholder="e.g. Cairo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Delivery Fee (EGP)" error={fieldErrors.deliveryFee}>
            <input
              type="number"
              step="any"
              placeholder="50"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>
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
          {isPending ? "Saving..." : initialData ? "Update Setting" : "Add City"}
        </button>
      </div>
    </form>
  );
}
