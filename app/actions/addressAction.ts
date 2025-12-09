"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAddresses() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user) {
    return [];
  }

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }

  return addresses as Address[];
}

export async function addAddress(addressData: Omit<Address, "id" | "user_id" | "created_at">) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user) {
    return { data: null, error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      ...addressData,
      user_id: user.user.id,
    })
    .select()
    .single();

  return { data, error };
}

export async function deleteAddress(addressId: number) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.user.id);

  return { error };
}