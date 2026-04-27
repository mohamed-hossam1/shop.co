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
      const { GetUser } = await import("@/actions/userAction");
      const response = await GetUser();
      if (response.success && response.data) {
        set({ user: response.data });
      } else {
        set({ user: null });
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
