"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { adminInputClassName, adminSelectClassName } from "@/components/admin/AdminUI";

export default function UserFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [searchParams, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateFilters("search", search);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, searchParams, updateFilters]);

  const handleClear = () => {
    setSearch("");
    setRole("");
    setDateFrom("");
    setDateTo("");
    startTransition(() => {
      router.push("?");
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 p-4 border border-black bg-white">
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Search</label>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, Email, Phone..." 
          className={adminInputClassName} 
        />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Role</label>
        <select 
          value={role} 
          onChange={(e) => { setRole(e.target.value); updateFilters("role", e.target.value); }} 
          className={adminSelectClassName}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Date From</label>
        <input 
          type="date" 
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); updateFilters("dateFrom", e.target.value); }} 
          className={adminInputClassName} 
        />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Date To</label>
        <input 
          type="date" 
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); updateFilters("dateTo", e.target.value); }} 
          className={adminInputClassName} 
        />
      </div>
      <div className="flex items-end">
        <button 
          onClick={handleClear}
          disabled={isPending}
          className="w-full h-[46px] px-3 border border-black bg-white hover:bg-black hover:text-white transition text-[10px] font-black uppercase tracking-[0.1em] disabled:opacity-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
