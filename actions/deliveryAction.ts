"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDeliveryFee(city: string): Promise<{ success: true; data: number } | { success: false; message: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("delivery")
    .select("delivery_fee")
    .eq("city", city)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching delivery fee:", error);
    return { success: false, message: "Delivery fee not found" };
  }

  return { success: true, data: data.delivery_fee as number };
}