import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types/Product";

// -- Fetch Operations --
export async function getAllCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  return { data: data as Category[] | null, error };
}

export async function getCategoryById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { data: data as Category | null, error };
}

// -- Write Operations --
export async function createCategory(categoryData: Omit<Category, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select()
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Category created successfully.", data: data as Category };
}

export async function updateCategory(id: number, categoryData: Partial<Omit<Category, "id" | "created_at">>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Category updated successfully.", data: data as Category };
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Category deleted successfully." };
}