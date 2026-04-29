"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
} from "lucide-react";

import ROUTES from "@/constants/routes";
import { ADMIN_NAV_ITEMS } from "@/lib/admin";
import { buildBreadcrumbs, cn } from "@/lib/utils";



export default function AdminChrome({
  currentUser,
  children,
}: {
  currentUser: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ee_0%,#fdfdfc_28%,#ffffff_100%)] font-satoshi text-black">
      <aside className="hidden border-r border-black bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-72">
        <div className="flex h-full flex-col">
          <div className="border-b border-black px-6 py-7">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-black/45">
              Platform Admin
            </p>
            <h1 className="mt-4 font-integral text-3xl font-black uppercase tracking-[0.1em] text-black">
              SHOP.CO
            </h1>
            <p className="mt-4 text-sm font-medium leading-6 text-black/60">
              Manage catalog, orders, promotions, delivery rules, and user access from one operational surface.
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 border px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] transition",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:border-black hover:bg-black hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-black px-6 py-6">
            <div className="border border-black/10 bg-[#f8f4ec] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/45">
                Current Session
              </p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-black">
                {currentUser.name || "Admin"}
              </p>
              <p className="mt-1 break-all text-sm font-medium text-black/60">
                {currentUser.email || "No email"}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="border border-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em]">
                  {currentUser.role || "user"}
                </span>
                <Link
                  href={ROUTES.HOME}
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-black/70 transition hover:text-black"
                >
                  <Store className="h-3.5 w-3.5" />
                  Storefront
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="border-b border-black bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-black/45">
                  Operations
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-black/70">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.href} className="flex items-center gap-2">
                      {index > 0 ? <span className="text-black/25">/</span> : null}
                      <Link
                        href={crumb.href}
                        className={cn(
                          "transition hover:text-black",
                          index === breadcrumbs.length - 1 ? "text-black" : "",
                        )}
                      >
                        {crumb.label}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 border border-black bg-[#f8f4ec] px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center border border-black bg-black font-integral text-sm font-black uppercase tracking-[0.12em] text-white">
                  {(currentUser.name || "A").slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-black">
                    {currentUser.name || "Admin"}
                  </p>
                  <p className="text-xs font-medium text-black/55">
                    {currentUser.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 border px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] transition",
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-black/20 bg-white text-black",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
