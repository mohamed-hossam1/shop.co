"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useCart } from "./CartContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface UserContextType {
  user: UserProfile | null;
  updateUser: (newData: UserProfile) => void;
  resetUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { initCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    
    const loadUser = async () => {
      try {
        const { GetUser } = await import("@/app/actions/userAction");
        const userData = await GetUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    loadUser();
  }, []);

  const updateUser = async (newData: UserProfile) => {
    try {
      setUser(newData);
      await initCart();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const resetUser = async () => {
    try {
      setUser(null);
      await initCart();
    } catch (error) {
      console.error("Error resetting user:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, resetUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}