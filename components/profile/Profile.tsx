"use client";

import { useUser } from "@/stores/userStore";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { User, MapPin, Settings, ShieldCheck } from "lucide-react";

export default function Profile({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user: userData, isLoading } = useUser();

  if (isLoading) return null;

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 font-satoshi">
        <p className="text-xl font-black uppercase tracking-widest mb-6 text-black/20">Access Denied</p>
        <Link 
          href={ROUTES.SIGNIN}
          className="px-12 py-5 bg-black text-white font-black text-xs uppercase tracking-[0.3em] border border-black hover:bg-white hover:text-black transition-all"
        >
          Login Required
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white font-satoshi">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black flex items-center justify-center text-white text-3xl sm:text-4xl font-black font-integral border border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                {userData?.name?.[0] ?? "U"}
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-integral font-black tracking-wider uppercase text-black">
                  {userData?.name}
                </h1>
                <p className="text-black/40 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mt-1">
                  Verified Member
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="/profile/settings"
              className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] border border-black hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        <div className="grid gap-20">
          <div className="grid md:grid-cols-2 gap-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-black pb-4">
                <User className="w-5 h-5 text-black" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Contact Details</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black text-black/30 tracking-widest">Email Address</span>
                  <p className="text-lg font-bold text-black lowercase">{userData?.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black text-black/30 tracking-widest">Phone Number</span>
                  <p className="text-lg font-bold text-black tracking-widest">{userData?.phone || "Not Set"}</p>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4 border-b border-black pb-4">
                <ShieldCheck className="w-5 h-5 text-black" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Account Security</h3>
              </div>
              <div className="bg-black/5 p-6 border border-black/5 group hover:border-black transition-all">
                <p className="text-xs font-bold text-black/60 uppercase tracking-widest leading-relaxed">
                  Your account is protected with standard encryption. Manage your password and security settings in the dashboard.
                </p>
                <Link href="/profile/settings" className="inline-block mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:opacity-50 transition-all">
                  Update Password
                </Link>
              </div>
            </section>
          </div>

          <section className="space-y-10">
            <div className="flex items-center justify-between border-b border-black pb-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-black" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Stored Addresses</h3>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
