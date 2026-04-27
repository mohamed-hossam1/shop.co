import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types/Product";

// -- Fetch Operations --
export async function getAllCategories(): Promise<{ success: true; data: Category[] } | { success: false; message: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as Category[] };
}

export async function getCategoryById(id: number): Promise<{ success: true; data: Category } | { success: false; message: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return { success: false, message: error?.message || "Category not found" };
  }

  return { success: true, data: data as Category };
}

// -- Write Operations --
export async function createCategory(categoryData: Omit<Category, "id">): Promise<{ success: true; message: string; data: Category } | { success: false; message: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select()
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Category created successfully.", data: data as Category };
}

export async function updateCategory(id: number, categoryData: Partial<Omit<Category, "id">>): Promise<{ success: true; message: string; data: Category } | { success: false; message: string }> {
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

export async function deleteCategory(id: number): Promise<{ success: true; message: string } | { success: false; message: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Category deleted successfully." };
}
export async function getCategoryBySlug(
  slug: string,
): Promise<{ success: true; data: Category } | { success: false; message: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return { success: false, message: error?.message || "Category not found" };
  }

  return { success: true, data: data as Category };
}
