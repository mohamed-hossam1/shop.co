"use client";
import UserMenu from "./UserMenu";
import { useUser } from "@/stores/userStore";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import React from "react";

const AuthButtons = React.memo(() => (
  <>
    <div className="hidden lg:flex">
      <Link
        href={ROUTES.SIGNIN}
        className="border-2 rounded-xl py-2.5 px-4 hover:bg-gray-100 transition-all duration-300 text-primary hover:text-primary-hover"
      >
        Login
      </Link>
    </div>
    <div className="hidden lg:flex">
      <Link
        href={ROUTES.SIGNUP}
        className="border-2 rounded-xl py-2.5 px-4  text-white bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867]  transition-all duration-300"
      >
        Sign Up
      </Link>
    </div>
  </>
));

AuthButtons.displayName = "AuthButtons";

const LoadingSkeleton = React.memo(() => (
  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export default function UserControl() {
  const userContext = useUser();

  if (userContext.isLoading) {
    return <LoadingSkeleton />;
  }

  if (!userContext.user) {
    return (
      <>
        <AuthButtons />
        <div className="flex lg:hidden">
          <UserMenu />
        </div>
      </>
    );
  }

  return (
    <div className="flex">
      <UserMenu />
    </div>
  );
}
