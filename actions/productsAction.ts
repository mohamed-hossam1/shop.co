"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductData } from "@/types/Product";

export async function getAllProduct() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      image_cover,
      new_arrival,
      top_selling,
      category:categories ( id, title, image ),
      variants:product_variants ( price, price_before, stock )
    `)
    .eq("is_deleted", false)
    .order("category_id", { ascending: true });

  const mappedData = data?.map((item: any) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    };
  });

  return { data: mappedData, error };
}

export async function getNewArrivals(limit: number = 4) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(`
      id,
      title,
      image_cover,
      new_arrival,
      top_selling,
      category:categories ( id, title, image ),
      variants:product_variants ( price, price_before, stock )
    `)
    .eq("is_deleted", false)
    .eq("new_arrival", true)
    .order("created_at", { ascending: false });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  const mappedData = data?.map((item: any) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    };
  });

  return { data: mappedData, error };
}

export async function getTopSelling(limit: number = 4) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(`
      id,
      title,
      image_cover,
      new_arrival,
      top_selling,
      category:categories ( id, title, image ),
      variants:product_variants ( price, price_before, stock )
    `)
    .eq("is_deleted", false)
    .eq("top_selling", true);

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  const mappedData = data?.map((item: any) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    };
  });

  // Sort by price manually if needed or by some other metric
  return { data: mappedData, error };
}

export async function getProductDetails(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories ( id, title, image ),
      variants:product_variants ( * ),
      images:product_images ( * )
    `)
    .eq("id", id)
    .single();

  if (data) {
    data.category = Array.isArray(data.category) ? data.category[0] : data.category;
    const firstVariant = data.variants?.[0];
    data.price_before = firstVariant?.price_before || 0;
    data.price_after = firstVariant?.price || 0;
    data.stock = firstVariant?.stock || 0;
  }

  return { data, error };
}

export async function getRelatedProducts(
  categoryId: number,
  productId: number,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      image_cover,
      variants:product_variants ( price, price_before, stock )
    `)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .limit(4);

  const mappedData = data?.map((item: any) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    };
  });

  return { data: mappedData, error };
}
