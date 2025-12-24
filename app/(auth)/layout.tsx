import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen from-slate-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Link
                href={ROUTES.HOME}
                className="flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="relative w-28 h-28">
                  <Image
                    src="/cura-logo.webp"
                    alt="Logo"
                    fill
                    sizes="30"
                    loading="eager"
                    style={{ objectFit: "contain" }}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </Link>
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
