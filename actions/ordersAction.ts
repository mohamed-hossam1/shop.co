"use server";

import { createClient } from "@/lib/supabase/server";
import { clearCartSupa } from "./cartAction";

interface CreateOrderData {
  addressId: number;
  paymentMethod: string;
  paymentImageFile?: File;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalPrice: number;
  couponId?: number;
}

interface CreateGuestOrderData {
  guestInfo: {
    name: string;
    phone: string;
    city: string;
    area: string;
    street: string;
    building_number: string;
  };
  paymentMethod: string;
  paymentImageFile?: File;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalPrice: number;
  couponId?: number;
}

interface OrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  priceAtPurchase: number;
  productImage: string;
}

async function updateProductStock(productId: number, quantity: number, supabase: any): Promise<{ success: boolean, error: string | null }> {
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (fetchError || !product) {
    return { success: false, error: `Product with ID ${productId} not found.` };
  }

  const newStock = product.stock - quantity;
  
  if (newStock < 0) {
    return { success: false, error: `Insufficient stock for product ID ${productId}. Requested: ${quantity}, Available: ${product.stock}` };
  }

  const { error: updateError, data } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId).select("*")
    
  if (updateError) {
    return { success: false, error: `Failed to update stock for product ID ${productId}: ${updateError.message}` };
  }

  return { success: true, error: null };
}

export async function createOrder(
  orderData: CreateOrderData,
  cartItems: OrderItem[]
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    for (const item of cartItems) {
      const stockResult = await updateProductStock(item.productId, item.quantity, supabase);
      if (!stockResult.success) {
        return {
          success: false,
          error: `Stock error: ${stockResult.error}`,
        };
      }
    }

    let paymentImageUrl: string | null = null;

    if (orderData.paymentImageFile) {
      const uploadResult = await uploadPaymentImage(orderData.paymentImageFile);

      if (!uploadResult.success) {
        return {
          success: false,
          error: "Failed to upload payment image",
        };
      }

      paymentImageUrl = uploadResult.url!;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        address_id: orderData.addressId,
        payment_method: orderData.paymentMethod,
        payment_image: paymentImageUrl,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        discount_amount: orderData.discountAmount,
        total_price: orderData.totalPrice,
        coupon_id: orderData.couponId || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return {
        success: false,
        error: "Failed to create order",
      };
    }

    const orderItemsData = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_title: item.productTitle,
      quantity: item.quantity,
      price_at_purchase: item.priceAtPurchase,
      product_image: item.productImage,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);

      return {
        success: false,
        error: "Failed to create order items",
      };
    }

    if (orderData.couponId) {
      await supabase.rpc("increment_coupon_usage", {
        coupon_id: orderData.couponId,
      });
    }
    
    await clearCartSupa();

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function createGuestOrder(
  orderData: CreateGuestOrderData,
  cartItems: OrderItem[]
) {
  const supabase = await createClient();

  try {
    for (const item of cartItems) {
      const stockResult = await updateProductStock(item.productId, item.quantity, supabase);
      if (!stockResult.success) {
        return {
          success: false,
          error: `Stock error: ${stockResult.error}`,
        };
      }
    }

    let paymentImageUrl: string | null = null;

    if (orderData.paymentImageFile) {
      const uploadResult = await uploadPaymentImage(orderData.paymentImageFile);

      if (!uploadResult.success) {
        return {
          success: false,
          error: "Failed to upload payment image",
        };
      }

      paymentImageUrl = uploadResult.url!;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: null, 
        guest_name: orderData.guestInfo.name,
        guest_phone: orderData.guestInfo.phone,
        guest_city: orderData.guestInfo.city,
        guest_area: orderData.guestInfo.area,
        guest_street: orderData.guestInfo.street,
        guest_building_number: orderData.guestInfo.building_number,
        payment_method: orderData.paymentMethod,
        payment_image: paymentImageUrl,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        discount_amount: orderData.discountAmount,
        total_price: orderData.totalPrice,
        coupon_id: orderData.couponId || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Guest order creation error:", orderError);
      return {
        success: false,
        error: "Failed to create order",
      };
    }

    const orderItemsData = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_title: item.productTitle,
      quantity: item.quantity,
      price_at_purchase: item.priceAtPurchase,
      product_image: item.productImage,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);

      return {
        success: false,
        error: "Failed to create order items",
      };
    }

    if (orderData.couponId) {
      await supabase.rpc("increment_coupon_usage", {
        coupon_id: orderData.couponId,
      });
    }

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Create guest order error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

async function uploadPaymentImage(file: File) {
  const supabase = await createClient();

  try {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `order_${timestamp}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("payment")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("payment").getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false };
  }
}

export async function getUserOrders() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      addresses (
        phone,
        city,
        area,
        street,
        building_number
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return orders;
}

export async function getOrderItems(orderId: number) {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching order items:", error);
    return [];
  }

  return items;
}


export async function updateOrderStatus(orderId: number, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}