import Navbar from "@/components/navbar";
import Sidebar from "@/components/profile/Sidebar";
import React from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        {children}
      </div>
    </>
  );
}
