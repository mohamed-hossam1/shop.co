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

  const typedData = data as unknown as ProductData[] | null;

  const mappedData = typedData?.map((item) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    } as ProductData;
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
  const typedData = data as unknown as ProductData[] | null;

  const mappedData = typedData?.map((item) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    } as ProductData;
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
  const typedData = data as unknown as ProductData[] | null;

  const mappedData = typedData?.map((item) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    } as ProductData;
  });

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
    .maybeSingle();

  const product = data as unknown as ProductData | null;

  if (product) {
    product.category = Array.isArray(product.category) ? product.category[0] : product.category;
    const firstVariant = product.variants?.[0];
    product.price_before = firstVariant?.price_before || 0;
    product.price_after = firstVariant?.price || 0;
    product.stock = firstVariant?.stock || 0;
  }

  return { data: product, error };
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

  const typedData = data as unknown as ProductData[] | null;

  const mappedData = typedData?.map((item) => {
    const firstVariant = item.variants?.[0];
    return {
      ...item,
      price_before: firstVariant?.price_before || 0,
      price_after: firstVariant?.price || 0,
      stock: firstVariant?.stock || 0,
    } as ProductData;
  });

  return { data: mappedData, error };
}

