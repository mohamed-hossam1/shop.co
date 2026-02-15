"use client";

import { create } from "zustand";
import { UserProfile } from "@/types/UserContext";

interface UserStoreState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  initUser: () => Promise<void>;
  updateUser: (newData: UserProfile | null) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  initUser: async () => {
    const { isInitialized } = get();
    if (isInitialized) return;

    set({ isLoading: true });

    try {
      const { GetUser } = await import("@/app/actions/userAction");
      const userData = await GetUser();
      if (userData) {
        set({ user: userData });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },
  updateUser: (newData) => set({ user: newData }),
  resetUser: () => set({ user: null }),
}));

export const useUser = useUserStore;
