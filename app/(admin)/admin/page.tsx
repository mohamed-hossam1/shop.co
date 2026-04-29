import Link from "next/link";
import {
  FolderTree,
  LayoutDashboard,
  Package,
  ReceiptText,
  TicketPercent,
  Truck,
  Users,
} from "lucide-react";

import { ADMIN_NAV_ITEMS } from "@/lib/admin";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";

const ICON_MAP = {
  Overview: LayoutDashboard,
  Products: Package,
  Categories: FolderTree,
  Orders: ReceiptText,
  "Promo Codes": TicketPercent,
  Delivery: Truck,
  Users: Users,
};

export default function AdminLandingPage() {
  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Admin Overview"
        description="Welcome to the administrative control center. Select a module below to manage your store's catalog, orders, and system settings."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.label as keyof typeof ICON_MAP] || LayoutDashboard;

          return (
            <Link key={item.href} href={item.href} className="group transition-transform active:scale-95">
              <AdminCard className="flex h-full flex-col justify-between transition group-hover:border-black group-hover:bg-[#f8f4ec]">
                <div className="space-y-6">
                  <div className="flex h-12 w-12 items-center justify-center border border-black bg-black text-white transition group-hover:bg-white group-hover:text-black">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-integral text-xl font-black uppercase tracking-[0.08em] text-black">
                      {item.label}
                    </h2>
                    <p className="text-sm font-medium leading-6 text-black/60">
                      Manage {item.label.toLowerCase()} and view related records.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-black/45 transition group-hover:text-black">
                  Open Module
                  <span className="text-lg">→</span>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
