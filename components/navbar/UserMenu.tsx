"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ROUTES from "@/constants/routes";
import { SignOutSupabase } from "@/actions/userAction";
import { useRouter } from "next/navigation";
import { useCart } from "@/stores/cartStore";
import { useUser } from "@/stores/userStore";

export default function UserMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const userContext = useUser();
  const userData = userContext.user;
  const { clearCart } = useCart();

  const signOut = async () => {
    await SignOutSupabase();
    userContext.resetUser();
    await clearCart();
    router.replace(ROUTES.SIGNIN);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <CircleUser className="w-6 h-6 text-black hover:text-black/70 transition-colors cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 rounded-none border-black p-2 font-satoshi">
        {userData && (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 border-b mb-1">
              <p className="font-bold">{userData.name}</p>
              <p className="text-xs text-black/50">{userData.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.PROFILE} className="w-full cursor-pointer rounded-none px-2 py-1.5 hover:bg-gray-100 block border border-transparent hover:border-black transition-all">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ORDERS} className="w-full cursor-pointer rounded-none px-2 py-1.5 hover:bg-gray-100 block border border-transparent hover:border-black transition-all">
                Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="mt-1">
              <button className="w-full text-left text-red-500 cursor-pointer rounded-none px-2 py-1.5 hover:bg-red-50 border border-transparent hover:border-red-500 transition-all font-bold" onClick={signOut}>
                Sign Out
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
