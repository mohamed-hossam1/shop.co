"use client";

import { useState } from "react";
import { deleteAddress } from "@/app/actions/addressAction";

interface SavedAddressListProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (address: Address) => void;
  onAddressDeleted: (addressId:number) => void;
}

export default function SavedAddressList({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressDeleted,
}: SavedAddressListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (addressId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDeletingId(addressId);
    
    try {
      const { error } = await deleteAddress(addressId);
      
      if (error) {
        console.error("Error deleting address:", error);
      } else {
        onAddressDeleted(addressId);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!addresses) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No saved addresses yet</p>
        <p className="text-sm mt-2">Add your first delivery address below</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          onClick={() => onSelectAddress(address)}
          className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedAddressId === address.id
              ? "border-primary bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <div
              className={`w-4 h-4 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 ${
                selectedAddressId === address.id
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              {selectedAddressId === address.id && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E]"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">
                {address.phone}
              </p>
              <p className="text-xs md:text-sm text-gray-600 truncate">
                {address.building_number} {address.street}, {address.area}, {address.city}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => handleDelete(address.id, e)}
            disabled={deletingId === address.id}
            className="ml-2 text-red-500 hover:text-red-700 text-xs md:text-sm px-2 py-1 hover:bg-red-50 self-end md:self-center mt-2 md:mt-0 disabled:opacity-50 cursor-pointer rounded-xl transition-all duration-300"
          >
            {deletingId === address.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}