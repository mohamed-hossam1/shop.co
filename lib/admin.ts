import ROUTES from "@/constants/routes";
import { AdminOrderStatus, AdminRole } from "@/types/Admin";
import {
  FolderTree,
  LayoutDashboard,
  Package,
  ReceiptText,
  TicketPercent,
  Truck,
  Users,
} from "lucide-react";

export const ADMIN_ORDER_STATUSES: AdminOrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export const ADMIN_ROLES: AdminRole[] = ["admin", "user"];

export const ADMIN_NAV_ITEMS = [
  { href: ROUTES.ADMIN, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.ADMIN_PRODUCTS, label: "Products", icon: Package },
  { href: ROUTES.ADMIN_CATEGORIES, label: "Categories", icon: FolderTree },
  { href: ROUTES.ADMIN_ORDERS, label: "Orders", icon: ReceiptText },
  { href: ROUTES.ADMIN_PROMO_CODES, label: "Promo Codes", icon: TicketPercent },
  { href: ROUTES.ADMIN_DELIVERY, label: "Delivery", icon: Truck },
  { href: ROUTES.ADMIN_USERS, label: "Users", icon: Users },
] as const;

export function isAdminOrderStatus(status: string): status is AdminOrderStatus {
  return ADMIN_ORDER_STATUSES.includes(status as AdminOrderStatus);
}

export function formatAdminLabel(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getStatusTone(status: string) {
  switch (status) {
    case "delivered":
      return "success";
    case "confirmed":
      return "info";
    case "shipped":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

export function getPromoStatusTone(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "expired":
      return "danger";
    case "inactive":
      return "neutral";
    case "exhausted":
      return "warning";
    default:
      return "neutral";
  }
}

export function getRoleTone(role: string) {
  return role === "admin" ? "info" : "neutral";
}
