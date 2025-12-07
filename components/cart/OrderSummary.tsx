"use client";

import { getPromo } from "@/app/actions/promoCodeAction";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSummary({
  price,
  isCart,
  deliveryFee,
}: {
  price: number;
  isCart: boolean;
  deliveryFee: number;
}) {
  const [currentPrice, setCurrentPrice] = useState(price);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<promoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    try {
      const savedPromo = localStorage.getItem("promoCode");
      const savedAppliedPromo = localStorage.getItem("appliedPromo");

      if (savedPromo) {
        const code = JSON.parse(savedPromo);
        setPromoCode(code);
      }

      if (savedAppliedPromo) {
        const promo = JSON.parse(savedAppliedPromo);
        setAppliedPromo(promo);
      }
    } catch (e) {
      localStorage.removeItem("promoCode");
      localStorage.removeItem("appliedPromo");
    }
  }, []);

  useEffect(() => {
    if (appliedPromo) {
      const discount = (price * appliedPromo.discount_percentage) / 100;
      setCurrentPrice(price - discount);
    } else {
      setCurrentPrice(price);
    }
  }, [price, appliedPromo]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplying(true);
    setPromoError("");

    try {
      const { data, error } = await getPromo(promoCode.trim());

      if (error || !data || data.length === 0) {
        setPromoError("Invalid promo code");
        setAppliedPromo(null);
        localStorage.removeItem("appliedPromo");
        return;
      }

      const promo = data[0] as promoCode;

      if (!promo.is_active) {
        setPromoError("This promo code is not active");
        setAppliedPromo(null);
        localStorage.removeItem("appliedPromo");
        return;
      }

      if (promo.used_count >= promo.max_uses) {
        setPromoError("This promo code has reached its usage limit");
        setAppliedPromo(null);
        localStorage.removeItem("appliedPromo");
        return;
      }

      if (price < promo.min_purchase) {
        setPromoError(`Minimum purchase amount is EGP ${promo.min_purchase}`);
        setAppliedPromo(null);
        localStorage.removeItem("appliedPromo");
        return;
      }

      setPromoError("");
      setAppliedPromo(promo);
      localStorage.setItem("promoCode", JSON.stringify(promoCode));
      localStorage.setItem("appliedPromo", JSON.stringify(promo));
    } catch (err) {
      setPromoError("Error applying promo code. Please try again.");
      setAppliedPromo(null);
      localStorage.removeItem("appliedPromo");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
    localStorage.removeItem("promoCode");
    localStorage.removeItem("appliedPromo");
  };

  return (
    <div className="w-full lg:flex-[2]">
      <div className="bg-white rounded-lg md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 lg:sticky lg:top-24">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>
        {isCart ? (
          <>
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Promo Code
              </label>
              <div className="space-y-2">
                <div className="flex flex-row gap-2">
                  <input
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full disabled:bg-gray-50 disabled:cursor-not-allowed"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isApplying || !!appliedPromo}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                  />
                  {appliedPromo ? (
                    <button
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs md:text-sm whitespace-nowrap"
                      onClick={handleRemovePromo}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      disabled={!promoCode.trim() || isApplying}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm whitespace-nowrap"
                      onClick={handleApplyPromo}
                    >
                      {isApplying ? (
                        <div className="h-6 w-6 border-b-2 border-primary rounded-full animate-spin"></div>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {promoError}
                  </p>
                )}
                {appliedPromo && (
                  <p className="text-green-600 text-xs md:text-sm flex items-center gap-1 font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {appliedPromo.discount_percentage}% discount applied!
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm md:text-base">Subtotal</span>
            <span className="font-semibold text-sm md:text-base">
              EGP {price.toFixed(2)}
            </span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-green-600">
              <span className="text-sm md:text-base">
                Discount ({appliedPromo.discount_percentage}%)
              </span>
              <span className="font-semibold text-sm md:text-base">
                -EGP{" "}
                {((price * appliedPromo.discount_percentage) / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm md:text-base">
              Delivery Fee
            </span>
            <span className="font-semibold text-sm md:text-base">
              {deliveryFee == 0 ? <>On Checkout</> : <>{deliveryFee}</>}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 md:pt-3">
            <div className="flex justify-between">
              <span className="text-base md:text-lg font-semibold">Total</span>
              <span className="text-base md:text-lg font-bold text-primary">
                EGP {(currentPrice + deliveryFee).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        {isCart && (
          <>
            {price ? (
              <Link
                className="block w-full bg-gradient-to-r from-primary to-[#14274E] text-white py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl mb-3 md:mb-4 text-center text-sm md:text-base"
                href="/checkout"
              >
                Proceed to Checkout
              </Link>
            ):<></>}
            <Link
              className="block w-full border py-3  text-center rounded-lg md:rounded-xl text-gray-600 hover:text-primary transition-colors text-sm hover:bg-gray-200 transition-all duration-300 md:text-base"
              href={ROUTES.HOME}
            >
              Continue Shopping
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
