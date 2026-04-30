import { AdminPageHeader } from "@/components/admin/AdminUI";
import { PromoCodeForm } from "@/components/admin/promo-codes/PromoCodeForm";

export default function NewPromoCodePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Promo Code"
        description="Create a new promotional discount rule."
        backHref="/admin/promo-codes"
      />

      <div className="rounded-xl border border-neutral-100 bg-white p-6 md:p-8">
        <PromoCodeForm />
      </div>
    </div>
  );
}
