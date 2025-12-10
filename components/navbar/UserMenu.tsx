"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel

} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ROUTES from "@/constants/routes";
import { SignOutSupabase } from "@/app/actions/userAction";
import { useRouter } from "next/navigation";

export default function UserMenu({userContext}) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter()
  const userData = userContext?.user
  
  const signOut = async ()=>{
    await SignOutSupabase()
    userContext.resetUser()
    router.replace(ROUTES.SIGNIN)
  }
  return (
      <DropdownMenu open={open} onOpenChange={(v: boolean) => setOpen(v)}>
        <DropdownMenuTrigger >
          <div className="flex flex-row-reverse items-center gap-2 font-semibold" onClick={() => setOpen(!open)}>
            <div>
              {userData && <p>{userData.name}</p>}

            </div>
            <div className="border-2 flex bg-primary items-center w-10 h-10 flex justify-center items-center rounded-full cursor-pointer border-primary transition-all duration-300">
              {userData?<>
                <p className="text-white w-5 cursor-pointer font-bold" onClick={() => setOpen(!open)}>{userData.name[0]}</p>
              </>:
              <User2 className="text-white w-5 cursor-pointer" onClick={() => setOpen(!open)}/>}
            </div>

          </div>
          
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 p-3 rounded-2xl">
          {userData?(<>
            <DropdownMenuLabel className="border-b mb-2">
              <p>{userData.name}</p>
              <p className="text-gray-500">{userData.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <Link onClick={() => setOpen(!open)} href={ROUTES.PROFILE} className="w-full h-full">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" >
              <Link onClick={() => setOpen(!open)} href={ROUTES.CART} className="w-full h-full">
                Cart
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" >
              <Link onClick={() => setOpen(!open)} href={ROUTES.ORDERS} className="w-full h-full">
                Orders
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer mt-3" >
              <button className="w-full h-full text-red-500 text-left" onClick={()=>signOut()}>
                Sign Out
              </button>
            </DropdownMenuItem>
          
          </>):<>
            <DropdownMenuItem className="cursor-pointer">
              <Link onClick={() => setOpen(!open)} href={ROUTES.SIGNIN} className="w-full h-full">
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" >
              <Link onClick={() => setOpen(!open)} href={ROUTES.SIGNUP} className="w-full h-full">
                Sign Up
              </Link>
            </DropdownMenuItem>
          </>}
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
