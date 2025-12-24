export default function CartSkeleton() {
  return (
    <div className="max-w-[1450px] px-5 m-auto mt-12">
      <div className="mb-10">
        <div className="h-9 w-48 bg-gray-200 animate-pulse rounded-lg mb-3"></div>
        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="md:flex gap-10">
        <div className="flex-[4] mb-10 md:mb-0">
          <div className="flex justify-between mb-6">
            <div className="h-7 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-7 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>

          <div className="border shadow-xl rounded-xl">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 flex items-center space-x-4 border-b last:border-b-0">
                <div className="w-26 h-26 bg-gray-200 animate-pulse rounded-lg"></div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                      <div className="w-8 h-6 bg-gray-200 animate-pulse rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>

                    <div className="text-right">
                      <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[2]">
          <div className="bg-white rounded-lg md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 sticky top-24">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4"></div>

            <div className="mb-6">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-6 w-28 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>

            <div className="h-12 w-full bg-gray-200 animate-pulse rounded-xl mb-4"></div>

            <div className="h-5 w-36 bg-gray-200 animate-pulse rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}