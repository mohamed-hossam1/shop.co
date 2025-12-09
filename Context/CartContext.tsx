"use client";

import {
  addToCartSupa,
  clearCartSupa,
  getCartSupa,
  removeFromCartSupa,
  updateCartSupa,
} from "@/app/actions/cartAction";
import React, { createContext, useState, useContext, useEffect } from "react";
import type { CartData, CartState, CartContextType } from "@/types/Cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartState | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (!cart) {
      setQuantity(0);
      return;
    }
    const count = Object.values(cart).reduce(
      (total, item) => total + item.quantity,
      0
    );
    setQuantity(count);
  }, [cart]);

  useEffect(() => {
    if (!cart) {
      setPrice(0);
      return;
    }
    const total = Object.values(cart).reduce(
      (total, item) => total + item.quantity * item.products.price_after,
      0
    );
    setPrice(total);
  }, [cart]);

  const updateLocalCache = (cartData: CartState) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cartData", JSON.stringify(cartData));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  const getLocalCache = (): CartState | null => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem("cartData");
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  };

  const initCart = async () => {
    setIsLoading(true);
    
    const cached = getLocalCache();
    if (cached && Object.keys(cached).length > 0) {
      setCart(cached);
    }

    try {
      const supaCart = (await getCartSupa()) || [];
      const data: CartState = {};
      for (let index = 0; index < supaCart.length; index++) {
        data[supaCart[index].products.id] = supaCart[index];
      }
      setCart(data);
      updateLocalCache(data);
    } catch (error) {
      console.error("Error initializing cart:", error);
      if (cached) {
        setCart(cached);
      } else {
        setCart({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initCart();
  }, []);

  const addToCart = async ({ products, quantity = 1 }: CartData) => {
    const updatedCart = { ...cart } as CartState;
    let newQuantity = quantity;

    if (updatedCart[products.id]) {
      newQuantity = updatedCart[products.id].quantity + quantity;
      updatedCart[products.id] = {
        ...updatedCart[products.id],
        quantity: newQuantity,
      };
    } else {
      updatedCart[products.id] = { products, quantity };
    }

    setCart(updatedCart);
    updateLocalCache(updatedCart);

    try {
      if (cart && cart[products.id]) {
        await updateCartSupa(products.id, newQuantity);
      } else {
        await addToCartSupa(products.id, quantity);
      }
    } catch (error) {
      console.error("Error updating cart in Supabase:", error);
      await initCart();
    }
  };

  const removeFromCart = async (productId: number) => {
    const updatedCart = { ...cart } as CartState;
    delete updatedCart[productId];
    
    setCart(updatedCart);
    updateLocalCache(updatedCart);

    try {
      await removeFromCartSupa(productId);
    } catch (error) {
      console.error("Error removing from cart:", error);
      await initCart();
    }
  };

  const clearCart = async () => {
    setCart({});
    updateLocalCache({});

    try {
      await clearCartSupa();
    } catch (error) {
      console.error("Error clearing cart:", error);
      await initCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        quantity,
        price,
        initCart,
        addToCart,
        isLoading,
        clearCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}