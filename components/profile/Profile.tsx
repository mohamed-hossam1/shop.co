"use client"

import { useUser } from "@/Context/UserContext";
import SavedAddressList from "./SavedAddressList";
import ROUTES from "@/constants/routes";
import Link from "next/link";

export default function Profile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userContext = useUser();
  const userData = userContext.user;
  if (userContext.isLoading) return <></>;
  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <div className="space-y-6">
          <div className="w-full space-y-4 md:space-y-6 lg:space-y-8">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-20 md:h-32 bg-primary relative">
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="px-3 md:px-4 lg:px-8 py-4 md:py-6 lg:py-8 relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 md:space-x-6">
                  <div className="relative mb-3 sm:mb-0 -mt-12 md:-mt-20">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-white text-lg md:text-3xl font-bold border-3 md:border-4 border-white shadow-lg">
                      {userData?.name[0]}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {userData?.name}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mb-2 break-all">
                      {userData?.email}
                    </p>
                  </div>

                  <div className="flex space-x-2 md:space-x-3 mt-3 sm:mt-0">
                    <Link
                      href={ROUTES.SETTINGS}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-primary text-white rounded-lg hover:bg-primary-hover cursor-pointer transition-colors text-xs md:text-sm font-medium"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
              <div>
                <label className="block text-lg md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Name
                </label>
                <div className="text-sm md:text-base text-gray-900 bg-gray-100 px-2 md:px-3 py-1.5 md:py-3 rounded-lg">
                  {userData?.name}
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Email
                </label>
                <div className="text-sm md:text-base text-gray-900 bg-gray-100 px-2 md:px-3 py-1.5 md:py-3 rounded-lg ">
                  {userData?.email}
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Phone
                </label>
                <div className="text-sm md:text-base text-gray-900 bg-gray-100 px-2 md:px-3 py-1.5 md:py-3 rounded-lg">
                  {userData?.phone}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Address
                </label>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
