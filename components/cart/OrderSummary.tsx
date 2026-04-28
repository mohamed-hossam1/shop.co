"use client";

import { validatePromoCode } from "@/actions/promoCodeAction";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/stores/cartStore";

interface OrderSummaryProps {
  price: number;
  isCart: boolean;
  deliveryFee: number;
  hasAddress?: boolean;
  isLoadingFee?: boolean;
}

export default function OrderSummary({
  price,
  isCart,
  deliveryFee,
  hasAddress = false,
  isLoadingFee = false,
}: OrderSummaryProps) {
  const { appliedPromo, setAppliedPromo } = useCart();
  const [promoCode, setPromoCode] = useState<string>(appliedPromo?.code || "");
  const [promoError, setPromoError] = useState<string>("");
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const isConditionMet = appliedPromo ? price >= appliedPromo.min_purchase : true;

  const discountAmount = appliedPromo && isConditionMet
    ? appliedPromo.type === "percentage"
      ? (price * appliedPromo.value) / 100
      : Math.min(price, appliedPromo.value)
    : 0;

  const finalPrice = Math.max(0, price - discountAmount);
  const totalWithDelivery = finalPrice + (hasAddress ? deliveryFee : 0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplying(true);
    setPromoError("");

    try {
      const result = await validatePromoCode(promoCode.trim(), price);

      if (!result || !result.success) {
        setPromoError(result?.message || "Invalid promo code");
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo(result.data?.coupon || null);
      setPromoError("");
    } catch (err) {
      setPromoError("Error applying promo code. Please try again.");
      setAppliedPromo(null);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  return (
    <div className="w-full lg:flex-2 font-satoshi">
      <div className="bg-white border border-black p-6 sm:p-8 lg:sticky lg:top-24">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-integral uppercase">
          Order Summary
        </h3>

        {isCart && (
          <div className="mb-8">
            <div className="relative group">
              <div className="flex flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <input
                    placeholder="Add promo code"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-black rounded-none focus:ring-1 focus:ring-black transition-all text-sm md:text-base outline-none disabled:opacity-50"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isApplying || !!appliedPromo}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                  />
                </div>
                {appliedPromo ? (
                  <button
                    className="px-6 py-3 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-widest text-xs md:text-sm cursor-pointer"
                    onClick={handleRemovePromo}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    disabled={!promoCode.trim() || isApplying}
                    className="px-8 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest text-xs md:text-sm cursor-pointer"
                    onClick={handleApplyPromo}
                  >
                    {isApplying ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Apply"
                    )}
                  </button>
                )}
              </div>

               {promoError && (
                <p className="text-red-500 text-xs md:text-sm mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider border border-red-500/20 p-2 bg-red-50 animate-in fade-in slide-in-from-top-1">
                   {promoError}
                </p>
              )}
              {appliedPromo && isConditionMet && (
                <p className="text-green-600 text-xs md:text-sm mt-3 flex items-center gap-1.5 font-black uppercase tracking-wider border border-green-500/20 p-2 bg-green-50 animate-in fade-in slide-in-from-top-1">
                  {appliedPromo.type === "percentage"
                    ? `${appliedPromo.value}%`
                    : `EGP ${appliedPromo.value}`}{" "}
                  discount applied
                </p>
              )}
              {appliedPromo && !isConditionMet && (
                <p className="text-red-500 text-xs md:text-sm mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider border border-red-500/20 p-2 bg-red-50 animate-in fade-in slide-in-from-top-1">
                  {`Minimum purchase of EGP ${appliedPromo.min_purchase} required.`}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-base md:text-lg">Subtotal</span>
            <span className="font-bold text-gray-900 text-base md:text-lg">
              EGP {price.toFixed(2)}
            </span>
          </div>

          {appliedPromo && isConditionMet && (
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg text-gray-500">
                Discount (
                {appliedPromo.type === "percentage"
                  ? `${appliedPromo.value}%`
                  : "Fixed"}
                )
              </span>
              <span className="font-bold text-red-500 text-base md:text-lg">
                -EGP {discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-base md:text-lg text-gray-500">
              Delivery Fee
            </span>
            <span className="font-bold text-gray-900 text-base md:text-lg">
              {isLoadingFee ? (
                <div className="h-6 w-20 bg-gray-100 animate-pulse rounded-md"></div>
              ) : isCart ? (
                <span className="text-gray-400 font-medium">
                  Calculated later
                </span>
              ) : !hasAddress ? (
                <span className="text-gray-400 font-medium">Add address</span>
              ) : (
                `EGP ${deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg md:text-xl font-bold text-gray-900 font-integral">
                Total
              </span>
               <span className="text-2xl md:text-3xl font-black text-black font-integral">
                {isLoadingFee ? (
                  <div className="h-8 w-24 bg-gray-100 animate-pulse"></div>
                ) : (
                  `EGP ${totalWithDelivery.toFixed(0)}`
                )}
              </span>
            </div>
          </div>
        </div>

        {isCart && (
          <div className="space-y-4">
            {price > 0 && (
              <Link
                className="flex items-center justify-center w-full bg-black text-white py-4 md:py-5 px-6 font-bold border border-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
                href={ROUTES.CHECKOUT}
              >
                Go to Checkout
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            )}
            <Link
              className="flex items-center justify-center w-full bg-white text-black py-4 md:py-5 px-6 font-bold border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
              href={ROUTES.HOME}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
