"use client";
import Link from "next/link";
import { CircleUser } from "lucide-react";
import UserMenu from "./UserMenu";
import { useUser } from "@/stores/userStore";
import ROUTES from "@/constants/routes";

export default function UserControl() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="w-6 h-6 rounded-full bg-gray-100 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center">
        <UserMenu />
      </div>
    );
  }

  return (
    <Link href={ROUTES.SIGNIN} className="flex items-center gap-2 outline-none">
      <CircleUser className="w-6 h-6 text-black hover:text-black/70 transition-colors cursor-pointer" />
    </Link>
  );
}
