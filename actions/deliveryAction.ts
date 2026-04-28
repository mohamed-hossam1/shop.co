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

export async function getCities(): Promise<{ success: true; data: string[] } | { success: false; message: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("delivery")
    .select("city")
    .order("city", { ascending: true });

  if (error) {
    console.error("Error fetching cities:", error);
    return { success: false, message: "Failed to fetch cities" };
  }

  const cities = data.map((item: { city: string }) => item.city);
  return { success: true, data: cities };
}