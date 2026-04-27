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

    return {
      success: true,
      message: "Promo code applied.",
      originalPrice: price,
      finalPrice,
      discountApplied: discountAmount,
      coupon: {
        ...coupon,
        discount_percentage: coupon.type === "percentage" ? coupon.value : undefined,
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

export async function createPromoCode(promoCodeData: Omit<PromoCode, "id" | "created_at" | "used_count">) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("coupons")
      .insert([{
        ...promoCodeData,
        used_count: 0
      }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Promo code created successfully.", data: data as PromoCode };
  } catch (error) {
    console.error("createPromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function updatePromoCode(id: number, promoCodeData: Partial<Omit<PromoCode, "id" | "created_at">>) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("coupons")
      .update(promoCodeData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Promo code updated successfully.", data: data as PromoCode };
  } catch (error) {
    console.error("updatePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function deletePromoCode(id: number) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Promo code deleted successfully." };
  } catch (error) {
    console.error("deletePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}
