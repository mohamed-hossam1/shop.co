"use client";

import { useState, useTransition } from "react";
import { addAddress, updateAddress } from "@/actions/addressAction";
import { getCities } from "@/actions/deliveryAction";
import { useQuery } from "@tanstack/react-query";
import { Address } from "@/types/Address";
import Toast from "@/components/ui/Toast";
import { X, ChevronDown } from "lucide-react";

interface AddressFormProps {
  initialData?: Address;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddressForm({ initialData, onSuccess, onCancel }: AddressFormProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: cities = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getCities();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    city: initialData?.city || "",
    area: initialData?.area || "",
    address_line: initialData?.address_line || "",
    is_default: initialData?.is_default || false,
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^(010|011|012|015)[0-9]{8}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.address_line) newErrors.address_line = "Address details are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = initialData 
        ? await updateAddress(initialData.id, formData)
        : await addAddress(formData);

      if (res.success) {
        setToast({ message: initialData ? "Address updated" : "Address added", type: "success" });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setToast({ message: res.message, type: "error" });
      }
    });
  };

  return (
    <div className="bg-white border border-black p-8 sm:p-12 font-satoshi relative max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black font-integral uppercase tracking-wider text-black">
            {initialData ? "Edit Address" : "New Address"}
          </h2>
          <div className="h-1 w-12 bg-black mt-2" />
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-black hover:text-white transition-all border border-transparent hover:border-black cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-black/40 tracking-[0.2em] block">Full Name</label>
            <input
              className={`w-full px-4 py-4 border border-black/10 font-bold text-black focus:border-black outline-none transition-all placeholder:text-black/10 ${errors.full_name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-black/40 tracking-[0.2em] block">Phone Number</label>
            <input
              className={`w-full px-4 py-4 border border-black/10 font-bold text-black focus:border-black outline-none transition-all placeholder:text-black/10 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="01xxxxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 relative">
            <label className="text-[10px] uppercase font-black text-black/40 tracking-[0.2em] block">City</label>
            <div className="relative">
              <select
                className={`w-full px-4 py-4 border border-black/10 font-bold text-black focus:border-black outline-none appearance-none bg-white transition-all ${errors.city ? 'border-red-500' : ''}`}
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              >
                <option value="">Select City</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-black/40" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-black/40 tracking-[0.2em] block">Area / District</label>
            <input
              className={`w-full px-4 py-4 border border-black/10 font-bold text-black focus:border-black outline-none transition-all placeholder:text-black/10 ${errors.area ? 'border-red-500' : ''}`}
              placeholder="Maadi, Nasr City..."
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-black/40 tracking-[0.2em] block">Detailed Address</label>
          <input
            className={`w-full px-4 py-4 border border-black/10 font-bold text-black focus:border-black outline-none transition-all placeholder:text-black/10 ${errors.address_line ? 'border-red-500' : ''}`}
            placeholder="Street name, building number, floor..."
            value={formData.address_line}
            onChange={(e) => setFormData({...formData, address_line: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-3 py-4">
          <button
            type="button"
            onClick={() => setFormData({...formData, is_default: !formData.is_default})}
            className={`w-5 h-5 border border-black flex items-center justify-center transition-all ${formData.is_default ? 'bg-black' : 'bg-white'}`}
          >
            {formData.is_default && <div className="w-2 h-2 bg-white" />}
          </button>
          <span className="text-[10px] uppercase font-black tracking-widest text-black/60">Set as default shipping address</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-black/5">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-10 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isPending ? "Processing..." : (initialData ? "Update Address" : "Save Address")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] border border-black hover:bg-black hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={!!toast}
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
