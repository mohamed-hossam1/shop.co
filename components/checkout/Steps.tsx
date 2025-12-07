
export default function Steps({number}:{number: number}) {
  return (
    <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-10">
      <div className="flex items-center">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${number==1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} `}>
          1
        </div>
        <span className={`ml-1 md:ml-2 font-medium text-xs md:text-sm ${number==1 ? "text-primary" : "text-gray-500"} `}>
          <span className="hidden sm:inline">Delivery Address</span>
          <span className="sm:hidden">Address</span>
        </span>
        <div className="w-8 md:w-16 h-0.5 ml-2 md:ml-4 bg-gray-200"></div>
      </div>

      <div className="flex items-center">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${number==2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} `}>
          2
        </div>
        <span className={`ml-1 md:ml-2 font-medium text-xs md:text-sm ${number==2 ? "text-primary" : "text-gray-500"} `}>
          <span className="hidden sm:inline">Payment Method</span>
          <span className="sm:hidden">Payment</span>
        </span>
        <div className="w-8 md:w-16 h-0.5 ml-2 md:ml-4 bg-gray-200"></div>
      </div>


      <div className="flex items-center">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${number==3 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} `}>
          3
        </div>
        <span className={`ml-1 md:ml-2 font-medium text-xs md:text-sm ${number==3 ? "text-primary" : "text-gray-500"} `}>
          <span className="hidden sm:inline">Review &amp; Place Order</span>
          <span className="sm:hidden">Review</span>
        </span>
      </div>
    </div>
  );
}
