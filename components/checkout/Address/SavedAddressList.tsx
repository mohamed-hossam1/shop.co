"use client";

import { Address } from "@/types/Address";
import { deleteAddress } from "@/actions/addressAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";


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
  const queryClient = useQueryClient();

  const { mutate: deleteAddressMutate, isPending, variables: deletingId } = useMutation({
    mutationFn: async (addressId: number) => {
      const res = await deleteAddress(addressId);
      if (!res.success) throw new Error(res.message);
      return addressId;
    },
    onSuccess: (addressId) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onAddressDeleted(addressId);
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleDelete = (addressId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAddressMutate(addressId);
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
          className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-none cursor-pointer transition-colors ${
            selectedAddressId === address.id
              ? "border-black bg-[#F0EEED]/40"
              : "border-gray-200 hover:border-black/50 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <div
              className={`w-5 h-5 border mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 ${
                selectedAddressId === address.id
                  ? "border-black bg-black"
                  : "border-black bg-white"
              }`}
            >
              {selectedAddressId === address.id && (
                <div className="w-2.5 h-2.5 bg-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">
                {address.phone}
              </p>
              <p className="text-xs md:text-sm text-gray-600 truncate">
                {address.address_line}, {address.area}, {address.city}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => handleDelete(address.id, e)}
            disabled={isPending && deletingId === address.id}
            className="ml-2 text-red-500 hover:text-red-700 text-xs md:text-sm font-bold uppercase tracking-widest px-2 py-1 self-end md:self-center mt-2 md:mt-0 disabled:opacity-50 cursor-pointer transition-all duration-300"
          >
            {isPending && deletingId === address.id ? "Deleting..." : "Delete"}
          </button>

        </div>
      ))}
    </div>
  );
}
