"use client";

import { ReactNode, useEffect } from "react";
import { useCart } from "@/stores/cartStore";
import { useUser } from "@/stores/userStore";

export function StateProvider({ children }: { children: ReactNode }) {
  const initUser = useUser((state) => state.initUser);
  const initCart = useCart((state) => state.initCart);
  const hasHydrated = useCart((state) => state.hasHydrated);
  const user = useUser((state) => state.user);

  useEffect(() => {
    initUser();
  }, [initUser]);

  useEffect(() => {
    if (!hasHydrated) return;
    initCart();
  }, [hasHydrated, initCart, user]);

  return <>{children}</>;
}
