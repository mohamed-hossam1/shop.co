"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "@/actions/cartAction";
import { CartState, CartData, AppliedPromo } from "@/types/Cart";
import { ProductDetails, ProductVariant } from "@/types/Product";
import { useUserStore } from "@/stores/userStore";

const calculateTotals = (cart: CartState | null) => {
  if (!cart) {
    return { quantity: 0, price: 0 };
  }

  const entries = Object.values(cart);
  if (entries.length === 0) {
    return { quantity: 0, price: 0 };
  }

  const quantity = entries.reduce((total, item) => total + item.quantity, 0);
  const price = entries.reduce(
    (total, item) => total + item.quantity * item.variant.price,
    0
  );

  return { quantity, price };
};

interface CartStoreState {
  cart: CartState | null;
  quantity: number;
  price: number;
  appliedPromo: AppliedPromo | null;
  isLoading: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  syncTotals: () => void;
  initCart: () => Promise<{ success: boolean; message?: string }>;
  addToCart: (data: CartData) => Promise<{ success: boolean; message?: string }>;
  removeFromCart: (variantId: number) => Promise<{ success: boolean; message?: string }>;
  updateQuantity: (variantId: number, quantity: number) => Promise<{ success: boolean; message?: string }>;
  clearCart: () => Promise<{ success: boolean; message?: string }>;
  setAppliedPromo: (promo: AppliedPromo | null) => void;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => {
      const applyCart = (cartData: CartState | null) => {
        const { quantity, price } = calculateTotals(cartData);
        set({ cart: cartData, quantity, price });
      };

      const mergeGuestCartWithUser = async (guestCart: CartState) => {
        const user = useUserStore.getState().user;
        if (!user || Object.keys(guestCart).length === 0) return;

        try {
          for (const [variantId, item] of Object.entries(guestCart)) {
            await addToCart(Number(variantId), item.quantity);
          }
          set({ cart: {}, quantity: 0, price: 0 });
        } catch (error) {
          console.error("Error merging guest cart:", error);
        }
      };

      return {
        cart: null,
        quantity: 0,
        price: 0,
        appliedPromo: null,
        isLoading: true,
        hasHydrated: false,
        setHasHydrated: (value) => set({ hasHydrated: value }),
        syncTotals: () => {
          const { quantity, price } = calculateTotals(get().cart);
          set({ quantity, price });
        },
        setAppliedPromo: (promo) => set({ appliedPromo: promo }),
        initCart: async () => {
          set({ isLoading: true });
          const user = useUserStore.getState().user;
          const guestCart = (get().cart ?? {}) as CartState;

          try {
            if (user) {
              if (Object.keys(guestCart).length > 0) {
                await mergeGuestCartWithUser(guestCart);
              }

              const cartResponse = await getCart();
              const supaCart = cartResponse.success ? cartResponse.data : null;
              const data: CartState = {};

              if (supaCart && supaCart.items) {
                for (const item of supaCart.items) {
                  if (item.variant?.product) {
                    data[item.variant_id] = {
                      id: item.id,
                      quantity: item.quantity,
                      variant: item.variant as ProductVariant & { product: ProductDetails }
                    };
                  }
                }
              }

              applyCart(data);
            } else {
              applyCart(guestCart);
            }
            return { success: true };
          } catch (error: any) {
            console.error("Error initializing cart:", error);
            if (!user) {
              applyCart({});
            }
            return { success: false, message: error.message };
          } finally {
            set({ isLoading: false });
          }
        },
        addToCart: async ({ variant, quantity = 1 }) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          const currentItem = updatedCart[variant.id];
          const currentQuantity = currentItem ? currentItem.quantity : 0;
          const totalRequestedQuantity = currentQuantity + quantity;

          if (totalRequestedQuantity > variant.stock) {
            return {
              success: false,
              message: `You cannot add ${quantity} of ${variant.product.title}. Only ${variant.stock} left in stock.`
            };
          }

          if (totalRequestedQuantity <= 0) {
            delete updatedCart[variant.id];
          } else if (currentItem) {
            updatedCart[variant.id] = {
              ...currentItem,
              quantity: totalRequestedQuantity,
            };
          } else {
            updatedCart[variant.id] = { variant, quantity };
          }

          applyCart(updatedCart);

          try {
            if (user) {
              let result;
              if (!currentItem) {
                result = await addToCart(variant.id, quantity);
              } else if (totalRequestedQuantity <= 0) {
                if (currentItem.id) result = await removeFromCart(currentItem.id);
              } else if (currentItem.id) {
                result = await updateQuantity(currentItem.id, totalRequestedQuantity);
              }

              if (result && !result.success) {
                applyCart(originalCart);
                await get().initCart();
                return result;
              }
            }
            return { success: true, message: "Added to cart" };
          } catch (error: any) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error updating cart:", error);
            return { success: false, message: error.message };
          }
        },
        updateQuantity: async (variantId, quantity) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          const item = updatedCart[variantId];

          if (!item) return { success: false, message: "Item not found" };

          if (quantity > item.variant.stock) {
             return { success: false, message: `Only ${item.variant.stock} left in stock.` };
          }

          if (quantity <= 0) {
            delete updatedCart[variantId];
          } else {
            updatedCart[variantId] = { ...item, quantity };
          }

          applyCart(updatedCart);

          try {
            if (user && item.id) {
               const result = quantity <= 0 
                ? await removeFromCart(item.id)
                : await updateQuantity(item.id, quantity);
              
              if (result && !result.success) {
                applyCart(originalCart);
                await get().initCart();
                return result;
              }
            }
            return { success: true, message: "Quantity updated" };
          } catch (error: any) {
             applyCart(originalCart);
             await get().initCart();
             return { success: false, message: error.message };
          }
        },
        removeFromCart: async (variantId) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          const itemToRemove = updatedCart[variantId];
          delete updatedCart[variantId];

          applyCart(updatedCart);

          try {
            if (user && itemToRemove?.id) {
              const result = await removeFromCart(itemToRemove.id);
              if (result && !result.success) {
                applyCart(originalCart);
                await get().initCart();
                return result;
              }
            }
            return { success: true, message: "Item removed" };
          } catch (error: any) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error removing from cart:", error);
            return { success: false, message: error.message };
          }
        },
        clearCart: async () => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;

          applyCart({});
          set({ appliedPromo: null });

          try {
            if (user) {
              const result = await clearCart();
              if (result && !result.success) {
                applyCart(originalCart);
                await get().initCart();
                return result;
              }
            }
            return { success: true, message: "Cart cleared" };
          } catch (error: any) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error clearing cart:", error);
            return { success: false, message: error.message };
          }
        },
      };
    },
    {
      name: "cart-store",
      partialize: (state) => {
        const user = useUserStore.getState().user;
        return {
          cart: user ? {} : state.cart,
          appliedPromo: state.appliedPromo,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.syncTotals();
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useCart = useCartStore;
