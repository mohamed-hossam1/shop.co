"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateOrderData, Order } from "@/types/Order";
import { cookies } from "next/headers";

export async function createOrder(
  orderData: CreateOrderData,
  cartItems: any[]
): Promise<{ success: true; data: Order } | { success: false; message: string }> {
  const supabase = await createClient();

  try {
    let serverSubtotal = 0;
    
    for (const item of cartItems) {
      serverSubtotal += (item.variant.price * item.quantity);
    }
    
    const serverTotalPrice = serverSubtotal + orderData.delivery_fee - orderData.discount_amount;
    
    // Insert order directly without abstractions to keep it simple and readable
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: orderData.user_id || null,
        guest_id: orderData.guest_id || null,
        status: orderData.status || 'pending',
        subtotal: serverSubtotal,
        discount_amount: orderData.discount_amount,
        total_price: serverTotalPrice,
        payment_method: orderData.payment_method,
        payment_image: orderData.payment_image || null,
        delivery_fee: orderData.delivery_fee,
        city: orderData.city,
        area: orderData.area,
        address_line: orderData.address_line,
        notes: orderData.notes || null,
        user_name: orderData.user_name
      }])
      .select()
      .single();

    if (orderError || !order) {
       console.error("Order insertion failed:", orderError);
       return { success: false, message: "Failed to create order" };
    }

    // Insert order items snapshot (data will not depend on product after order)
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      variant_id: item.variant.id,
      quantity: item.quantity,
      price_at_purchase: item.variant.price,
      product_title: item.variant.product.title,
      product_image: item.variant.product.image_cover,
      variant_color: item.variant.color,
      variant_size: item.variant.size
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
       console.error("Order items insertion failed:", itemsError);
       return { success: false, message: "Failed to create order items" };
    }

    // Update coupon usage if provided, increases ONLY after successful order
    if (orderData.coupon_id) {
       const { data: coupon } = await supabase
         .from("coupons")
         .select("used_count")
         .eq("id", orderData.coupon_id)
         .single();
         
       if (coupon) {
         await supabase
           .from("coupons")
           .update({ used_count: coupon.used_count + 1 })
           .eq("id", orderData.coupon_id);
       }
    }

    return { success: true, data: order as Order };

  } catch (err: any) {
    console.error("createOrder unexpected error:", err);
    return { success: false, message: err.message || "Unexpected error" };
  }
}

export async function getUserOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const cookieStore = await cookies();
  const guestId = cookieStore.get("guest-id")?.value;

  if (!user && !guestId) return [];

  let query = supabase.from("orders").select(`
    *,
    items:order_items (*)
  `).order("created_at", { ascending: false });

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    query = query.eq("guest_id", guestId).is("user_id", null);
  }

  const { data, error } = await query;
  if (error) return [];
  return data as Order[];
}

export async function getOrderItems(orderId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
    
  if (error) return [];
  return data;
}

export async function getOrderById(
  orderId: number,
  userId?: string,
  guestId?: string
): Promise<{ success: true; data: Order } | { success: false; message: string }> {
  const supabase = await createClient();

  let query = supabase.from("orders").select(`
    *,
    items:order_items (*)
  `).eq("id", orderId);

  if (userId) {
    query = query.eq("user_id", userId);
  } else if (guestId) {
    query = query.eq("guest_id", guestId).is("user_id", null);
  }

  const { data: order, error } = await query.single();

  if (error || !order) {
    return { success: false, message: "Order not found" };
  }

  return { success: true, data: order as Order };
}

export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<{ success: true; message: string } | { success: false; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { success: false, message: "Failed to update status" };
  }

  return { success: true, message: "Order status updated" };
}