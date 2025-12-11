
export default function Orders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <div className="space-y-6">

          {children}
          
        </div>
      </div>
    </div>
  );
}
