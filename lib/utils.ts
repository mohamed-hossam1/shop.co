import ROUTES from "@/constants/routes";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatAdminLabel } from "./admin";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const relevantSegments = adminIndex >= 0 ? segments.slice(adminIndex + 1) : [];

  const breadcrumbs = [{ href: ROUTES.ADMIN, label: "Dashboard" }];
  let currentPath = ROUTES.ADMIN;

  for (const segment of relevantSegments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      href: currentPath,
      label: /^\d+$/.test(segment) ? `#${segment}` : formatAdminLabel(segment),
    });
  }

  return breadcrumbs;
}