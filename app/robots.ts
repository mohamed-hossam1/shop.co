import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cura.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/sign-in", "/sign-up", "/cart"],
        disallow: ["/admin", "/api", "/checkout", "/order-success", "/profile"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
