import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEO Optimization
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w7.pngwing.com",
      },
      {
        protocol: "https",
        hostname: "soleyorganics.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "botanika-marrakech.com",
      },
      {
        protocol: "https",
        hostname: "sourcebeauty.com",
      },
      {
        protocol: "https",
        hostname: "www.sebamedindia.com",
      },
      {
        protocol: "https",
        hostname: "www.laroche-posay.me",
      },
      {
        protocol: "https",
        hostname: "cosmeticshelf.com",
      },
      {
        protocol: "https",
        hostname: "infinityclinicpharma.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.ulta.com",
        pathname: "/**",
      },
    ],
    // Optimize image formats for better SEO and performance
    formats: ["image/avif", "image/webp"],
  },

  // Redirect trailing slashes for consistency
  trailingSlash: false,

  // Enable SWR (stale-while-revalidate) for better caching
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
