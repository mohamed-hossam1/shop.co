"use client";

import { ReactNode, useEffect } from "react";
import { useCart } from "@/stores/cartStore";
import { useUser } from "@/stores/userStore";

export function StateProvider({ children }: { children: ReactNode }) {
  const initUser = useUser((state) => state.initUser);
  const initCart = useCart((state) => state.initCart);
  const hasHydrated = useCart((state) => state.hasHydrated);
  const user = useUser((state) => state.user);

  const isUserInitialized = useUser((state) => state.isInitialized);

  useEffect(() => {
    initUser();
  }, [initUser]);

  useEffect(() => {
    if (!hasHydrated || !isUserInitialized) return;
    initCart();
  }, [hasHydrated, isUserInitialized, initCart, user]);

  return <>{children}</>;
}
