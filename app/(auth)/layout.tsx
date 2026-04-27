import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-satoshi overflow-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href={ROUTES.HOME} className="inline-block hover:opacity-80 transition-opacity">
          <span className="text-4xl font-integral font-black tracking-widest text-black">
            ELARIS
          </span>
        </Link>
        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to Elaris
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-satoshi">
          Sign in to your account or create a new one to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}
