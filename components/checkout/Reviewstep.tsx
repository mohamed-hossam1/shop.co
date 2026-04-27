"use client";

import Image from "next/image";
import { MapPin, CreditCard, Package, User } from "lucide-react";
import { CartState } from "@/types/Cart";
import { Address } from "@/types/Address";

interface ReviewStepProps {
  cart: CartState;
  selectedAddress: Address | null;
  guestAddress: {
    name: string;
    phone: string;
    city: string;
    area: string;
    street: string;
    building_number: string;
  } | null;
  selectedPayment: string | null;
  vodafoneFile: File | null;
  instapayFile: File | null;
  isGuest: boolean;
}

export default function ReviewStep({
  cart,
  selectedAddress,
  guestAddress,
  selectedPayment,
  vodafoneFile,
  instapayFile,
  isGuest,
}: ReviewStepProps) {
  const cartItems = Object.values(cart);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-7">Review Your Order</h2>

      {isGuest && guestAddress && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Contact Information</h3>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-gray-900">{guestAddress.name}</p>
            <p className="text-sm text-gray-700">{guestAddress.phone}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Order Items ({cartItems.length})</h3>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll">
          {cartItems.map((item) => (
            <div
              key={item.variant.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg flex-shrink-0">
                <Image
                  src={item.variant.product.image_cover}
                  alt={item.variant.product.title}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate text-sm md:text-base">
                  {item.variant.product.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  {item.variant.product.category?.title}
                </p>
                <div className="flex flex-wrap gap-x-2 text-[10px] md:text-xs text-gray-500 mt-0.5">
                  <span className="capitalize">Size: {item.variant.size}</span>
                  <div className="flex items-center gap-1">
                    <span className="capitalize">Color:</span>
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.variant.color }}
                      title={item.variant.color}
                    />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary text-sm md:text-base">
                  EGP {(item.variant.product.price_after * item.quantity).toFixed(2)}
                </p>
                <p className="text-[10px] md:text-xs text-gray-400">
                  EGP {item.variant.price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Delivery Address</h3>
        </div>

        {isGuest && guestAddress ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-gray-900">{guestAddress.phone}</p>
            <p className="text-sm text-gray-700 mt-1">
              {guestAddress.building_number} {guestAddress.street}
            </p>
            <p className="text-sm text-gray-700">
              {guestAddress.area}, {guestAddress.city}
            </p>
          </div>
        ) : selectedAddress ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-gray-900">{selectedAddress.phone}</p>
            <p className="text-sm text-gray-700 mt-1">
              {selectedAddress.building_number} {selectedAddress.street}
            </p>
            <p className="text-sm text-gray-700">
              {selectedAddress.area}, {selectedAddress.city}
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-sm">⚠️ No address selected</p>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Payment Method</h3>
        </div>

        {selectedPayment ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-medium text-gray-900 capitalize">
              {selectedPayment}
            </p>

            {selectedPayment.toLowerCase() === "vodafone cash" && vodafoneFile && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Payment Receipt:</p>
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(vodafoneFile)}
                    alt="Vodafone Receipt"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{vodafoneFile.name}</p>
              </div>
            )}

            {selectedPayment.toLowerCase() === "instapay" && instapayFile && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Payment Receipt:</p>
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(instapayFile)}
                    alt="Instapay Receipt"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {selectedPayment.toLowerCase() === "cash" && (
              <p className="text-sm text-gray-600 mt-2">
                💵 Pay when you receive your order
              </p>
            )}
          </div>
        ) : (
          <p className="text-red-500 text-sm">⚠️ No payment method selected</p>
        )}
      </div>
    </div>
  );
}