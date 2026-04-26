"use client";

import { useState } from "react";
import { Address } from "@/types/Address";
import SavedAddressList from "./SavedAddressList";
import AddressForm from "./AddressForm";

interface AddressStepProps {
  addresses: Address[];
  onAddressSelected: (address: Address|null) => Promise<void>
  onRefresh: () => void;
  selectedAddress: Address | null;
}

export default function AddressStep({
  addresses,
  onAddressSelected,
  onRefresh,
  selectedAddress,
}: AddressStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    selectedAddress?.id || null
  );

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    onAddressSelected(address);
  };

  const handleAddSuccess = () => {
    setShowForm(false);
    onRefresh();
  };

  const handleAddressDeleted = (addressId: number) => {
    setSelectedAddressId(null);
    onAddressSelected(null);
    onRefresh();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-7">Delivery Address</h2>
      {addresses.length != 0 ? (
        <>
          <p className="text-lg font-bold mb-3">Saved Addresses</p>

          <SavedAddressList
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={handleSelectAddress}
            onAddressDeleted={handleAddressDeleted}
          />
        </>
      ) : (
        <></>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-3 md:p-4 border-2 border-dashed border-gray-300 rounded-lg text-primary font-medium hover:border-primary hover:bg-blue-50 transition-colors flex items-center justify-center text-sm md:text-base mt-6 cursor-pointer"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Address
        </button>
      )}

      {showForm && (
        <AddressForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
