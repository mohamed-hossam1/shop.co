"use server";

import { verifyAdmin } from "./userAction";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePromoPaths } from "@/lib/admin/revalidate";
import { createClient } from "@/lib/supabase/server";
import { AdminPromoFilters } from "@/types/Admin";
import { PromoCode } from "@/types/PromoCode";

export async function getPromoCodes(filters: AdminPromoFilters = {}): Promise<
  { success: true; data: PromoCode[] } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();
  const { search, status = "all" } = filters;

  try {
    let query = supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("code", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, message: error.message };
    }

    const now = new Date();
    const filtered = (data as PromoCode[]).filter((promo) => {
      const isExpired = promo.expires_at ? new Date(promo.expires_at) < now : false;
      const isExhausted = promo.max_uses !== null && promo.used_count >= promo.max_uses;

      switch (status) {
        case "active":
          return promo.is_active && !isExpired && !isExhausted;
        case "inactive":
          return !promo.is_active;
        case "expired":
          return isExpired;
        case "exhausted":
          return isExhausted;
        default:
          return true;
      }
    });

    return { success: true, data: filtered };
  } catch (error: any) {
    return { success: false, message: error.message || "Unexpected error." };
  }
}

export async function getPromoCodeById(id: number): Promise<
  { success: true; data: PromoCode } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data) {
      return { success: false, message: "Promo code not found" };
    }

    return { success: true, data: data as PromoCode };
  } catch (error: any) {
    return { success: false, message: error.message || "Unexpected error." };
  }
}

export async function validatePromoCode(promoCode: string, price: number): Promise<{
    success: true;
    message: string;
    data: {
      originalPrice: number;
      finalPrice: number;
      discountApplied: number;
      coupon: PromoCode;
      isConditionMet: boolean;
    }
  } | {
    success: false;
    message: string;
  }> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", promoCode)
      .limit(1)
      .maybeSingle();

    if (error) {
      return { success: false, message: "Database error." };
    }

    const coupon = data as PromoCode | null;

    if (!coupon) {
      return { success: false, message: "Promo code not found." };
    }

    if (!coupon.is_active) {
      return { success: false, message: "Promo code is not active." };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
       return { success: false, message: "Promo code has expired." };
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return { success: false, message: "Promo code usage limit reached." };
    }

    const isConditionMet = price >= coupon.min_purchase;
    
    let discountAmount = 0;
    if (isConditionMet) {
      if (coupon.type === "percentage") {
        const pct = Math.max(0, Math.min(100, coupon.value));
        discountAmount = (price * pct) / 100;
      } else {
        discountAmount = Math.min(price, coupon.value);
      }
    }

    const finalPrice = Math.round((price - discountAmount) * 100) / 100;

    return {
      success: true,
      message: isConditionMet ? "Promo code applied." : `Minimum purchase of EGP ${coupon.min_purchase} required.`,
      data: {
        originalPrice: price,
        finalPrice,
        discountApplied: discountAmount,
        isConditionMet,
        coupon: {
          ...coupon,
          discount_percentage: coupon.type === "percentage" ? coupon.value : undefined,
        } as PromoCode,
      }
    };
  } catch (error: any) {
    console.error("validatePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function createPromoCode(promoCodeData: Omit<PromoCode, "id" | "created_at" | "used_count">): Promise<{ success: true; message: string; data: PromoCode } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  try {
    // Duplicate check
    const { data: existing } = await supabase
      .from("coupons")
      .select("id")
      .eq("code", promoCodeData.code)
      .maybeSingle();

    if (existing) {
      return { success: false, message: "Promo code already exists." };
    }

    const { data, error } = await supabase
      .from("coupons")
      .insert([{
        ...promoCodeData,
        expires_at: promoCodeData.expires_at || null,
        max_uses: promoCodeData.max_uses ?? null,
        used_count: 0
      }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePromoPaths();
    return { success: true, message: "Promo code created successfully.", data: data as PromoCode };
  } catch (error: any) {
    console.error("createPromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function updatePromoCode(id: number, promoCodeData: Partial<Omit<PromoCode, "id" | "created_at">>): Promise<{ success: true; message: string; data: PromoCode } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  try {
    // Duplicate check if code is changing
    if (promoCodeData.code) {
      const { data: existing } = await supabase
        .from("coupons")
        .select("id")
        .eq("code", promoCodeData.code)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        return { success: false, message: "Another promo code with this name already exists." };
      }
    }

    const { data, error } = await supabase
      .from("coupons")
      .update({
        ...promoCodeData,
        expires_at: promoCodeData.expires_at === undefined ? undefined : (promoCodeData.expires_at || null),
        max_uses: promoCodeData.max_uses === undefined ? undefined : (promoCodeData.max_uses ?? null),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePromoPaths();
    return { success: true, message: "Promo code updated successfully.", data: data as PromoCode };
  } catch (error: any) {
    console.error("updatePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}

export async function deletePromoCode(id: number): Promise<{ success: true; message: string } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePromoPaths();
    return { success: true, message: "Promo code deleted successfully." };
  } catch (error: any) {
    console.error("deletePromoCode unexpected error", error);
    return { success: false, message: "Unexpected error." };
  }
}
