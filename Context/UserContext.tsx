"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
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

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
      } else {
        localStorage.removeItem("userData");
      }
    }
  }, [user, isLoading]);

  const updateUser = async (newData: UserProfile) => {
    setUser(newData);
    await initCart();
  };

  const resetUser = async () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartData");
    }
    await initCart();
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