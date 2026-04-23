"use client";
import UserMenu from "./UserMenu";
import { useUser } from "@/stores/userStore";
import React from "react";

export default function UserControl() {
  const userContext = useUser();

  if (userContext.isLoading) {
    return <div className="w-6 h-6 rounded-full bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="flex items-center">
      <UserMenu />
    </div>
  );
}
