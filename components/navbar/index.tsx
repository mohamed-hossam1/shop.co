"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search as SearchIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import ROUTES from "@/constants/routes";
import Searchbar from "./Search";
import UserControl from "./UserControl";
import CartIcon from "./CartIcon";
import { ModeToggle } from "./ModeToggle";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (pathname.startsWith(path) && path !== ROUTES.HOME);
    return `transition-colors ${
      isActive ? "text-black font-bold" : "text-black/60 hover:text-black"
    }`;
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-50 border-b border-black">
      <div className="w-full bg-black text-white py-2 px-4 text-center text-xs sm:text-sm font-satoshi uppercase tracking-widest">
        <p>
          Get 20% off when you use this code{" "}
          <span className="font-bold">SHOP.CO</span>
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4 lg:gap-10">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href={ROUTES.HOME} className="shrink-0">
              <span className="text-xl sm:text-2xl lg:text-3xl font-integral font-black tracking-widest text-black">
                ELARIS
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 font-satoshi uppercase tracking-wider text-sm">
            <Link
              href={ROUTES.PRODUCTS}
              className={`${getLinkClass(ROUTES.PRODUCTS)}`}
            >
              Shop
            </Link>
            <Link href={ROUTES.TOP_SELLING} className={getLinkClass(ROUTES.TOP_SELLING)}>
              Top Selling
            </Link>
            <Link href={ROUTES.NEW_ARRIVALS} className={getLinkClass(ROUTES.NEW_ARRIVALS)}>
              New Arrivals
            </Link>
            <Link href={ROUTES.ORDERS} className={getLinkClass(ROUTES.ORDERS)}>
              Orders
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-[600px]">
            <Searchbar />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 font-satoshi">
            <div className="md:hidden">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors cursor-pointer"
                aria-label="Toggle search"
              >
                <SearchIcon className="w-6 h-6" />
              </button>
            </div>
            <ModeToggle />
            <CartIcon />
            <UserControl />
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white pb-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Searchbar autoFocus={true} />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-black/60 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        getLinkClass={getLinkClass}
      />
    </nav>
  );
}
