"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllProduct() {
  const supabase = await createClient()
  const {data, error} = await supabase
    .from("products")
    .select(`
      id,
      title,
      price_before,
      price_after,
      image_cover,
      stock,
      categories ( title, image, id )
    `)
    .eq("is_deleted", false)
    .order('category_id', { ascending: true }) 
  
  return {data} 
}

export async function getProductDetails(id:string) {
  const supabase = await createClient()
  const {data, error} = await supabase.from("products").select(`
      *,
      categories ( title, image, id )
    `).eq("id", id).single()
  return {data,error}
}


export async function getRelatedProducts(categoryId:number, prodactId:number) {
  const supabase = await createClient()
  const {data, error} = await supabase.from("products").select(`
      *
    `).eq("category_id", categoryId).neq("id", prodactId)
  return {data,error}
}