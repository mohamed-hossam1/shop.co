"use client";

import ROUTES from "@/constants/routes";
import { useCart } from "@/stores/cartStore";
import Image from "next/image";
import Link from "next/link";
import OrderSummary from "./OrderSummary";
import CartSkeleton from "../skeleton/CartSkeleton";
import { useUser } from "@/stores/userStore";

export default function CartList() {
  const {
    cart,
    quantity,
    removeFromCart,
    updateQuantity,
    price,
    clearCart,
    isLoading,
    hasHydrated,
  } = useCart();

  const handleRemove = async (variantId: number) => {
    const res = await removeFromCart(variantId);
    if (res && !res.success) {
      alert(res.message || "Failed to remove item.");
    }
  };

  const handleUpdateQuantity = async (variantId: number, currentQty: number, delta: number) => {
    const res = await updateQuantity(variantId, currentQty + delta);
    if (res && !res.success) {
      alert(res.message || "Failed to update quantity.");
    }
  };

  const handleClearCart = async () => {
    const res = await clearCart();
    if (res && !res.success) {
      alert(res.message || "Failed to clear cart.");
    }
  };

  const isUserInitialized = useUser((state) => state.isInitialized);

  if (!hasHydrated || isLoading || cart === null || !isUserInitialized) {
    return <CartSkeleton />;
  }

  const cartEntries = cart ? Object.entries(cart) : [];
  const hasItems = cartEntries.length > 0;

  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10 font-satoshi">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold uppercase font-integral">Shopping Cart</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2 md:mt-3">
          {quantity} item{quantity !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-4">
          <div className="flex flex-row justify-between items-center mb-4 md:mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-bold">Cart Items</h2>
            <button
              className="text-red-500 font-bold cursor-pointer hover:text-red-700 transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
              onClick={handleClearCart}
              disabled={!hasItems}
            >
              Clear Cart
            </button>
          </div>

          {hasItems ? (
            <div className="border shadow-xl rounded-xl overflow-hidden bg-white">
              {cartEntries.map(([key, value], index) => {
                const variantId = Number(key);
                const stock = value.variant.stock || 0;
                const price_after = value.variant.price || 0;
                const isMaxQuantity = value.quantity >= stock;
                const isOutOfStock = stock === 0;

                return (
                  <div
                    key={variantId}
                    className="p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 relative bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src={value.variant.product?.image_cover || ""}
                        alt={value.variant.product.title}
                        priority={index === 0}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link
                            className="font-bold text-base md:text-lg text-gray-900 hover:text-primary transition-colors block truncate"
                            href={`/products/${value.variant.product.id}`}
                          >
                            {value.variant.product.title}
                          </Link>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs md:text-sm">
                            <p className="text-gray-600">
                              <span className="font-medium text-gray-900">Size:</span> {value.variant.size}
                            </p>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span className="font-medium text-gray-900">Color:</span>
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                style={{ backgroundColor: value.variant.color }}
                                title={value.variant.color}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
                          title="Remove item"
                          onClick={() => handleRemove(variantId)}
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5 md:w-6 md:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-between mt-4 md:mt-6 gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 space-x-4">
                            <button
                              className="text-gray-900 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={value.quantity <= 1}
                              onClick={() => handleUpdateQuantity(variantId, value.quantity, -1)}
                              aria-label="Decrease quantity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                              </svg>
                            </button>

                            <span className="font-bold text-sm md:text-base text-gray-900 w-6 text-center select-none">
                              {value.quantity}
                            </span>

                            <button
                              className="text-gray-900 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => handleUpdateQuantity(variantId, value.quantity, 1)}
                              disabled={isMaxQuantity || isOutOfStock}
                              aria-label="Increase quantity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          {(isMaxQuantity || isOutOfStock) && (
                            <p className="text-xs text-red-500 mt-2 font-medium">
                              {isOutOfStock
                                ? "Out of Stock"
                                : `Max available: ${stock}`}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg md:text-xl text-black">
                            EGP {(price_after * value.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs md:text-sm font-medium text-gray-500">
                            EGP {price_after.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border shadow-xl rounded-xl p-12 text-center bg-white">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-900 text-xl font-bold mb-2">Your cart is empty</p>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href={ROUTES.HOME}
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all hover:px-10"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        <OrderSummary price={price} isCart={true} deliveryFee={0} />
      </div>
    </div>
  );
}
