"use server";

import { createClient } from "@/lib/supabase/server";
import { Cart, CartItem } from "@/types/Cart";
import { ProductData, ProductVariant } from "@/types/Product";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Unauthorized");
  return user;
}

function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }
}

interface CartItemRow {
  id: number;
  cart_id: string;
  variant_id: number;
  quantity: number;
}

async function getOrCreateCartId(supabase: any, userId: string): Promise<string> {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cart) return cart.id;

  const { data: newCart, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw new Error("Failed to create cart");
  return newCart.id;
}

async function loadVariant(supabase: any, variantId: number): Promise<ProductVariant> {
  const { data, error } = await supabase
    .from("product_variants")
    .select("id, product_id, color, size, price, price_before, stock, sku, created_at")
    .eq("id", variantId)
    .single();

  if (error || !data) throw new Error("Variant not found");
  return data as ProductVariant;
}

async function loadCartItemWithOwnership(
  supabase: any,
  itemId: number,
  userId: string
): Promise<CartItemRow> {
  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("id, cart_id, variant_id, quantity")
    .eq("id", itemId)
    .single();

  if (itemError || !item) throw new Error("Cart item not found");

  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("user_id")
    .eq("id", item.cart_id)
    .single();

  if (cartError || !cart || cart.user_id !== userId) {
    throw new Error("Forbidden");
  }

  return item as CartItemRow;
}

async function buildCart(supabase: any, cartId: string): Promise<Cart> {
  const { data: items, error: itemsError } = await supabase
    .from("cart_items")
    .select("id, cart_id, variant_id, quantity")
    .eq("cart_id", cartId);

  if (itemsError || !items || (items as CartItemRow[]).length === 0) {
    return { id: cartId, items: [], subtotal: 0, itemCount: 0 };
  }

  const typedItems = items as CartItemRow[];
  const variantIds = typedItems.map((i) => i.variant_id);
  
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, color, size, price, price_before, stock, sku, created_at")
    .in("id", variantIds);

  if (variantsError || !variants) throw new Error("Variant load failed");

  const typedVariants = variants as ProductVariant[];
  const productIds = Array.from(new Set(typedVariants.map((v) => v.product_id)));
  
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, title, description, category_id, image_cover, is_deleted, new_arrival, top_selling, created_at")
    .in("id", productIds);

  if (productsError || !products) throw new Error("Product load failed");

  const typedProducts = products as ProductData[];
  const productMap = new Map(typedProducts.map((p) => [p.id, p]));
  const variantMap = new Map(typedVariants.map((v) => [v.id, v]));

  const cartItems: CartItem[] = typedItems.map((item) => {
    const variant = variantMap.get(item.variant_id);
    if (!variant) throw new Error("Data integrity error: Variant missing");

    const product = productMap.get(variant.product_id);
    if (!product) throw new Error("Data integrity error: Product missing");

    const lineTotal = variant.price * item.quantity;

    return {
      id: item.id,
      cart_id: item.cart_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      lineTotal,
      variant: {
        ...variant,
        product,
      },
    };
  });

  const subtotal = cartItems.reduce((acc, i) => acc + (i.lineTotal || 0), 0);
  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return { 
    id: cartId, 
    items: cartItems, 
    subtotal, 
    itemCount 
  };
}

export async function getCart(): Promise<Cart | null> {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!cart) return null;

    return await buildCart(supabase, cart.id);
  } catch (error) {
    console.error("getCart error", error);
    return null;
  }
}

export async function addToCart(variantId: number, quantity: number) {
  try {
    validateQuantity(quantity);

    const supabase = await createClient();
    const user = await getAuthUser();
    const cartId = await getOrCreateCartId(supabase, user.id);

    const variant = await loadVariant(supabase, variantId);

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("variant_id", variantId)
      .maybeSingle();

    if (existingItem) {
      const typedExisting = existingItem as CartItemRow;
      const newQty = typedExisting.quantity + quantity;

      if (newQty > variant.stock) {
        throw new Error(`Not enough stock. Available: ${variant.stock}`);
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", typedExisting.id);
      
      if (error) throw error;
    } else {
      if (quantity > variant.stock) {
        throw new Error(`Not enough stock. Available: ${variant.stock}`);
      }

      const { error } = await supabase
        .from("cart_items")
        .insert({ 
          cart_id: cartId, 
          variant_id: variantId, 
          quantity 
        });
        
      if (error) throw error;
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    console.error("addToCart error", error);
    return { success: false, error: error.message };
  }
}

export async function updateCartItemQuantity(
  itemId: number,
  quantity: number
) {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    validateQuantity(quantity);

    const item = await loadCartItemWithOwnership(
      supabase,
      itemId,
      user.id
    );

    const variant = await loadVariant(supabase, item.variant_id);

    if (quantity > variant.stock) {
      throw new Error(`Not enough stock. Available: ${variant.stock}`);
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (error) throw error;

    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    console.error("updateCartItemQuantity error", error);
    return { success: false, error: error.message };
  }
}

export async function removeFromCart(itemId: number) {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();

    await loadCartItemWithOwnership(supabase, itemId, user.id);

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: (error as any).message };
  }
}

export async function clearCart() {
  try {
    const supabase = await createClient();
    const user = await getAuthUser();
    
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cart) {
      await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("clearCart error", error);
    return { success: false };
  }
}