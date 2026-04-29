"use client";

import { useState, useEffect } from "react";
import { getAddresses, deleteAddress } from "@/actions/addressAction";
import { MapPin, Phone, Building, Plus, Trash2, Edit3 } from "lucide-react";
import { Address } from "@/types/Address";
import AddressForm from "./AddressForm";
import { motion, AnimatePresence } from "motion/react";

export default function SavedAddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const fetchAddresses = async () => {
    setIsLoading(true);
    const res = await getAddresses();
    if (res.success) {
      setAddresses(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      const res = await deleteAddress(id);
      if (res.success) {
        fetchAddresses();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 bg-black/5 animate-pulse border border-black/10" />
        ))}
      </div>
    );
  }

  if (isAddingNew || editingAddress) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AddressForm 
          initialData={editingAddress || undefined}
          onSuccess={() => {
            setIsAddingNew(false);
            setEditingAddress(null);
            fetchAddresses();
          }}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingAddress(null);
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add New Address Trigger */}
      <button 
        onClick={() => setIsAddingNew(true)}
        className="w-full py-8 border border-black border-dashed bg-black/5 group hover:bg-black transition-all flex flex-col items-center justify-center gap-3"
      >
        <div className="w-10 h-10 bg-white group-hover:bg-white flex items-center justify-center border border-black group-hover:scale-110 transition-transform">
          <Plus className="w-5 h-5 text-black" />
        </div>
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-black group-hover:text-white">Add New Shipping Address</span>
      </button>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-black/5 bg-gray-50/30">
          <MapPin className="w-8 h-8 text-black/10 mb-4" />
          <p className="text-black/30 uppercase tracking-[0.2em] text-[10px] font-black">
            Your address book is empty
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="group border border-black/10 bg-white p-6 sm:p-10 hover:border-black transition-all duration-300 relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${address.is_default ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                      {address.is_default ? 'Default Address' : 'Shipping Address'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xl font-black text-black uppercase tracking-wider flex items-center gap-3">
                      <Building className="w-4 h-4 text-black/20" />
                      {address.full_name}
                    </p>
                    <p className="text-sm font-bold text-black/50 uppercase tracking-[0.1em] pl-7 leading-relaxed">
                      {address.address_line}<br />
                      {address.area}, {address.city}
                    </p>
                  </div>

                  <p className="text-xs font-bold text-black/40 flex items-center gap-3 pl-7">
                    <Phone className="w-3 h-3" />
                    {address.phone}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-3">
                  <button 
                    onClick={() => setEditingAddress(address)}
                    className="p-3 border border-black/10 text-black hover:bg-black hover:text-white hover:border-black transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-widest sm:hidden lg:inline">Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className="p-3 border border-black/10 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-widest sm:hidden lg:inline">Remove</span>
                  </button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 right-2 w-1 h-1 bg-black" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
