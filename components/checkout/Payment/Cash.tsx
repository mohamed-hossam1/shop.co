
export default function Cash() {
  return (
    <div className="flex-1 flex min-w-0">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm md:text-base">
          Cash on Delivery
        </p>
        <p className="text-xs md:text-sm text-gray-600 truncate">
          Pay when your order is delivered
        </p>
      </div>
    </div>
  );
}
