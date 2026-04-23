"use server";

import { createClient } from "@/lib/supabase/server";
import { PromoCode } from "@/types/PromoCode";

export async function validatePromoCode(promoCode: string, price: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", promoCode)
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: "Database error.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
      };
    }

    const coupon = data as PromoCode | null;

    if (!coupon) {
      return {
        success: false,
        message: "Promo code not found.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
      };
    }

    if (!coupon.is_active) {
      return {
        success: false,
        message: "Promo code is not active.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return {
        success: false,
        message: "Promo code has expired.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    if (price < coupon.min_purchase) {
      return {
        success: false,
        message: `Minimum purchase is ${coupon.min_purchase}.`,
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    if (coupon.used_count >= coupon.max_uses) {
      return {
        success: false,
        message: "Promo code usage limit reached.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      const pct = Math.max(0, Math.min(100, coupon.value));
      discountAmount = (price * pct) / 100;
    } else {
      discountAmount = Math.min(price, coupon.value);
    }

    const finalPrice = Math.round((price - discountAmount) * 100) / 100;

    const { data: updateData, error: updateError } = await supabase
      .from("coupons")
      .update({ used_count: coupon.used_count + 1 })
      .eq("id", coupon.id)
      .lt("used_count", coupon.max_uses)
      .select()
      .maybeSingle();

    if (updateError || !updateData) {
      return {
        success: false,
        message: "Error applying promo code or usage limit reached.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    return {
      success: true,
      message: "Promo code applied.",
      originalPrice: price,
      finalPrice,
      discountApplied: discountAmount,
      coupon: {
        ...updateData,
        discount_percentage: updateData.type === "percentage" ? updateData.value : undefined,
      } as PromoCode,
    };
  } catch (error) {
    console.error("validatePromoCode unexpected error", error);
    return {
      success: false,
      message: "Unexpected error.",
      originalPrice: price,
      finalPrice: null,
      discountApplied: null,
    };
  }
}
