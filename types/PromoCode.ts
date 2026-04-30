export interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  used_count: number;
  max_uses: number | null;
  min_purchase: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  discount_percentage?: number;
}
export type PromoCode = Coupon;
