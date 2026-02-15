"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addToCartSupa,
  clearCartSupa,
  getCartSupa,
  removeFromCartSupa,
  updateCartSupa,
} from "@/app/actions/cartAction";
import { CartState, CartData, AppliedPromo } from "@/types/Cart";
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
    (total, item) => total + item.quantity * item.products.price_after,
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
  initCart: () => Promise<void>;
  addToCart: (data: CartData) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
          for (const [productId, item] of Object.entries(guestCart)) {
            await addToCartSupa(parseInt(productId, 10), item.quantity);
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

              const supaCart = (await getCartSupa()) || [];
              const data: CartState = {};

              for (const entry of supaCart) {
                data[entry.products.id] = entry;
              }

              applyCart(data);
            } else {
              applyCart(guestCart);
            }
          } catch (error) {
            console.error("Error initializing cart:", error);
            if (!user) {
              applyCart({});
            }
          } finally {
            set({ isLoading: false });
          }
        },
        addToCart: async ({ products, quantity = 1 }) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          const currentItem = updatedCart[products.id];
          const currentQuantity = currentItem ? currentItem.quantity : 0;
          const totalRequestedQuantity = currentQuantity + quantity;

          if (totalRequestedQuantity > products.stock) {
            throw new Error(
              `You cannot add ${quantity} of ${products.title}. Only ${products.stock} left in stock.`
            );
          }

          let isNewItem = false;
          if (currentItem) {
            updatedCart[products.id] = {
              ...currentItem,
              quantity: currentItem.quantity + quantity,
            };
          } else {
            updatedCart[products.id] = { products, quantity };
            isNewItem = true;
          }

          applyCart(updatedCart);

          try {
            if (user) {
              let result;
              if (isNewItem) {
                result = await addToCartSupa(products.id, quantity);
              } else {
                result = await updateCartSupa(products.id, totalRequestedQuantity);
              }

              if (result?.error) {
                applyCart(originalCart);
                await get().initCart();
                console.error("Backend stock check failed:", result.error);
              }
            }
          } catch (error) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error updating cart:", error);
          }
        },
        removeFromCart: async (productId) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          delete updatedCart[productId];

          applyCart(updatedCart);

          try {
            if (user) {
              await removeFromCartSupa(productId);
            }
          } catch (error) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error removing from cart:", error);
          }
        },
        clearCart: async () => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;

          applyCart({});
          set({ appliedPromo: null });

          try {
            if (user) {
              await clearCartSupa();
            }
          } catch (error) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error clearing cart:", error);
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
