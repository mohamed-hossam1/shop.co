"use server";

import { verifyAdmin } from "./userAction";
import { requireAdmin } from "@/lib/auth/admin";
import { ADMIN_ORDER_STATUSES, isAdminOrderStatus } from "@/lib/admin";
import { revalidateOrderPaths } from "@/lib/admin/revalidate";
import { createClient } from "@/lib/supabase/server";
import { AdminOrderFilters } from "@/types/Admin";
import { CreateOrderData, Order } from "@/types/Order";
import { cookies } from "next/headers";

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function getCurrentOrderScope() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const guestId = cookieStore.get("guest-id")?.value;

  return {
    supabase,
    userId: user?.id,
    guestId,
  };
}

export async function createOrder(
  orderData: CreateOrderData,
  cartItems: any[]
): Promise<{ success: true; data: Order } | { success: false; message: string }> {
  const supabase = await createClient();

  try {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { success: false, message: "Your cart is empty." };
    }

    const variantIds = cartItems
      .map((item) => item?.variant?.id)
      .filter((id): id is number => typeof id === "number");

    if (variantIds.length !== cartItems.length) {
      return { success: false, message: "Invalid cart items submitted." };
    }

    const { data: liveVariants, error: liveVariantError } = await supabase
      .from("product_variants")
      .select(`
        id,
        price,
        stock,
        color,
        size,
        product:products (
          id,
          title,
          image_cover,
          is_deleted
        )
      `)
      .in("id", variantIds);

    if (liveVariantError || !liveVariants || liveVariants.length !== variantIds.length) {
      return { success: false, message: "Some products in your cart are no longer available." };
    }

    const variantMap = new Map(
      liveVariants.map((variant: any) => [variant.id, variant]),
    );

    let serverSubtotal = 0;
    for (const item of cartItems) {
      const liveVariant = variantMap.get(item.variant.id);
      const quantity = Number(item.quantity);

      if (!liveVariant || !Number.isFinite(quantity) || quantity <= 0) {
        return { success: false, message: "Invalid cart quantity submitted." };
      }

      if (liveVariant.product?.is_deleted) {
        return { success: false, message: `${liveVariant.product.title} is no longer available.` };
      }

      if (quantity > liveVariant.stock) {
        return {
          success: false,
          message: `Only ${liveVariant.stock} item(s) available for ${liveVariant.product?.title || "this product"}.`,
        };
      }

      serverSubtotal += liveVariant.price * quantity;
    }

    serverSubtotal = roundCurrency(serverSubtotal);

    const { data: deliveryRow } = await supabase
      .from("delivery")
      .select("delivery_fee")
      .eq("city", orderData.city)
      .maybeSingle();

    if (!deliveryRow) {
      return { success: false, message: "Delivery city is no longer available." };
    }

    const serverDeliveryFee = deliveryRow?.delivery_fee ?? 0;

    if (roundCurrency(orderData.delivery_fee) !== roundCurrency(serverDeliveryFee)) {
      return { success: false, message: "Delivery fee changed. Please review your checkout totals." };
    }

    let serverDiscountAmount = 0;
    let liveCouponUsedCount: number | null = null;

    if (orderData.coupon_id) {
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .eq("id", orderData.coupon_id)
        .maybeSingle();

      if (couponError || !coupon) {
        return { success: false, message: "Promo code is no longer valid." };
      }

      if (!coupon.is_active) {
        return { success: false, message: "Promo code is not active." };
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { success: false, message: "Promo code has expired." };
      }

      if (coupon.used_count >= coupon.max_uses) {
        return { success: false, message: "Promo code usage limit reached." };
      }

      if (serverSubtotal < coupon.min_purchase) {
        return {
          success: false,
          message: `Minimum purchase of EGP ${coupon.min_purchase} is required for this promo code.`,
        };
      }

      liveCouponUsedCount = coupon.used_count;

      if (coupon.type === "percentage") {
        const pct = Math.max(0, Math.min(100, coupon.value));
        serverDiscountAmount = (serverSubtotal * pct) / 100;
      } else {
        serverDiscountAmount = Math.min(serverSubtotal, coupon.value);
      }
    } else if (roundCurrency(orderData.discount_amount) > 0) {
      return { success: false, message: "Promo code totals changed. Please review your checkout totals." };
    }

    serverDiscountAmount = roundCurrency(serverDiscountAmount);
    const serverTotalPrice = roundCurrency(
      serverSubtotal + serverDeliveryFee - serverDiscountAmount,
    );

    if (
      roundCurrency(orderData.subtotal) !== serverSubtotal ||
      roundCurrency(orderData.discount_amount) !== serverDiscountAmount ||
      roundCurrency(orderData.total_price) !== serverTotalPrice
    ) {
      return { success: false, message: "Cart totals changed. Please review your checkout totals." };
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: orderData.user_id || null,
        guest_id: orderData.guest_id || null,
        status: orderData.status || 'pending',
        subtotal: serverSubtotal,
        discount_amount: serverDiscountAmount,
        total_price: serverTotalPrice,
        payment_method: orderData.payment_method,
        payment_image: orderData.payment_image || null,
        delivery_fee: serverDeliveryFee,
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
      price_at_purchase: variantMap.get(item.variant.id)?.price,
      product_title: variantMap.get(item.variant.id)?.product?.title,
      product_image: variantMap.get(item.variant.id)?.product?.image_cover,
      variant_color: variantMap.get(item.variant.id)?.color,
      variant_size: variantMap.get(item.variant.id)?.size
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
       console.error("Order items insertion failed:", itemsError);
       return { success: false, message: "Failed to create order items" };
    }

    // Update coupon usage if provided, increases ONLY after successful order
    if (orderData.coupon_id && liveCouponUsedCount !== null) {
      await supabase
        .from("coupons")
        .update({ used_count: liveCouponUsedCount + 1 })
        .eq("id", orderData.coupon_id);
    }

    revalidateOrderPaths(order.id);
    return { success: true, data: order as Order };

  } catch (err: any) {
    console.error("createOrder unexpected error:", err);
    return { success: false, message: err.message || "Unexpected error" };
  }
}

