
export default function AddressStep() {

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-7">Delivery Address</h2>
      <p className="text-lg font-bold mb-3">Saved Addresses</p>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300 hover:bg-gray-50">
        <div className="flex items-center flex-1">
          <div className="w-4 h-4 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 border-gray-300"></div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm md:text-base">
              Mohamed Hossam
            </p>
            <p className="text-xs md:text-sm text-gray-600 truncate">
              23 34لفق, سيب, Cairo
            </p>
            <p className="text-xs md:text-sm text-gray-500">+201013429234</p>
          </div>
        </div>
        <button className="ml-2 text-red-500 hover:text-red-700 text-xs md:text-sm px-2 py-1 rounded hover:bg-red-50 self-end md:self-center mt-2 md:mt-0">
          Delete
        </button>
      </div>
    </div>
  );
}
