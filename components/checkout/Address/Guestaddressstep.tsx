"use client";

import { useState, useEffect } from "react";

interface GuestAddressStepProps {
  guestAddress: {
    name: string;
    phone: string;
    city: string;
    area: string;
    street: string;
    building_number: string;
  };
  onAddressChange: (address: GuestAddressStepProps["guestAddress"]) => void;
}

const egyptCities = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharqia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

export default function GuestAddressStep({
  guestAddress,
  onAddressChange,
}: GuestAddressStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState(guestAddress);

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

    if (field === "street" && !value) {
      newErrors.street = "Street is required";
    }

    if (field === "building_number" && !value) {
      newErrors.building_number = "Building number is required";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Delivery Information</h2>
      <p className="text-sm text-gray-600 mb-7">
        Please provide your contact and delivery details
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Full Name *
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.name ? "border-red-500" : "border-gray-300"
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.phone ? "border-red-500" : "border-gray-300"
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              onBlur={() => handleBlur("city")}
            >
              <option value="">Select City</option>
              {egyptCities.map((city) => (
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.area ? "border-red-500" : "border-gray-300"
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
              Street *
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.street ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter street name"
              type="text"
              value={formData.street}
              onChange={(e) => handleChange("street", e.target.value)}
              onBlur={() => handleBlur("street")}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Building Number *
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.building_number ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Building number"
              type="text"
              value={formData.building_number}
              onChange={(e) => handleChange("building_number", e.target.value)}
              onBlur={() => handleBlur("building_number")}
            />
            {errors.building_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.building_number}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
