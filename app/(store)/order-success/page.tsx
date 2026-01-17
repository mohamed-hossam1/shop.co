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
    `,
    )
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

  const addressInfo = order.addresses
    ? {
        name: order.addresses.phone || "N/A",
        phone: order.addresses.phone || "N/A",
        street: order.addresses.street || "N/A",
        city: order.addresses.city || "N/A",
        area: order.addresses.area || "",
        building: order.addresses.building_number || "",
      }
    : {
        name: order.guest_name || "N/A",
        phone: order.guest_phone || "N/A",
        street: order.guest_street || "N/A",
        city: order.guest_city || "N/A",
        area: order.guest_area || "",
        building: order.guest_building_number || "",
      };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-primary" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Order placed successfully
            </h1>
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-semibold">#{order.id}</span>
            </p>
          </div>

          <span className="ml-auto px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {order.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">
            Order items
          </h2>

          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0"
              >
                <div className="relative w-20 h-20 rounded-xl border overflow-hidden bg-white">
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
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-primary">
                  {item.price_at_purchase * item.quantity} EGP
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">
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
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -{order.discount_amount} EGP
                  </span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{order.total_price} EGP</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">
              Shipping address
            </h2>

            <div className="text-sm text-gray-700 space-y-1">
              {isGuest === "true" && (
                <p className="font-semibold">{addressInfo.name}</p>
              )}
              <p>{addressInfo.phone}</p>
              <p>
                {addressInfo.building} {addressInfo.street}
              </p>
              <p>
                {addressInfo.area}, {addressInfo.city}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          {isGuest !== "true" && (
            <Link
              href={ROUTES.ORDERS}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white
              bg-gradient-to-r from-[#1F1F6F] to-[#14274E]
              hover:from-[#14274E] hover:to-[#394867]"
            >
              <ShoppingBag className="w-5 h-5" />
              View orders
            </Link>
          )}

          <Link
            href={ROUTES.HOME}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold
            border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-5 h-5" />
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
