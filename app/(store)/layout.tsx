import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar";
import React from "react";



export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />

    </>
  );
}
