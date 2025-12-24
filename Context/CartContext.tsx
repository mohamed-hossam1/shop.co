"use client";

import {
  addToCartSupa,
  clearCartSupa,
  getCartSupa,
  removeFromCartSupa,
  updateCartSupa,
} from "@/app/actions/cartAction";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

import {
  CartContextType,
  CartData,
  CartState,
  AppliedPromo,
} from "@/types/Cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

const PROMO_STORAGE_KEY = "appliedPromo";
const CART_STORAGE_KEY = "guestCart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartState | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  
  const { user } = useUser();

  const setPromo = (promo: AppliedPromo | null) => {
    setAppliedPromo(promo);
    if (promo) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promo));
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  };

  // Load promo from localStorage
  useEffect(() => {
    const storedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
    if (storedPromo) {
      try {
        setAppliedPromo(JSON.parse(storedPromo));
      } catch (e) {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    }
  }, []);

  // Calculate quantity
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

  // Calculate price
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

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCart(parsed);
      } catch (e) {
        console.error("Error loading guest cart:", e);
        setCart({});
      }
    } else {
      setCart({});
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartData: CartState) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  };

  // Merge guest cart with user cart when user logs in
  const mergeGuestCartWithUser = async (guestCart: CartState) => {
    if (!user || Object.keys(guestCart).length === 0) return;

    try {
      for (const [productId, item] of Object.entries(guestCart)) {
        await addToCartSupa(parseInt(productId), item.quantity);
      }
      // Clear guest cart after merge
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error merging guest cart:", error);
    }
  };

  // Initialize cart
  const initCart = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // User is logged in - load from database
        const supaCart = (await getCartSupa()) || [];
        const data: CartState = {};
        for (let index = 0; index < supaCart.length; index++) {
          data[supaCart[index].products.id] = supaCart[index];
        }
        setCart(data);
      } else {
        // Guest user - load from localStorage
        loadGuestCart();
      }
    } catch (error) {
      console.error("Error initializing cart:", error);
      if (!user) {
        setCart({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize cart on mount and when user changes
  useEffect(() => {
    const initialize = async () => {
      if (user) {
        // Check if there's a guest cart to merge
        const guestCartStr = localStorage.getItem(CART_STORAGE_KEY);
        if (guestCartStr) {
          try {
            const guestCart = JSON.parse(guestCartStr);
            await mergeGuestCartWithUser(guestCart);
          } catch (e) {
            console.error("Error merging cart:", e);
          }
        }
      }
      await initCart();
    };

    initialize();
  }, [user]);

  const addToCart = async ({ products, quantity = 1 }: CartData) => {
    const originalCart = cart;
    const updatedCart = { ...cart } as CartState;
    let newQuantity = quantity;
    let isNewItem = false;

    const currentCartQuantity = updatedCart[products.id]
      ? updatedCart[products.id].quantity
      : 0;
    const totalRequestedQuantity = currentCartQuantity + quantity;

    if (totalRequestedQuantity > products.stock) {
      throw new Error(
        `You cannot add ${quantity} of ${products.title}. Only ${products.stock} left in stock.`
      );
    }

    if (updatedCart[products.id]) {
      newQuantity = updatedCart[products.id].quantity + quantity;
      updatedCart[products.id] = {
        ...updatedCart[products.id],
        quantity: newQuantity,
      };
    } else {
      updatedCart[products.id] = { products, quantity };
      isNewItem = true;
    }

    setCart(updatedCart);

    try {
      if (user) {
        let result;
        if (!isNewItem) {
          result = await updateCartSupa(products.id, totalRequestedQuantity);
        } else {
          result = await addToCartSupa(products.id, quantity);
        }

        if (result.error) {
          setCart(originalCart);
          await initCart();
          console.error("Backend stock check failed:", result.error);
        }
      } else {
        setTimeout(() => {
        }, 1000);
        saveGuestCart(updatedCart);
      }
    } catch (error) {
      setCart(originalCart);
      await initCart();
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = async (productId: number) => {
    const originalCart = cart;
    const updatedCart = { ...cart } as CartState;
    delete updatedCart[productId];

    setCart(updatedCart);

    try {
      if (user) {
        await removeFromCartSupa(productId);
      } else {
        saveGuestCart(updatedCart);
      }
    } catch (error) {
      setCart(originalCart);
      await initCart();
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    const originalCart = cart;
    setCart({});
    setPromo(null);

    try {
      if (user) {
        await clearCartSupa();
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      setCart(originalCart);
      await initCart();
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        quantity,
        price,
        appliedPromo,
        setAppliedPromo,
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