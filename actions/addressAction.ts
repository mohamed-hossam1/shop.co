"use server";

import { createClient } from "@/lib/supabase/server";
import { Address } from "@/types/Address";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user;
}

export async function getAddresses(): Promise<Address[]> {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Address[];
  } catch (error) {
    console.error("fetch addresses error", error);
    return [];
  }
}

export async function addAddress(data: Omit<Address, "id" | "user_id" | "is_deleted" | "created_at">) {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data: newAddress, error } = await supabase
      .from("addresses")
      .insert({
        ...data,
        user_id: user.id,
        is_deleted: false
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/profile/addresses");
    return { data: newAddress as Address, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function updateAddress(id: number, data: Partial<Omit<Address, "id" | "user_id" | "created_at">>) {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data: updated, error } = await supabase
      .from("addresses")
      .update(data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/profile/addresses");
    return { data: updated as Address, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteAddress(id: number) {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { error } = await supabase
      .from("addresses")
      .update({ is_deleted: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}