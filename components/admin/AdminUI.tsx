import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type NoticeTone = "neutral" | "info" | "success" | "warning" | "danger";

const noticeToneClasses: Record<NoticeTone, string> = {
  neutral: "border-black/10 bg-white text-black",
  info: "border-sky-200 bg-sky-50 text-sky-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  danger: "border-red-200 bg-red-50 text-red-950",
};

export const adminInputClassName =
  "w-full border border-black bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/35 focus:outline-none";

export const adminTextareaClassName = cn(adminInputClassName, "min-h-[140px] resize-y");
export const adminSelectClassName = cn(adminInputClassName, "appearance-none");
export const adminCheckboxClassName =
  "h-4 w-4 border border-black bg-white accent-black";

export function AdminPageHeader({
  title,
  description,
  actions,
  backHref,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="flex flex-col gap-6 border border-black bg-white p-6 sm:p-8">
      {backHref && (
        <Link
          href={backHref}
          className="group inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-black/55 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Link>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-black/45">
            Admin Console
          </p>
          <div className="space-y-2">
            <h1 className="font-integral text-3xl font-black uppercase tracking-[0.08em] text-black sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-6 text-black/65 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("border border-black bg-white p-6", className)}>{children}</div>;
}

export function AdminMetricCard({
  label,
  value,
  meta,
}: {
  label: string;
  value: string | number;
  meta?: string;
}) {
  return (
    <AdminCard className="space-y-3">
      <p className="text-[11px] font-black uppercase tracking-[0.32em] text-black/45">
        {label}
      </p>
      <p className="font-integral text-3xl font-black uppercase tracking-[0.08em] text-black">
        {value}
      </p>
      {meta ? (
        <p className="text-sm font-medium leading-6 text-black/60">{meta}</p>
      ) : null}
    </AdminCard>
  );
}

export function AdminSection({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AdminCard className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-integral text-xl font-black uppercase tracking-[0.08em] text-black">
            {title}
          </h2>
          {description ? (
            <p className="max-w-3xl text-sm font-medium leading-6 text-black/60">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </AdminCard>
  );
}

export function AdminField({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
          {label}
        </span>
        {hint ? <span className="text-xs font-medium text-black/40">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
    </label>
  );
}

export function AdminNotice({
  title,
  tone = "neutral",
  children,
}: {
  title?: string;
  tone?: NoticeTone;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border p-4", noticeToneClasses[tone])}>
      {title ? (
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.28em]">
          {title}
        </p>
      ) : null}
      <div className="text-sm font-medium leading-6">{children}</div>
    </div>
  );
}

export function AdminStatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: NoticeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em]",
        noticeToneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="border border-dashed border-black/35 bg-black/[0.02] px-6 py-12 text-center">
      <p className="font-integral text-2xl font-black uppercase tracking-[0.1em] text-black">
        {title}
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-black/60">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex border border-black bg-black px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
