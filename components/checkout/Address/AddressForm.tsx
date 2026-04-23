"use client";

import { useState } from "react";
import { addAddress } from "@/actions/addressAction";

interface AddressFormProps {
  onSuccess: () => void;
  onCancel: () => void;
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

export default function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    area: "",
    street: "",
    building_number: "",
  });

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.city) newErrors.city = "City is required";
    if (!formData.area) newErrors.area = "Area is required";
    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.building_number) newErrors.building_number = "Building number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await addAddress(formData);
      
      if (error) {
        setErrors({ submit: error.message });
      } else {
        onSuccess();
      }
    } catch (error) {
      setErrors({ submit: "Failed to add address" });
    } finally {
      setIsLoading(false);
    }
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
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
            />
            {errors.area && (
              <p className="text-red-500 text-xs mt-1">{errors.area}</p>
            )}
          </div>

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
            />
            {errors.building_number && (
              <p className="text-red-500 text-xs mt-1">{errors.building_number}</p>
            )}
          </div>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] hover:from-[#14274E] hover:to-[#394867]  text-white py-3 rounded-lg font-medium  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
}
