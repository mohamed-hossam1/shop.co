"use client";

import { useState, useEffect } from "react";
import { addAddress } from "@/actions/addressAction";
import { getCities } from "@/actions/deliveryAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




interface AddressFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();


  const { data: cities = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getCities();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    city: "",
    area: "",
    address_line: "",
  });



  const validatePhone = (phone: string) => {
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const { mutate: addAddressMutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await addAddress(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onSuccess();
    },

    onError: (error: any) => {
      setErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};

    if (!formData.full_name) newErrors.full_name = "Name is required";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.city) newErrors.city = "City is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.address_line) newErrors.address_line = "Address details are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    addAddressMutate(formData as any);
  };


  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 md:mb-4 mt-6">
        <h3 className="text-base md:text-lg font-medium text-gray-900">
          New Address
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-red-600 text-xs md:text-sm cursor-pointer "
          type="button"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Full Name *
            </label>
            <input
              disabled={isPending}
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black text-sm md:text-base bg-transparent ${
                errors.full_name ? "border-red-500" : "border-black"
              }`}
              placeholder="Enter your full name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Phone Number *
            </label>
            <input
              disabled={isPending}
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black text-sm md:text-base bg-transparent ${
                errors.phone ? "border-red-500" : "border-black"
              }`}
              placeholder="01XX XXX XXXX"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              City *
            </label>
            <select
              disabled={isCitiesLoading || isPending}
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black text-sm md:text-base bg-transparent ${
                errors.city ? "border-red-500" : "border-black"
              }`}
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            >
              <option value="">{isCitiesLoading ? "Loading Cities..." : "Select City"}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Area/District *
            </label>
            <input
              disabled={isPending}
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black text-sm md:text-base bg-transparent ${
                errors.area ? "border-red-500" : "border-black"
              }`}
              placeholder="Enter area or district"
              type="text"
              value={formData.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
            {errors.area && (
              <p className="text-red-500 text-xs mt-1">{errors.area}</p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Address Details *
            </label>
            <input
              disabled={isPending}
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black text-sm md:text-base bg-transparent ${
                errors.address_line ? "border-red-500" : "border-black"
              }`}
              placeholder="Street name, building number"
              type="text"
              value={formData.address_line}
              onChange={(e) => handleChange("address_line", e.target.value)}
            />
            {errors.address_line && (
              <p className="text-red-500 text-xs mt-1">{errors.address_line}</p>
            )}
          </div>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 bg-black text-white hover:bg-white hover:text-black border border-black py-4 rounded-none font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[56px]"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving Address...</span>
            </div>
          ) : (
            "Save Address"
          )}
        </button>


      </form>
    </div>
  );
}
