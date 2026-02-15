"use client";

import ROUTES from "@/constants/routes";
import { useCart } from "@/stores/cartStore";
import Image from "next/image";
import Link from "next/link";
import OrderSummary from "./OrderSummary";
import CartSkeleton from "../skeleton/CartSkeleton";
import { ProductData } from "@/types/Product";

export default function CartList() {
  const {
    cart,
    quantity,
    removeFromCart,
    addToCart,
    price,
    clearCart,
    isLoading,
  } = useCart();

  const removeProduct = (productId: number) => {
    removeFromCart(productId);
  };

  const increase = (product: ProductData) => {
    addToCart({ products: product, quantity: 1 });
  };

  const decrease = (product: ProductData) => {
    addToCart({ products: product, quantity: -1 });
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (isLoading || cart === null) {
    return <CartSkeleton />;
  }

  const cartEntries = cart ? Object.entries(cart) : [];
  const hasItems = cartEntries.length > 0;

  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2 md:mt-3">
          {quantity} item{quantity !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:flex-[4]">
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
            <div className="border shadow-xl rounded-xl">
              {cartEntries.map(([key, value], index) => {
                const isMaxQuantity = value.quantity >= value.products.stock;
                const isOutOfStock = value.products.stock === 0;

                return (
                  <div
                    key={key}
                    className="p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b last:border-b-0"
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src={value.products?.image_cover}
                        alt={value.products.title}
                        priority={index === 0}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link
                            className="font-semibold text-sm md:text-base text-gray-900 hover:text-primary transition-colors block truncate"
                            href={`/products/${value.products.id}`}
                          >
                            {value.products.title}
                          </Link>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">
                            {value.products.categories.title}
                          </p>
                        </div>

                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer flex-shrink-0"
                          title="Remove item"
                          onClick={() => removeProduct(value.products.id)}
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
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

                      <div className="flex flex-row items-center justify-between mt-3 md:mt-4 gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <button
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={value.quantity <= 1}
                              onClick={() => decrease(value.products)}
                              aria-label="Decrease quantity"
                            >
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>

                            <span className="font-semibold text-sm md:text-base text-gray-900 w-6 md:w-8 text-center">
                              {value.quantity}
                            </span>

                            <button
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => increase(value.products)}
                              disabled={isMaxQuantity || isOutOfStock}
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                          {(isMaxQuantity || isOutOfStock) && (
                            <p className="text-xs text-red-500 mt-1">
                              {isOutOfStock
                                ? "Out of Stock"
                                : `Max available: ${value.products.stock}`}
                            </p>
                          )}
                        </div>

                        <div className="text-right w-auto">
                          <p className="font-bold text-sm md:text-base text-primary">
                            EGP{" "}
                            {(
                              value.products.price_after * value.quantity
                            ).toFixed(2)}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            EGP {value.products.price_after.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border shadow-xl rounded-xl p-8 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                ></path>
              </svg>
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <Link
                href={ROUTES.HOME}
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
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
