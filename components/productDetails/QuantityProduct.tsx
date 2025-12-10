"use client";

import ROUTES from "@/constants/routes";
import { useCart } from "@/Context/CartContext";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuantityProduct({
  product,
}: {
  product: ProductData;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const {addToCart} = useCart()
  const {user} = useUser()
  const router = useRouter()
  console.log(product)

  const onSubmit = async() => {
    if(user){
      setIsLoading(true)
      const products = product;
      await addToCart({products , quantity})
      setIsLoading(false)
    }
    else{
      router.replace(ROUTES.SIGNIN)
    }
  };

  return (
    <>
      <div className=" mb-10">
        <p className="text-xl font-semibold">Quantity:</p>
        <div className="flex w-full justify-center mt-20 gap-5">
          <button
            className="w-13 h-13 rounded-full hover:bg-primary text-6xl flex justify-center items-center border-2 border-primary text-primary hover:text-white transition-all duration-300 cursor-pointer"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <span className="relative -top-[2px]">-</span>
          </button>
          <div className="flex flex-col items-center justify-center relative -top-1">
            <p className="font-bold text-4xl">{quantity}</p>
            <p className="text-lg text-gray-700">Unit(s)</p>
          </div>
          <button
            className="w-13 h-13 rounded-full hover:bg-primary text-3xl font-semibold flex justify-center items-center border-2 border-primary text-primary hover:text-white transition-all duration-300 cursor-pointer"
            onClick={() => setQuantity(quantity + 1)}
          >
            <span className="relative -top-[1px]">+</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl  p-4 space-y-2 mb-14">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-semibold  text-gray-900">
            EGP {product.price_after}
          </span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-medium text-lg text-gray-900">Total Price:</span>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-[#1F1F6F]">
              EGP {product.price_after * quantity}
            </span>
            <span className="font-bold text-lg text-right text-[#1F1F6F] line-through">
              EGP {product.price_before * quantity}
            </span>

          </div>
        </div>
      </div>

      <button
        className={`py-5 px-3 w-full ${
          isLoading
            ? "bg-green-500 hover:bg-green-600 cursor-not-allowed"
            : "cursor-pointer bg-primary hover:bg-primary-hover"
        } rounded-xl mt-2  flex justify-center items-center transition-all duration-300 hover:scale-105`}
        onClick={() => onSubmit()}
      >
        {isLoading ? (
          <div className="h-6 w-6 border-b-2 border-current border-white rounded-full animate-spin"></div>
        ) : (
          <p className="h-full w-full md:text-xl text-white flex justify-center items-center font-bold transition-all duration-300">
            {`Add ${quantity} Unit(s) to Cart - EGP ${product.price_after * quantity}`}
        </p>
        )}
        
      </button>
    </>
  );
}
