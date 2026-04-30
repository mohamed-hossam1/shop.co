import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDeliverySettings } from "@/actions/deliveryAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { DeliveryTable } from "@/components/admin/delivery/DeliveryTable";

export default async function AdminDeliveryPage() {
  const res = await getDeliverySettings();
  const settings = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Delivery Settings"
        description="Manage city-to-delivery-fee mappings used at checkout."
        actions={
          <Link
            href="/admin/delivery/new"
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            <Plus className="h-4 w-4" />
            Add City
          </Link>
        }
      />

      <Suspense fallback={<div className="p-12 text-center font-bold animate-pulse">Loading delivery settings...</div>}>
        <DeliveryTable initialData={settings} />
      </Suspense>
    </div>
  );
}
