"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { adminInputClassName, adminSelectClassName } from "@/components/admin/AdminUI";

export function OrderFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [paymentMethod, setPaymentMethod] = useState(searchParams.get("paymentMethod") || "");
  const [customerType, setCustomerType] = useState(searchParams.get("customerType") || "");
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
    setStatus("");
    setPaymentMethod("");
    setCustomerType("");
    setDateFrom("");
    setDateTo("");
    startTransition(() => {
      router.push("?");
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6 p-4 border border-black bg-admin-bg-alt">
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Search</label>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ID or Name..." 
          className={adminInputClassName} 
        />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Status</label>
        <select 
          value={status} 
          onChange={(e) => { setStatus(e.target.value); updateFilters("status", e.target.value); }} 
          className={adminSelectClassName}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Payment</label>
        <select 
          value={paymentMethod} 
          onChange={(e) => { setPaymentMethod(e.target.value); updateFilters("paymentMethod", e.target.value); }} 
          className={adminSelectClassName}
        >
          <option value="">All</option>
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="vodafone_cash">Vodafone Cash</option>
          <option value="instapay">Instapay</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.1em] mb-1">Customer</label>
        <select 
          value={customerType} 
          onChange={(e) => { setCustomerType(e.target.value); updateFilters("customerType", e.target.value); }} 
          className={adminSelectClassName}
        >
          <option value="">All</option>
          <option value="user">Registered</option>
          <option value="guest">Guest</option>
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
      <div className="flex flex-col">
        <div className="flex gap-2">
          <div className="flex-1">
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
              className="h-[46px] px-3 border border-black bg-white hover:bg-black hover:text-white transition text-[10px] font-black uppercase tracking-[0.1em]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
