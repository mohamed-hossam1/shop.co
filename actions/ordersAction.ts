"use server";

import { createClient } from "@/lib/supabase/server";
import { Order, OrderItem } from "@/types/Order";
import { revalidatePath } from "next/cache";
import { clearCart } from "./cart";

interface OrderItemInput {
  variant_id: number;
  quantity: number;
  price_at_purchase: number;
  product_title: string;
  product_image: string;
  variant_snapshot?: any;
}

interface CommonOrderData {
  subtotal: number;
  discount_amount: number;
  total_price: number;
  delivery_fee: number;
  payment_method: string;
  payment_image_file?: File;
  coupon_id?: number | null;
  guest_info?: any;
}

async function uploadOrderImage(file: File) {
  const supabase = await createClient();
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `order_${timestamp}.${fileExt}`;
    const { error } = await supabase.storage
      .from("payment")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("payment")
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Image upload failed:", error);
    return { success: false };
  }
}

async function updateStock(supabase: any, items: OrderItemInput[]) {
  for (const item of items) {
    const { data: variant, error: fetchError } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", item.variant_id)
      .single();

    if (fetchError || !variant) throw new Error(`Variant ${item.variant_id} not found`);
    if (variant.stock < item.quantity) throw new Error(`Insufficient stock for ${item.product_title}`);

    const { error: updateError } = await supabase
      .from("product_variants")
      .update({ stock: variant.stock - item.quantity })
      .eq("id", item.variant_id);

    if (updateError) throw updateError;
  }
}

async function processOrderInsertion(
  supabase: any,
  orderPayload: any,
  items: OrderItemInput[]
) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select("id")
    .single();

  if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

  const orderItemsData = items.map((item) => ({
    order_id: order.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    price_at_purchase: item.price_at_purchase,
    product_title: item.product_title,
    product_image: item.product_image,
    variant_snapshot: item.variant_snapshot || {},
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(`Order items creation failed: ${itemsError.message}`);
  }

  return order.id;
}

export async function createOrder(
  data: CommonOrderData,
  items: OrderItemInput[],
  isGuest: boolean = false
) {
  const supabase = await createClient();
  try {
    let user_id = null;
    if (!isGuest) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: "Unauthorized" };
      user_id = user.id;
    }

    if (data.coupon_id) {
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("used_count, max_uses, is_active, expires_at")
        .eq("id", data.coupon_id)
        .single();
        
      if (couponError || !coupon) {
        return { success: false, error: "Invalid coupon applied." };
      }
      
      if (!coupon.is_active) {
        return { success: false, error: "Promo code is no longer active." };
      }

      if (coupon.used_count >= coupon.max_uses) {
        return { success: false, error: "Promo code usage limit reached." };
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { success: false, error: "Promo code has expired." };
      }
    }

    await updateStock(supabase, items);

    let payment_image = null;
    if (data.payment_image_file) {
      const upload = await uploadOrderImage(data.payment_image_file);
      if (upload.success) payment_image = upload.url;
    }

    const orderPayload = {
      user_id,
      status: "pending",
      subtotal: data.subtotal,
      discount_amount: data.discount_amount,
      total_price: data.total_price,
      payment_method: data.payment_method,
      payment_image,
      delivery_fee: data.delivery_fee,
      guest_info: data.guest_info || {},
    };

    const orderId = await processOrderInsertion(supabase, orderPayload, items);

    if (data.coupon_id) {
      await supabase.rpc("increment_coupon_usage", { coupon_id: data.coupon_id });
    }

    if (user_id) {
      await clearCart();
    }

    revalidatePath("/admin/orders");
    if (user_id) revalidatePath("/profile/orders");

    return { success: true, orderId };
  } catch (error: any) {
    console.error("Order process error:", error);
    return { success: false, error: error.message || "Checkout failed" };
  }
}

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch orders error:", error);
    return [];
  }

  return data as Order[];
}

export async function getOrderItems(orderId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Fetch order items error:", error);
    return [];
  }

  return data as OrderItem[];
}

export async function updateOrderStatus(orderId: number, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/orders");
  return { success: true };
}