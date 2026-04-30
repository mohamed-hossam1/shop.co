import { notFound } from "next/navigation";
import { getPromoCodeById } from "@/actions/promoCodeAction";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { PromoCodeForm } from "@/components/admin/promo-codes/PromoCodeForm";

export default async function EditPromoCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const res = await getPromoCodeById(numericId);

  if (!res.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Promo Code"
        description={`Editing promo code: ${res.data.code}`}
        backHref="/admin/promo-codes"
      />

      <div className="rounded-xl border border-neutral-100 bg-white p-6 md:p-8">
        <PromoCodeForm initialData={res.data} />
      </div>
    </div>
  );
}
