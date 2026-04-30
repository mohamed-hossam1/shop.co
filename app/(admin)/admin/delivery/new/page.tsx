import { AdminPageHeader } from "@/components/admin/AdminUI";
import { DeliveryForm } from "@/components/admin/delivery/DeliveryForm";

export default function NewDeliveryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Delivery Setting"
        description="Add a new city and its delivery fee."
        backHref="/admin/delivery"
      />

      <div className="rounded-xl border border-neutral-100 bg-white p-6 md:p-8">
        <DeliveryForm />
      </div>
    </div>
  );
}
