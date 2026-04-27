import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import ROUTES from "@/constants/routes";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Successful | Cura",
  description:
    "Your order has been placed successfully. Track your order and view details.",
  robots: {
    index: false,
    follow: false,
  },
};

async function getOrderDetails(orderId: string, isGuest: boolean) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    return { ...order, items: [] };
  }

  return { ...order, items: items || [] };
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; isGuest?: string }>;
}) {
  const { orderId, isGuest } = await searchParams;

  if (!orderId) {
    redirect(ROUTES.HOME);
  }

  const order = await getOrderDetails(orderId, isGuest === "true");

  if (!order) {
    redirect(ROUTES.HOME);
  }

  let phone = "N/A";
  if (order.user_id) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: userData } = await supabase
      .from("users")
      .select("phone")
      .eq("id", order.user_id)
      .single();
    if (userData?.phone) {
      phone = userData.phone;
    }
  }

  const addressInfo = {
    name: order.user_name || "N/A",
    phone: phone,
    address_line: order.address_line || "N/A",
    city: order.city || "N/A",
    area: order.area || "",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-black p-6 sm:p-8 flex items-center gap-4">
          <div className="w-14 h-14 border border-black bg-black flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-integral font-black tracking-wider uppercase text-black">
              Order placed successfully
            </h1>
            <p className="text-sm font-medium text-gray-800 mt-1">
              Order ID: <span className="font-bold">#{order.id}</span>
            </p>
          </div>

          <span className="ml-auto px-4 py-1.5 border border-black text-xs font-bold tracking-widest uppercase text-black">
            {order.status}
          </span>
        </div>

        <div className="bg-white border border-black p-6 sm:p-8">
          <h2 className="font-integral font-bold text-lg text-black mb-6 uppercase tracking-wider border-b border-black pb-3">
            Order items
          </h2>

          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-black/10 last:border-b-0 pb-4 last:pb-0"
              >
                <div className="relative w-20 h-20 border border-black rounded-sm overflow-hidden bg-white">
                  <Image
                    fill
                    src={item.product_image}
                    alt={item.product_title}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.product_title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: item.variant_color }}
                      title={item.variant_color}
                    />
                    <span className="text-xs text-gray-500 font-bold tracking-wider uppercase">
                      | {item.variant_size}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-black border border-black px-2 py-1 text-sm">
                  {item.price_at_purchase * item.quantity} EGP
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-black p-6 sm:p-8">
            <h2 className="font-integral font-bold text-lg text-black mb-6 uppercase tracking-wider border-b border-black pb-3">
              Order summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{order.subtotal} EGP</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {order.delivery_fee > 0
                    ? `${order.delivery_fee} EGP`
                    : "Free"}
                </span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-black font-bold">
                  <span>Discount</span>
                  <span className="font-medium bg-black text-white px-2 py-0.5 text-xs">
                    -{order.discount_amount} EGP
                  </span>
                </div>
              )}

              <div className="border-t border-black pt-4 flex justify-between text-base font-black uppercase tracking-wider">
                <span>Total</span>
                <span className="text-black">{order.total_price} EGP</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black p-6 sm:p-8">
            <h2 className="font-integral font-bold text-lg text-black mb-6 uppercase tracking-wider border-b border-black pb-3">
              Shipping address
            </h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">{addressInfo.name}</p>
              <p>{addressInfo.phone}</p>
              <p>{addressInfo.address_line}</p>
              <p>
                {addressInfo.area}, {addressInfo.city}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-4">
          {isGuest !== "true" && (
            <Link
              href={ROUTES.ORDERS}
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-black border border-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              View orders
            </Link>
          )}

          <Link
            href={ROUTES.HOME}
            className="flex items-center justify-center gap-2 px-8 py-4 font-bold bg-white text-black border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
          >
            <Home className="w-5 h-5" />
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
