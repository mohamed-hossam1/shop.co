"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { revalidateDeliveryPaths } from "@/lib/admin/revalidate";
import { createClient } from "@/lib/supabase/server";
import { DeliveryInput } from "@/types/Admin";
import { Delivery } from "@/types/deliveryFee";

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

export async function getDeliverySettings(): Promise<
  { success: true; data: Delivery[] } | { success: false; message: string }
> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("delivery")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as Delivery[] };
}

export async function getDeliverySettingById(id: number): Promise<
  { success: true; data: Delivery } | { success: false; message: string }
> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("delivery")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return { success: false, message: "Delivery setting not found" };
  }

  return { success: true, data: data as Delivery };
}

export async function createDeliverySetting(
  input: DeliveryInput,
): Promise<{ success: true; data: Delivery } | { success: false; message: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const city = input.city.trim();
  if (!city) {
    return { success: false, message: "City is required." };
  }

  if (input.delivery_fee <= 0) {
    return { success: false, message: "Delivery fee must be a positive number." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("delivery")
    .select("id")
    .ilike("city", city)
    .maybeSingle();

  if (existing) {
    return { success: false, message: "City already exists." };
  }

  const { data, error } = await supabase
    .from("delivery")
    .insert({ city, delivery_fee: input.delivery_fee })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateDeliveryPaths();
  return { success: true, data: data as Delivery };
}

export async function updateDeliverySetting(
  id: number,
  input: DeliveryInput,
): Promise<{ success: true; data: Delivery } | { success: false; message: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const city = input.city.trim();
  if (!city) {
    return { success: false, message: "City is required." };
  }

  if (input.delivery_fee <= 0) {
    return { success: false, message: "Delivery fee must be a positive number." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("delivery")
    .select("id")
    .ilike("city", city)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { success: false, message: "Another city with this name already exists." };
  }

  const { data, error } = await supabase
    .from("delivery")
    .update({ city, delivery_fee: input.delivery_fee })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateDeliveryPaths();
  return { success: true, data: data as Delivery };
}

export async function deleteDeliverySetting(
  id: number,
): Promise<{ success: true; message: string } | { success: false; message: string }> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("delivery").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateDeliveryPaths();
  return { success: true, message: "Delivery setting deleted successfully." };
}
