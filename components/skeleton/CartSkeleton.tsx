export default function CartSkeleton() {
  return (
    <div className="max-w-[1450px] px-5 m-auto mt-12 animate-pulse">
      <div className="mb-10">
        <div className="h-10 w-64 bg-gray-200 mb-3"></div>
        <div className="h-5 w-32 bg-gray-100"></div>
      </div>

      <div className="md:flex gap-10">
        <div className="flex-[4] mb-10 md:mb-0">
          <div className="flex justify-between mb-6">
            <div className="h-7 w-32 bg-gray-200"></div>
            <div className="h-7 w-24 bg-gray-200"></div>
          </div>

          <div className="border border-black bg-white">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 flex items-center space-x-6 border-b last:border-b-0">
                <div className="w-32 h-32 bg-gray-200 border border-black/5"></div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-6 w-64 bg-gray-200 mb-2"></div>
                      <div className="h-4 w-32 bg-gray-100"></div>
                    </div>

                    <div className="w-6 h-6 bg-gray-200"></div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 border border-black/10"></div>
                      <div className="w-10 h-6 bg-gray-200"></div>
                      <div className="w-10 h-10 bg-gray-200 border border-black/10"></div>
                    </div>

                    <div className="text-right">
                      <div className="h-6 w-32 bg-gray-200 mb-1"></div>
                      <div className="h-4 w-24 bg-gray-100"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[2]">
          <div className="bg-white border border-black p-6 sm:p-8 sticky top-24">
            <div className="h-8 w-48 bg-gray-200 mb-6"></div>

            <div className="mb-8">
              <div className="h-4 w-24 bg-gray-100 mb-3"></div>
              <div className="flex space-x-3">
                <div className="flex-1 h-12 bg-white border border-black"></div>
                <div className="w-24 h-12 bg-black opacity-20"></div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-gray-100"></div>
                <div className="h-5 w-28 bg-gray-200"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-gray-100"></div>
                <div className="h-5 w-32 bg-gray-200"></div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-200"></div>
                  <div className="h-8 w-40 bg-gray-200"></div>
                </div>
              </div>
            </div>

            <div className="h-14 w-full bg-black mb-4 opacity-10"></div>
            <div className="h-14 w-full bg-white border border-black mb-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}