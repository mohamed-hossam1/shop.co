"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/actions/cart";
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
  initCart: () => Promise<void>;
  addToCart: (data: CartData) => Promise<void>;
  removeFromCart: (variantId: number) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
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

              const supaCart = (await getCart()) as any;
              const data: CartState = {};

              if (supaCart && supaCart.items) {
                for (const item of supaCart.items) {
                  if (item.variant?.product) {
                    data[item.variant_id] = {
                      id: item.id,
                      quantity: item.quantity,
                      variant: item.variant
                    };
                  }
                }
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
        addToCart: async ({ variant, quantity = 1 }) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          const currentItem = updatedCart[variant.id];
          const currentQuantity = currentItem ? currentItem.quantity : 0;
          const totalRequestedQuantity = currentQuantity + quantity;

          if (totalRequestedQuantity > variant.stock) {
            throw new Error(
              `You cannot add ${quantity} of ${variant.product.title}. Only ${variant.stock} left in stock.`
            );
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
                result = await updateCartItemQuantity(currentItem.id, totalRequestedQuantity);
              }

              if (result?.error) {
                applyCart(originalCart);
                await get().initCart();
              }
            }
          } catch (error) {
            applyCart(originalCart);
            await get().initCart();
            console.error("Error updating cart:", error);
          }
        },
        updateQuantity: async (variantId, quantity) => {
          const user = useUserStore.getState().user;
          const originalCart = get().cart;
          const updatedCart = { ...((originalCart ?? {}) as CartState) };
          const item = updatedCart[variantId];

          if (!item) return;

          if (quantity > item.variant.stock) {
             throw new Error(`Only ${item.variant.stock} left in stock.`);
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
                : await updateCartItemQuantity(item.id, quantity);
              
              if (result?.error) {
                applyCart(originalCart);
                await get().initCart();
              }
            }
          } catch (error) {
             applyCart(originalCart);
             await get().initCart();
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
              await removeFromCart(itemToRemove.id);
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
              await clearCart();
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
