"use client";

import { useCart } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductDetails, ProductVariant } from "@/types/Product";
import Toast from "@/components/ui/Toast";

export default function QuantityProduct({ product }: { product: ProductDetails }) {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  
  const variants = product.variants || [];
  const [selectedColor, setSelectedColor] = useState<string>(
    variants[0]?.color || "",
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    variants[0]?.size || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const colors = Array.from(
    new Set(variants.map((v: ProductVariant) => v.color)),
  );

  const availableSizes = variants
    .filter((v: ProductVariant) => v.color === selectedColor)
    .map((v: ProductVariant) => v.size);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const sizesForColor = variants
      .filter((v: ProductVariant) => v.color === color)
      .map((v: ProductVariant) => v.size);

    if (!sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0]);
    }
    setQuantity(1);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const selectedVariant = variants.find(
    (v: ProductVariant) => v.color === selectedColor && v.size === selectedSize,
  );

  const stock = selectedVariant?.stock || 0;
  const price = selectedVariant?.price || 0;
  const isOutOfStock = stock === 0;
  const isMaxQuantity = quantity >= stock;

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const onSubmit = async () => {
    if (isOutOfStock || !selectedVariant) return;

    setIsLoading(true);
    try {
      const res = await addToCart({
        variant: { ...selectedVariant, product },
        quantity,
      });

      if (res && !res.success) {
        setToast({
          show: true,
          message: res.message || "Failed to add to cart",
          type: "error",
        });
        return;
      }

      setToast({
        show: true,
        message: "Product added to cart successfully",
        type: "success",
      });

      setQuantity(1);
    } catch (e: any) {
      setToast({
        show: true,
        message: e.message || "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-satoshi">
      <div className="space-y-6 mb-8">
        {colors.length > 0 && (
          <div>
            <p className="text-gray-500 mb-3 font-medium uppercase text-sm tracking-wider">
              Select Color
            </p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  title={color}
                  className={`w-10 h-10 border border-black transition-all flex items-center justify-center ${
                    selectedColor === color
                      ? "ring-2 ring-black ring-offset-2"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div
                      className={`w-3 h-3 ${
                        color.toLowerCase() === "#ffffff" ||
                        color.toLowerCase() === "white"
                          ? "bg-black"
                          : "bg-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div>
            <p className="text-gray-500 mb-3 font-medium uppercase text-sm tracking-wider">
              Choose Size
            </p>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-8 py-3 border border-black transition-all font-bold text-xs uppercase tracking-widest ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full mb-8" />

      <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
        <div className="flex items-center border border-black px-6 py-4 space-x-10 bg-white">
          <button
            className="text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors p-1 disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1 || isOutOfStock}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M20 12H4"
              />
            </svg>
          </button>

          <span className="font-bold text-xl text-black w-6 text-center select-none font-integral">
            {isOutOfStock ? 0 : quantity}
          </span>

          <button
            className="text-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors p-1 disabled:opacity-20 disabled:cursor-not-allowed"
            onClick={handleIncrease}
            disabled={isMaxQuantity || isOutOfStock}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        <button
          className={`flex-1 py-4 px-8 font-black text-sm uppercase tracking-[0.2em] transition-all flex justify-center items-center border border-black ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-white hover:text-black"
          }`}
          onClick={onSubmit}
          disabled={isLoading || isOutOfStock}
        >
          {isLoading ? (
            <div className="h-6 w-6 border-2 border-black/30 border-t-black animate-spin"></div>
          ) : isOutOfStock ? (
            "Sold Out"
          ) : (
            `Add to Cart - ${ (price * quantity).toFixed(0)} EGP`
          )}
        </button>
      </div>

      {!isOutOfStock && isMaxQuantity && (
        <p className="text-sm text-red-500 font-bold mb-4 animate-pulse">
          Only {stock} available in stock for this variant!
        </p>
      )}

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
