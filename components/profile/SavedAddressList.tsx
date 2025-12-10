import { getAddresses } from "@/app/actions/addressAction";

export default async function SavedAddressList() {
  const addresses = await getAddresses();

  if (!addresses.length) {
    return (
      <div className="text-sm md:text-base text-gray-900 bg-gray-100 px-2 md:px-3 py-1.5 md:py-3 rounded-lg">
        No address provided
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg transition-colors border-gray-300 bg-gray-100
          `}
        >
          <div className="flex items-center flex-1">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">
                {address.phone}
              </p>
              <p className="text-xs md:text-sm text-gray-600 truncate">
                {address.building_number} {address.street}, {address.area},{" "}
                {address.city}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
