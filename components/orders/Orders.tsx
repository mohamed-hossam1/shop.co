export default function Orders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-white min-h-screen font-satoshi">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-integral font-black tracking-wider uppercase text-black mb-4">
            My Orders
          </h1>
          <div className="h-1.5 w-24 bg-black" />
          <p className="text-black/50 mt-4 uppercase tracking-[0.2em] text-xs sm:text-sm font-medium">
            Track and manage your recent purchases
          </p>
        </div>

        <div className="grid gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}
