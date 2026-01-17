/**
 * SEO Configuration for Cura Store
 * This file contains all SEO-related configurations and best practices
 */

export const SEO_CONFIG = {
  // Site Information
  SITE_NAME: "Cura",
  SITE_URL: process.env.NEXT_PUBLIC_APP_URL || "https://cura.com",
  SITE_DESCRIPTION:
    "Discover premium organic beauty products, skincare, and personal care items. Shop authentic, high-quality cosmetics and wellness products online.",

  // Social Media
  SOCIAL_MEDIA: {
    FACEBOOK: "https://www.facebook.com/cura",
    INSTAGRAM: "https://www.instagram.com/cura",
    TWITTER: "https://www.twitter.com/cura",
  },

  // Contact Information
  CONTACT_EMAIL: "support@cura.com",
  PHONE: "+1-800-CURA-BEAUTY", // Update with actual phone

  // Default Image
  DEFAULT_OG_IMAGE: "/image1.webp",

  // Keywords
  DEFAULT_KEYWORDS: [
    "organic beauty",
    "skincare",
    "cosmetics",
    "personal care",
    "premium products",
    "natural beauty",
    "shampoo",
    "conditioner",
    "beauty products online",
  ],

  // Robots Configuration
  ROBOTS_CONFIG: {
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

  // Disallowed paths for robots
  ROBOTS_DISALLOW: [
    "/admin",
    "/api",
    "/checkout",
    "/order-success",
    "/profile",
  ],

  // Allowed paths for robots
  ROBOTS_ALLOW: ["/", "/products", "/sign-in", "/sign-up", "/cart"],

  // Cache Configuration
  REVALIDATE_TIME: {
    DEFAULT: 3600, // 1 hour
    PRODUCTS: 1800, // 30 minutes
    STATIC: 86400, // 24 hours
  },
};
