"use client";

import { useState, useEffect } from "react";
import { getCities } from "@/actions/deliveryAction";
import { useQuery } from "@tanstack/react-query";



interface GuestAddressStepProps {
  guestAddress: {
    name: string;
    phone: string;
    city: string;
    area: string;
    address_line: string;
  };
  onAddressChange: (address: GuestAddressStepProps["guestAddress"]) => void;
}

export default function GuestAddressStep({
  guestAddress,
  onAddressChange,
}: GuestAddressStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState(guestAddress);

  const { data: cities = [], isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getCities();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  useEffect(() => {
    setFormData(guestAddress);
  }, [guestAddress]);




  const validatePhone = (phone: string) => {
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validate and update parent
    const newErrors: { [key: string]: string } = {};

    if (field === "name" && !value) {
      newErrors.name = "Name is required";
    }

    if (field === "phone") {
      if (!value) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(value)) {
        newErrors.phone =
          "Invalid phone number (must be 11 digits starting with 010, 011, 012, or 015)";
      }
    }

    if (Object.keys(newErrors).length === 0) {
      onAddressChange(newFormData);
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const handleBlur = (field: string) => {
    const newErrors: { [key: string]: string } = {};
    const value = formData[field as keyof typeof formData];

    if (field === "name" && !value) {
      newErrors.name = "Name is required";
    }

    if (field === "phone") {
      if (!value) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(value)) {
        newErrors.phone = "Invalid phone number";
      }
    }

    if (field === "city" && !value) {
      newErrors.city = "City is required";
    }

    if (field === "area" && !value) {
      newErrors.area = "Area is required";
    }

    if (field === "address_line" && !value) {
      newErrors.address_line = "Address is required";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Full Name *
            </label>
            <input
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black transition-colors text-sm md:text-base bg-transparent ${
                errors.name ? "border-red-500" : "border-black"
              }`}
              placeholder="Enter your full name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Phone Number *
            </label>
            <input
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black transition-colors text-sm md:text-base bg-transparent ${
                errors.phone ? "border-red-500" : "border-black"
              }`}
              placeholder="01XX XXX XXXX"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              City *
            </label>
            <select
              disabled={isCitiesLoading}
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black transition-colors text-sm md:text-base bg-transparent ${
                errors.city ? "border-red-500" : "border-black"
              }`}
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
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
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black transition-colors text-sm md:text-base bg-transparent ${
                errors.area ? "border-red-500" : "border-black"
              }`}
              placeholder="Enter area or district"
              type="text"
              value={formData.area}
              onChange={(e) => handleChange("area", e.target.value)}
              onBlur={() => handleBlur("area")}
            />
            {errors.area && (
              <p className="text-red-500 text-xs mt-1">{errors.area}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Address Details *
            </label>
            <input
              className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:border-black transition-colors text-sm md:text-base bg-transparent ${
                errors.address_line ? "border-red-500" : "border-black"
              }`}
              placeholder="Street name, building number"
              type="text"
              value={formData.address_line}
              onChange={(e) => handleChange("address_line", e.target.value)}
              onBlur={() => handleBlur("address_line")}
            />
            {errors.address_line && (
              <p className="text-red-500 text-xs mt-1">{errors.address_line}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
