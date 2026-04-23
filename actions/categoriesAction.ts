"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllCategories() {
  const supabase = await createClient()
  const {data, error} = await supabase.from("categories").select(`
      id,
      title
    `)
  return {data,error}
}