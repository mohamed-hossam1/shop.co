"use server";

import { createClient } from "@/lib/supabase/server";

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

    if (
      typeof coupon.min_purchase === "number" &&
      price < coupon.min_purchase
    ) {
      return {
        success: false,
        message: `Minimum purchase is ${coupon.min_purchase}.`,
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    if (
      typeof coupon.max_uses === "number" &&
      coupon.used_count >= coupon.max_uses
    ) {
      return {
        success: false,
        message: "Promo code usage limit reached.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    const pct = Math.max(0, Math.min(100, coupon.discount_percentage || 0));
    const discountAmount = (price * pct) / 100;
    const finalPrice = Math.round((price - discountAmount) * 100) / 100;

    let updateQuery = supabase
      .from("coupons")
      .update({ used_count: coupon.used_count + 1 })
      .eq("id", coupon.id);

    if (typeof coupon.max_uses === "number") {
      updateQuery = updateQuery.lt("used_count", coupon.max_uses);
    }

    const { data: updateData, error: updateError } = await updateQuery
      .select()
      .maybeSingle();

    if (updateError) {
      return {
        success: false,
        message: "Error applying promo code.",
        originalPrice: price,
        finalPrice: null,
        discountApplied: null,
        coupon,
      };
    }

    if (!updateData) {
      return {
        success: false,
        message: "Promo code could not be applied.",
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
      discountApplied: pct,
      coupon: { ...coupon, used_count: coupon.used_count + 1 },
    };
  } catch (error) {
    return {
      success: false,
      message: "Unexpected error.",
      originalPrice: price,
      finalPrice: null,
      discountApplied: null,
    };
  }
}
