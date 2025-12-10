"use client";

import Image from "next/image";
import { MapPin, CreditCard, Package } from "lucide-react";

interface ReviewStepProps {
  cart: CartState;
  selectedAddress: Address | null;
  selectedPayment: string | null;
  vodafoneFile: File | null;
  instapayFile: File | null;

}

export default function ReviewStep({
  cart,
  selectedAddress,
  selectedPayment,
  vodafoneFile,
  instapayFile,
}: ReviewStepProps) {
  const cartItems = Object.values(cart);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-7">Review Your Order</h2>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Order Items ({cartItems.length})</h3>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll">
          {cartItems.map((item) => (
            <div
              key={item.products.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg flex-shrink-0">
                <Image
                  src={item.products.image_cover}
                  alt={item.products.title}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate text-sm md:text-base">
                  {item.products.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  {item.products.categories.title}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary text-sm md:text-base">
                  EGP {(item.products.price_after * item.quantity).toFixed(2)}
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

        {selectedAddress ? (
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