export async function getUserOrders(): Promise<Order[]> {
  const { supabase, userId, guestId } = await getCurrentOrderScope();

  if (!userId && !guestId) return [];

  let query = supabase.from("orders").select(`
    *,
    items:order_items (*, variant:product_variants(stock))
  `).order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("guest_id", guestId).is("user_id", null);
  }

  const { data, error } = await query;
  if (error) return [];
  return data as Order[];
}

export async function getOrderItems(orderId: number) {
  const { userId, guestId } = await getCurrentOrderScope();
  const orderRes = await getOrderById(orderId, userId, guestId);

  if (!orderRes.success) {
    return [];
  }

  return orderRes.data.items || [];
}

export async function getOrderById(
  orderId: number,
  userId?: string,
  guestId?: string
): Promise<{ success: true; data: Order } | { success: false; message: string }> {
  if (!userId && !guestId) {
    return { success: false, message: "Unauthorized" };
  }

  const supabase = await createClient();

  let query = supabase.from("orders").select(`
    *,
    items:order_items (*, variant:product_variants(stock))
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

export async function getAdminOrders(
  filters: AdminOrderFilters = {},
): Promise<{ success: true; data: Order[] } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();
  const {
    search,
    status,
    paymentMethod,
    customerType,
    dateFrom,
    dateTo,
    userId,
  } = filters;

  let query = supabase
    .from("orders")
    .select(`
      *,
      items:order_items (*, variant:product_variants(stock))
    `)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (paymentMethod) {
    query = query.eq("payment_method", paymentMethod);
  }

  if (customerType === "guest") {
    query = query.is("user_id", null);
  } else if (customerType === "user") {
    query = query.not("user_id", "is", null);
  }

  if (dateFrom) {
    query = query.gte("created_at", `${dateFrom}T00:00:00`);
  }

  if (dateTo) {
    query = query.lte("created_at", `${dateTo}T23:59:59.999`);
  }

  if (search) {
    const trimmed = search.trim();
    if (/^\d+$/.test(trimmed)) {
      query = query.or(`id.eq.${trimmed},user_name.ilike.%${trimmed}%`);
    } else {
      query = query.ilike("user_name", `%${trimmed}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as Order[] };
}

export async function getAdminOrderById(
  orderId: number,
): Promise<{ success: true; data: Order } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items (*, variant:product_variants(stock))
    `)
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return { success: false, message: "Order not found" };
  }

  return { success: true, data: data as Order };
}

export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<{ success: true; message: string } | { success: false; message: string }> {
  const verification = await verifyAdmin();
  if (!verification.success) return verification;


  if (!isAdminOrderStatus(status)) {
    return {
      success: false,
      message: `Status must be one of: ${ADMIN_ORDER_STATUSES.join(", ")}`,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { success: false, message: "Failed to update status" };
  }

  revalidateOrderPaths(orderId);
  return { success: true, message: "Order status updated" };
}
