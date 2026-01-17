"use client";

import Script from "next/script";

interface StructuredDataProps {
  type: "Organization" | "WebSite" | "Product" | "BreadcrumbList";
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: StructuredDataProps) {
  return (
    <Script
      id={`json-ld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": type,
          ...data,
        }),
      }}
      strategy="afterInteractive"
    />
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cura",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://cura.com",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://cura.com"}/cura-logo.webp`,
  description: "Premium organic beauty and personal care products",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@cura.com",
  },
  sameAs: [
    "https://www.facebook.com/cura",
    "https://www.instagram.com/cura",
    "https://www.twitter.com/cura",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://cura.com",
  name: "Cura Store",
  description: "Premium organic beauty and personal care products",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "https://cura.com"}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
