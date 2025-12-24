"use client"

import { Search } from "lucide-react";
import React, { useState } from "react";

export default function Searchbar() {
  const [searchQuarry, setSearchQuarry] = useState("");

  return (
    <div className="flex-4 mx-8">
      <div className="relative w-full">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              placeholder="Search Skin Care, Hair Care, Bundle..."
              className="w-full px-4 py-3 pl-12 pr-32 border-2 border-gray-200 font-[500] rounded-xl focus:ring-2 focus:ring-primary focus:border-priring-primary transition-all duration-300 hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm "
              type="text"
              onChange={(e)=>setSearchQuarry(e.target.value)}
              value={searchQuarry}
            />
            <div className="absolute inset-y-0 -left-1 pl-4 flex items-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
