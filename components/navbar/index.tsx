"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search as SearchIcon } from "lucide-react";

import ROUTES from "@/constants/routes";
import Searchbar from "./Search";
import UserControl from "./UserControl";
import CartIcon from "./CartIcon";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (pathname.startsWith(path) && path !== ROUTES.HOME);
    return `transition-colors ${
      isActive ? "text-black font-bold" : "hover:text-gray-600"
    }`;
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="w-full bg-black text-white py-2 px-4 text-center text-xs sm:text-sm font-satoshi">
        <p>
          Get 20% off when you use this code{" "}
          <span className="font-bold">SHOP.CO</span>
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4 lg:gap-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>
            <Link href={ROUTES.HOME} className="shrink-0">
              <span className="text-2xl lg:text-3xl font-integral font-black tracking-widest text-black">
                ELARIS
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 font-satoshi">
            <Link
              href={ROUTES.PRODUCTS}
              className={`flex items-center gap-1 ${getLinkClass(ROUTES.PRODUCTS)}`}
            >
              Shop <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="/on-sale" className={getLinkClass("/on-sale")}>
              On Sale
            </Link>
            <Link href="/new-arrivals" className={getLinkClass("/new-arrivals")}>
              New Arrivals
            </Link>
            <Link href="/brands" className={getLinkClass("/brands")}>
              Brands
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-[600px]">
            <Searchbar />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-satoshi">
            <div className="md:hidden">
              <button className="p-1">
                <SearchIcon className="w-6 h-6" />
              </button>
            </div>
            <ModeToggle />
            <CartIcon />
            <UserControl />
          </div>
        </div>
      </div>
    </nav>
  );
}
