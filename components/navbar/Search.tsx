"use client"

import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ROUTES from "@/constants/routes";

export default function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchParam = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(currentSearchParam);

  // Sync internal state if the URL changes externally (e.g. clicking a link)
  useEffect(() => {
    setSearchQuery(currentSearchParam);
  }, [currentSearchParam]);

  useEffect(() => {
    if (searchQuery === currentSearchParam) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      router.push(`${ROUTES.PRODUCTS}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentSearchParam, router, searchParams]);

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              placeholder="Search for products..."
              className="w-full px-4 py-3 pl-12 pr-10 bg-[#F0F0F0] border-none font-satoshi rounded-full focus:outline-none focus:ring-1 focus:ring-black/10 transition-all duration-300"
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
