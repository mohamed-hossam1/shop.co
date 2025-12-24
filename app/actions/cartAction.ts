"use server";

import { createClient } from "@/lib/supabase/server";
import { ProductData } from "@/types/Product";

interface CartItem {
  quantity: number;
  products: ProductData;
}

async function checkStock(
  productId: number,
  requestedQuantity: number
): Promise<{ available: boolean; currentStock: number; error: string | null }> {
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (error || !product) {
    return {
      available: false,
      currentStock: 0,
      error: "Product not found or database error.",
    };
  }

  if (requestedQuantity > product.stock) {
    return {
      available: false,
      currentStock: product.stock,
      error: `Insufficient stock. Only ${product.stock} available.`,
    };
  }

  return { available: true, currentStock: product.stock, error: null };
}

export async function getCartSupa() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (user?.user) {
    const { data: cart, error } = await supabase
      .from("cart_items")
      .select(
        `quantity, products(id, title, price_before, price_after, image_cover, stock, categories(title, id) )`
      )
      .eq("user_id", user?.user.id);

    if (error) {
      console.error("Error fetching cart:", error);
      return null;
    }

    return cart as unknown as CartItem[];
  }
  return null;
}

export async function updateCartSupa(productId: number, quantity: number) {
  const stockCheck = await checkStock(productId, quantity);
  if (!stockCheck.available) {
    return { cart: null, error: stockCheck.error };
  }

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data: cart, error } = await supabase
      .from("cart_items")
      .update({ quantity: quantity })
      .eq("user_id", user.user.id)
      .eq("product_id", productId)
      .select(
        `quantity, products(id, title, price_before, price_after, image_cover, stock, categories(title) )`
      );

    if (error) {
      console.error("Error updating cart:", error);
      return { cart: null, error: error.message };
    }
    return { cart: cart, error: null };
  }
  return { cart: null, error: "User not authenticated" };
}

export async function addToCartSupa(productId: number, quantity: number) {
  const stockCheck = await checkStock(productId, quantity);
  if (!stockCheck.available) {
    return { cart: null, error: stockCheck.error };
  }

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data: cart, error } = await supabase
      .from("cart_items")
      .insert({
        quantity: quantity,
        product_id: productId,
        user_id: user.user.id,
      })
      .select(
        `quantity, products(id, title, price_before, price_after, image_cover, stock, categories(title) )`
      );

    if (error) {
      console.error("Error adding to cart:", error);
      return { cart: null, error: error.message };
    }
    return { cart: cart, error: null };
  }
  return { cart: null, error: "User not authenticated" };
}

export async function removeFromCartSupa(productId: number) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data: cart, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.user.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from cart:", error);
      return null;
    }
    return cart;
  }
  return null;
}

export async function clearCartSupa() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data: cart, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error clearing cart:", error);
      return null;
    }
    return cart;
  }
  return null;
}
