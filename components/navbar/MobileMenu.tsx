"use client";

import Link from "next/link";
import { X } from "lucide-react";
import ROUTES from "@/constants/routes";
import { motion, AnimatePresence } from "motion/react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  getLinkClass: (path: string) => string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  getLinkClass,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-60 lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[300px] bg-white z-70 lg:hidden p-6 shadow-2xl flex flex-col gap-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-integral font-black tracking-widest text-black">
                ELARIS
              </span>
              <button onClick={onClose} className="p-1 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 font-satoshi text-lg font-medium">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={onClose}
                className={getLinkClass(ROUTES.PRODUCTS)}
              >
                Shop
              </Link>
              <Link
                href={ROUTES.TOP_SELLING}
                onClick={onClose}
                className={getLinkClass(ROUTES.TOP_SELLING)}
              >
                Top Selling
              </Link>
              <Link
                href={ROUTES.NEW_ARRIVALS}
                onClick={onClose}
                className={getLinkClass(ROUTES.NEW_ARRIVALS)}
              >
                New Arrivals
              </Link>
              <Link
                href={ROUTES.ORDERS}
                onClick={onClose}
                className={getLinkClass(ROUTES.ORDERS)}
              >
                Orders
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
