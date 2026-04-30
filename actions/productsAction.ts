"use server";

import { verifyAdmin } from "./userAction";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidateCatalogPaths } from "@/lib/admin/revalidate";
import { createClient } from "@/lib/supabase/server";
import { AdminProductFilters } from "@/types/Admin";
import {
  AdminProductListItem,
  CreateProductInput,
  ProductDetails,
  ProductListItem,
} from "@/types/Product";

export async function getProducts({
  search,
  isTopSelling,
  isNewArrival,
  categoryId,
  showDeleted,
}: AdminProductFilters = {}): Promise<
  | { success: true; data: AdminProductListItem[] }
  | { success: false; message: string }
> {
  const supabase = await createClient();

  let query = supabase
    .from("products_with_min_price")
    .select("*, variants:product_variants(stock)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (isTopSelling) {
    query = query.not("top_selling_rank", "is", null).order("top_selling_rank", { ascending: true });
  }

  if (isNewArrival) {
    query = query.not("new_arrival_rank", "is", null).order("new_arrival_rank", { ascending: true });
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (!showDeleted) {
    query = query.eq("is_deleted", false);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: "Failed to fetch products" };
  }

  return { success: true, data: data as AdminProductListItem[] };
}


export async function getProductById(
  id: number,
): Promise<
  { success: true; data: ProductDetails } | { success: false; message: string }
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants (*),
      images:product_images (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return { success: false, message: "Product not found" };
  }

  return { success: true, data: data as ProductDetails };
}

export async function getNewArrivals(
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("*")
    .not("new_arrival_rank", "is", null)
    .order("new_arrival_rank", { ascending: true })
    .limit(limit);

  if (error) {
    return { success: false, message: "Failed to fetch new arrivals" };
  }

  return { success: true, data: data as ProductListItem[] };
}

export async function getTopSelling(
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("*")
    .not("top_selling_rank", "is", null)
    .order("top_selling_rank", { ascending: true })
    .limit(limit);

  if (error) {
    return { success: false, message: "Failed to fetch top selling" };
  }

  return { success: true, data: data as ProductListItem[] };
}

export async function getRelatedProducts(
  categoryId: number,
  productId: number,
  limit = 4,
): Promise<
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string }
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products_with_min_price")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", productId)
    .limit(limit);

  if (error) {
    return { success: false, message: "Failed to fetch related products" };
  }

  return { success: true, data: data as ProductListItem[] };
}

export async function createProduct(
  input: CreateProductInput,
): Promise<
  { success: true; data: { id: number } } | { success: false; message: string }
> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  if (!input.title) {
    return { success: false, message: "Title is required" };
  }

  if (!input.variants?.length) {
    return { success: false, message: "At least one variant is required" };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      title: input.title,
      description: input.description,
      category_id: input.category_id,
      image_cover: input.image_cover,
      new_arrival_rank: input.new_arrival_rank ?? null,
      top_selling_rank: input.top_selling_rank ?? null,
      category_rank: input.category_rank ?? null,
      is_deleted: false,
    })
    .select("id")
    .single();

  if (productError || !product) {
    return { success: false, message: "Failed to create product" };
  }

  const variants = input.variants.map((v) => ({
    ...v,
    product_id: product.id,
  }));

  const { error: variantsError } = await supabase
    .from("product_variants")
    .insert(variants);

  if (variantsError) {
    return { success: false, message: "Failed to create variants" };
  }

  if (input.images?.length) {
    const images = input.images.map((url) => ({
      product_id: product.id,
      url,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(images);

    if (imagesError) {
      return { success: false, message: "Failed to create images" };
    }
  }

  revalidateCatalogPaths(product.id);
  return {
    success: true,
    data: { id: product.id },
  };
}

export async function updateFullProduct(
  id: number,
  input: CreateProductInput,
): Promise<{ success: true } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  const { error } = await supabase.rpc("update_full_product", {
    p_id: id,
    p_title: input.title,
    p_description: input.description ?? null,
    p_category_id: input.category_id ?? null,
    p_image_cover: input.image_cover ?? null,
    p_variants: input.variants,
    p_images: input.images,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const { error: rankError } = await supabase
    .from("products")
    .update({
      new_arrival_rank: input.new_arrival_rank ?? null,
      top_selling_rank: input.top_selling_rank ?? null,
      category_rank: input.category_rank ?? null,
    })
    .eq("id", id);

  if (rankError) {
    return { success: false, message: rankError.message };
  }

  revalidateCatalogPaths(id);
  return { success: true };
}

export async function deleteProduct(
  id: number,
): Promise<{ success: true } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidateCatalogPaths(id);
  return { success: true };
}
