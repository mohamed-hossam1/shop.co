export interface Coupon {
  id: number;
  code: string;
  type: string;
  value: number;
  used_count: number;
  max_uses: number;
  min_purchase: number;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  discount_percentage?: number;
}
export type PromoCode = Coupon;
