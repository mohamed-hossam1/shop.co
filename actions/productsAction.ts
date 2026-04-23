"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllProduct() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      price_before,
      price_after,
      image_cover,
      stock,
      new_arrival,
      top_selling,
      categories ( title, image, id )
    `,
    )
    .eq("is_deleted", false)
    .order("category_id", { ascending: true });

  const mappedData = data?.map((item) => ({
    ...item,
    categories: Array.isArray(item.categories)
      ? item.categories[0]
      : item.categories,
  }));

  return { data: mappedData };
}

export async function getNewArrivals(limit: number = 4) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `
      id,
      title,
      price_before,
      price_after,
      image_cover,
      stock,
      new_arrival,
      top_selling,
      categories ( title, image, id )
    `,
    )
    .eq("is_deleted", false)
    .eq("new_arrival", true)
    .order("created_at", { ascending: false });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  const mappedData = data?.map((item) => ({
    ...item,
    categories: Array.isArray(item.categories)
      ? item.categories[0]
      : item.categories,
  }));

  return { data: mappedData, error };
}

export async function getTopSelling(limit: number = 4) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `
      id,
      title,
      price_before,
      price_after,
      image_cover,
      stock,
      new_arrival,
      top_selling,
      categories ( title, image, id )
    `,
    )
    .eq("is_deleted", false)
    .eq("top_selling", true)
    .order("price_after", { ascending: false });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  const mappedData = data?.map((item) => ({
    ...item,
    categories: Array.isArray(item.categories)
      ? item.categories[0]
      : item.categories,
  }));

  return { data: mappedData, error };
}

export async function getProductDetails(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories ( title, image, id )
    `,
    )
    .eq("id", id)
    .single();

  if (data) {
    data.categories = Array.isArray(data.categories)
      ? data.categories[0]
      : data.categories;
  }

  return { data, error };
}

export async function getRelatedProducts(
  categoryId: number,
  prodactId: number,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *
    `,
    )
    .eq("category_id", categoryId)
    .neq("id", prodactId);
  return { data, error };
}
