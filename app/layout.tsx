import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { StateProvider } from "@/providers/state-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "ELARIS - Exquisite Premium Fashion & Lifestyle",
  description:
    "Step into the world of Elaris, where premium fashion meets timeless elegance. Explore our curated collection of high-quality apparel and accessories.",
  keywords:
    "premium fashion, luxury clothing, elegant apparel, boutique store, lifestyle essentials",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://elaris.com"),
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-satoshi">
        <StateProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </StateProvider>
      </body>
    </html>
  );
}
