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

export async function getAddresses(): Promise<{ success: true; data: Address[] } | { success: false; message: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return { success: true, data: data as Address[] };
  } catch (error: any) {
    console.error("fetch addresses error:", error);
    return { success: false, message: error.message || "Failed to fetch addresses" };
  }
}

export async function addAddress(data: Omit<Address, "id" | "user_id">): Promise<{ success: true; data: Address } | { success: false; message: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data: newAddress, error } = await supabase
      .from("addresses")
      .insert({
        ...data,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/profile/addresses");
    return { success: true, data: newAddress as Address };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to add address" };
  }
}

export async function updateAddress(id: number, data: Partial<Omit<Address, "id" | "user_id">>): Promise<{ success: true; data: Address } | { success: false; message: string }> {
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
    return { success: true, data: updated as Address };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update address" };
  }
}

export async function deleteAddress(id: number): Promise<{ success: true; message: string } | { success: false; message: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    revalidatePath("/profile/addresses");
    return { success: true, message: "Address deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete address" };
  }
}