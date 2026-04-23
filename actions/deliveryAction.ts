"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDeliveryFee(city: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("delivery")
    .select("delivery_fee")
    .eq("city", city)
    .single();

  if (error || !data) {
    console.error("Error fetching delivery fee:", error);
    return 0;
  }

  return data.delivery_fee;
}