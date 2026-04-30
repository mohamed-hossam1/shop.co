import { notFound } from "next/navigation";
import { getDeliverySettingById } from "@/actions/deliveryAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { DeliveryForm } from "@/components/admin/delivery/DeliveryForm";

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const res = await getDeliverySettingById(numericId);

  if (!res.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Delivery Setting"
        description={`Editing delivery fee for: ${res.data.city}`}
        backHref="/admin/delivery"
      />

      <div className="rounded-xl border border-neutral-100 bg-white p-6 md:p-8">
        <DeliveryForm initialData={res.data} />
      </div>
    </div>
  );
}
