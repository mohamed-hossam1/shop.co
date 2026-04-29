import Navbar from "@/components/navbar";
import React from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}
