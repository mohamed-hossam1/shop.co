import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Cura",
  description: "Complete your purchase at Cura Store.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
