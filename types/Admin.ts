import { Delivery } from "./deliveryFee";

export type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AdminCustomerType = "user" | "guest";

export interface AdminOrderFilters {
  search?: string;
  status?: string;
  paymentMethod?: string;
  customerType?: AdminCustomerType;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}

export type PromoStatusFilter =
  | "all"
  | "active"
  | "inactive"
  | "expired"
  | "exhausted";

export interface AdminPromoFilters {
  search?: string;
  status?: PromoStatusFilter;
}

export type AdminRole = "admin" | "user";

export interface AdminUserFilters {
  search?: string;
  role?: AdminRole;
  dateFrom?: string;
  dateTo?: string;
}

export interface DeleteUserAccessPayload {
  confirmRemoval: boolean;
}

export type DeliveryInput = Pick<Delivery, "city" | "delivery_fee">;

export interface AdminProductFilters {
  search?: string;
  categoryId?: number;
  isNewArrival?: boolean;
  isTopSelling?: boolean;
  showDeleted?: boolean;
}
