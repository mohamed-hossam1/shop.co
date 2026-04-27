"use client";

import { useCart } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductDetails, ProductVariant } from "@/types/Product";
import Swal from "sweetalert2";

export default function QuantityProduct({ product }: { product: ProductDetails }) {
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.message || "Failed to add to cart",
          confirmButtonColor: "#000",
        });
        return;
      }

      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added to cart",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        toast: true,
      });

      setQuantity(1);
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "An unexpected error occurred",
        confirmButtonColor: "#000",
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
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor === color
                      ? "border-black ring-2 ring-black/10"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div
                      className={`w-3 h-3 rounded-full ${
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
                  className={`px-6 py-2 rounded-full border-2 transition-all font-bold text-sm ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"
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

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="flex items-center bg-gray-100 rounded-full px-6 py-3 space-x-8">
          <button
            className="text-2xl font-bold flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
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

          <span className="font-bold text-lg text-black w-4 text-center select-none">
            {isOutOfStock ? 0 : quantity}
          </span>

          <button
            className="text-2xl font-bold flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
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
          className={`flex-1 py-4 px-8 rounded-full font-bold text-lg transition-all flex justify-center items-center shadow-lg active:scale-95 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-black text-white hover:bg-gray-800 shadow-black/10"
          }`}
          onClick={onSubmit}
          disabled={isLoading || isOutOfStock}
        >
          {isLoading ? (
            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            `Add to Cart - EGP ${(price * quantity).toFixed(2)}`
          )}
        </button>
      </div>

      {!isOutOfStock && isMaxQuantity && (
        <p className="text-sm text-red-500 font-bold mb-4 animate-pulse">
          Only {stock} available in stock for this variant!
        </p>
      )}
    </div>
  );
}
