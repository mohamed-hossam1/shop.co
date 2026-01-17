"use client";

import { useCart } from "@/Context/CartContext";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductData } from "@/types/Product";
import Swal from "sweetalert2";

export default function QuantityProduct({ product }: { product: ProductData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [APIError, setAPIError] = useState("");
  const { addToCart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const isOutOfStock = product.stock === 0;
  const isMaxQuantity = quantity >= product.stock;

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const onSubmit = async () => {
    if (isOutOfStock) return;

    setIsLoading(true);
    try {
      await addToCart({ products: product, quantity });
      
      await Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product has been added to cart',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        background: '#fff',
        iconColor: '#10b981',
        customClass: {
          popup: 'colored-toast'
        }
      });

      setQuantity(1);
      setAPIError("");
    } catch (e) {
      if (e instanceof Error) {
        setAPIError(e.message);
        
        Swal.fire({
          icon: 'error',
          title: 'error!',
          text: e.message,
          confirmButtonColor: '#dc3545',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className=" mb-10">
        <p className="text-xl font-semibold">Quantity:</p>
        <div className="flex w-full justify-center mt-20 gap-5">
          <button
            className="w-13 h-13 rounded-full hover:bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-6xl flex justify-center items-center border-2 border-primary text-primary hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            <span className="relative -top-[2px]">-</span>
          </button>
          <div className="flex flex-col items-center justify-center relative -top-1">
            <p className="font-bold text-4xl">{quantity}</p>
            <p className="text-lg text-gray-700">Unit(s)</p>
          </div>
          <button
            className="w-13 h-13 rounded-full hover:bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-3xl font-semibold flex justify-center items-center border-2 border-primary text-primary hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleIncrease}
            disabled={isMaxQuantity || isOutOfStock}
          >
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
        {APIError ? (
          <p className="text-sm text-center text-red-500 mt-2">
            You add more than in stock
          </p>
        ) : (
          isMaxQuantity &&
          product.stock > 0 && (
            <>
              <p className="text-sm text-center text-red-500 mt-2">
                Maximum quantity reached ({product.stock} available)
              </p>
            </>
          )
        )}
      </div>

      <div className="bg-gray-50 rounded-xl  p-4 space-y-2 mb-14">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-semibold  text-gray-900">
            EGP {product.price_after}
          </span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-medium text-lg text-gray-900">
            Total Price:
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-[#1F1F6F]">
              EGP {product.price_after * quantity}
            </span>
          </div>
        </div>
      </div>

      <button
        className={`py-5 px-3 w-full ${
          isLoading
            ? "bg-green-400 cursor-not-allowed"
            : isOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : "cursor-pointer bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867] "
        } rounded-xl mt-2  flex justify-center items-center transition-all duration-300 hover:scale-105`}
        onClick={onSubmit}
        disabled={isLoading || isOutOfStock}
      >
        {isLoading ? (
          <div className="h-6 w-6 border-b-2 border-current border-white rounded-full animate-spin"></div>
        ) : (
          <p className="h-full w-full md:text-xl text-white flex justify-center items-center font-bold transition-all duration-300">
            {isOutOfStock
              ? "Out of Stock"
              : `Add ${quantity} Unit(s) to Cart - EGP ${
                  product.price_after * quantity
                }`}
          </p>
        )}
      </button>
    </>
  );
}