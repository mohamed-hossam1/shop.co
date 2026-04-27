"use server";

import { createClient } from "@/lib/supabase/server";
import { Cart } from "@/types/Cart";

export async function getOrCreateCart(guestId?: string): Promise<
  | { success: true; data: Cart }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("carts").select("*");

  if (user) {
    query = query.eq("user_id", user.id);
  } else if (guestId) {
    query = query.eq("guest_id", guestId).is("user_id", null);
  } else {
    return { success: false, message: "No user or guest ID provided" };
  }

  const { data: existingCart } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingCart) {
    return { success: true, data: existingCart as Cart };
  }

  const { data: newCart, error } = await supabase
    .from("carts")
    .insert([
      {
        user_id: user?.id || null,
        guest_id: user ? null : guestId || null,
      },
    ])
    .select()
    .single();

  if (error || !newCart) {
    return { success: false, message: "Failed to create cart" };
  }

  return { success: true, data: newCart as Cart };
}

export async function addToCart(
  variantId: number,
  quantity: number,
  guestId?: string
): Promise<| { success: true; message: string } | { success: false; message: string }> {
  const cartRes = await getOrCreateCart(guestId);
  if (!cartRes.success) return cartRes;
  if (!cartRes.data) return { success: false, message: "Cart data not found" };

  const cartId = cartRes.data.id;
  const supabase = await createClient();

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("variant_id", variantId)
    .maybeSingle();

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existingItem.id);

    if (error) return { success: false, message: "Failed to update quantity" };
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert([{ cart_id: cartId, variant_id: variantId, quantity }]);

    if (error) return { success: false, message: "Failed to add item to cart" };
  }

  return { success: true, message: "Item added to cart" };
}

export async function getCart(guestId?: string): Promise<
  | { success: true; data: Cart }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("carts").select(
    `
      *,
      items:cart_items (
        *,
        variant:product_variants (
          *,
          product:products (id, title, image_cover)
        )
      )
    `
  );

  if (user) {
    query = query.eq("user_id", user.id);
  } else if (guestId) {
    query = query.eq("guest_id", guestId).is("user_id", null);
  } else {
    return { success: false, message: "No user or guest ID provided" };
  }

  const { data: cart, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !cart) {
    return { success: false, message: "Cart not found" };
  }

  return { success: true, data: cart as unknown as Cart };
}

export async function removeFromCart(itemId: number): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) return { success: false, message: "Failed to remove item" };
  return { success: true, message: "Item removed" };
}

export async function updateQuantity(itemId: number, quantity: number): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) return { success: false, message: "Failed to update quantity" };
  return { success: true, message: "Quantity updated" };
}

export async function clearCart(guestId?: string): Promise<
  | { success: true; message: string }
  | { success: false; message: string }
> {
  const cartRes = await getOrCreateCart(guestId);
  if (!cartRes.success) return cartRes;
  if (!cartRes.data) return { success: false, message: "Cart data not found" };

  const cartId = cartRes.data.id;
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId);

  if (error) return { success: false, message: "Failed to clear cart" };
  return { success: true, message: "Cart cleared" };
}
