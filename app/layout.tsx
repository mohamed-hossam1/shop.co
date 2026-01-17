import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserProvider } from "@/Context/UserContext";
import { CartProvider } from "@/Context/CartContext";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Cura - Premium Organic Beauty & Personal Care Products",
  description:
    "Discover premium organic beauty products, skincare, and personal care items. Shop authentic, high-quality cosmetics and wellness products online.",
  keywords:
    "organic beauty, skincare, cosmetics, personal care, premium products, natural beauty",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cura.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Cura Store",
    title: "Cura - Premium Organic Beauty & Personal Care Products",
    description:
      "Discover premium organic beauty products, skincare, and personal care items. Shop authentic, high-quality cosmetics and wellness products online.",
    images: [
      {
        url: "/image1.webp",
        width: 1200,
        height: 630,
        alt: "Cura Premium Beauty Products",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cura - Premium Organic Beauty & Personal Care Products",
    description:
      "Discover premium organic beauty products, skincare, and personal care items.",
    images: ["/image1.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd type="Organization" data={organizationJsonLd} />
        <JsonLd type="WebSite" data={websiteJsonLd} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta charSet="utf-8" />
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_APP_URL || "https://cura.com"}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z9WVGNWS7F"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>
        <UserProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Analytics />
            </ThemeProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
