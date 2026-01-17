# SEO Optimization Guide for Cura Store

## Overview

This document outlines all SEO improvements implemented in the Cura Store project and provides guidance for maintaining and extending these optimizations.

## Implemented SEO Improvements

### 1. Metadata Management

- **Root Layout**: Comprehensive metadata with Open Graph, Twitter Card, and canonical tags
- **Page-Specific Metadata**: Each page has optimized titles, descriptions, and canonical URLs
- **Dynamic Metadata**: Product pages generate metadata dynamically based on content

#### Key Metadata Added:

- `title`: Descriptive, keyword-rich page titles (50-60 characters)
- `description`: Compelling meta descriptions (155-160 characters)
- `keywords`: Relevant keywords for search engines
- `robots`: Control indexing (index/follow for public pages, noindex for auth/checkout)
- `alternates.canonical`: Prevent duplicate content issues
- `openGraph`: Social media sharing optimization
- `twitter`: Twitter Card optimization

### 2. Sitemap Generation

- **File**: `app/sitemap.ts`
- **Updates**: Automatically updates based on routes
- **Submission**: Available at `/sitemap.xml`
- **Includes**:
  - Homepage (priority: 1.0)
  - Products catalog (priority: 0.9)
  - Cart (priority: 0.7)
  - Auth pages (priority: 0.5)

### 3. Robots.txt

- **File**: `app/robots.ts`
- **Available at**: `/robots.txt`
- **Configuration**:
  - Allows: Public-facing pages (home, products, sign-in, sign-up, cart)
  - Disallows: Admin, API, checkout, order-success, profile
  - Sitemap reference included

### 4. Structured Data (JSON-LD)

- **File**: `lib/structured-data.tsx`
- **Includes**:
  - Organization schema for brand information
  - WebSite schema with search action support
  - Product schema ready for implementation
  - BreadcrumbList schema ready for implementation

#### Usage:

```tsx
import { JsonLd, organizationJsonLd } from "@/lib/structured-data";

export default function Component() {
  return (
    <>
      <JsonLd type="Organization" data={organizationJsonLd} />
      {/* Your component */}
    </>
  );
}
```

### 5. Next.js Configuration Optimization

- **Compression**: Enabled for faster loading
- **Security Headers**: Removed powered-by header
- **Source Maps**: Disabled in production
- **Image Optimization**:
  - AVIF and WebP formats enabled
  - Automatic format selection based on browser support
- **Trailing Slash**: Consistent URL structure (no trailing slashes)

### 6. Page-Specific Optimizations

#### Homepage (`app/(store)/page.tsx`)

- Title: "Cura - Premium Organic Beauty & Personal Care Products | Shop Now"
- Description: "Shop premium organic beauty products, skincare, shampoos, and personal care items at Cura..."
- Canonical: "/"
- Open Graph optimized for social sharing

#### Product Listing (`app/(store)/products/page.tsx`)

- Title: "All Products | Cura - Premium Beauty & Personal Care"
- Description: Complete collection overview
- Canonical: "/products"
- Indexed for search visibility

#### Product Detail (`app/(store)/products/[id]/page.tsx`)

- Dynamic metadata generation
- Product-specific canonical URLs
- Open Graph for individual product sharing

#### Authentication Pages (`sign-in`, `sign-up`)

- Meta robots set to `noindex, nofollow` (auth pages)
- Canonical URLs to prevent duplicate indexing
- Clear navigation hints

#### Checkout & Order Pages

- Meta robots set to `noindex, nofollow` (transactional pages)
- Prevents indexing of temporary/user-specific content

### 7. SEO Configuration

- **File**: `lib/seo-config.ts`
- Contains centralized configuration for:
  - Site name and URL
  - Social media links
  - Contact information
  - Default keywords
  - Robots configuration
  - Cache revalidation times

## Best Practices for Ongoing SEO

### Adding New Pages

1. **Import Metadata type**:

```tsx
import type { Metadata } from "next";
```

2. **Add metadata export**:

```tsx
export const metadata: Metadata = {
  title: "Page Title | Cura",
  description: "Compelling description (155-160 chars)",
  keywords: "keyword1, keyword2, keyword3",
  alternates: {
    canonical: "/your-page",
  },
  openGraph: {
    title: "Page Title",
    description: "Description for social media",
    url: "/your-page",
    type: "website",
  },
};
```

3. **For public pages**: Keep `robots` default (index: true, follow: true)
4. **For private pages**: Set `robots: { index: false, follow: false }`

### Image Optimization

All images should use Next.js Image component:

```tsx
import Image from "next/image";

<Image
  src="/path/to/image.webp"
  alt="Descriptive alt text" // Always include!
  width={1200}
  height={630}
  loading="eager" // For above-the-fold content
  // loading="lazy" // For below-the-fold content (default)
/>;
```

### Heading Structure

- Use ONE `<h1>` per page (preferably near the top)
- Follow proper hierarchy: h1 → h2 → h3 → etc.
- Include target keywords naturally

### Link Strategy

- Use descriptive anchor text (avoid "click here")
- Internal links should use Next.js `<Link>` component
- External links should have proper titles

### Performance Tips

1. **Core Web Vitals**:
   - Optimize image sizes
   - Minimize CSS/JS
   - Use lazy loading for below-the-fold content

2. **Caching**:
   - Use `revalidate` in dynamic pages
   - Cache static routes appropriately
   - Leverage ISR (Incremental Static Regeneration)

3. **Mobile Optimization**:
   - Already responsive (verify with mobile testing)
   - Test with Google Mobile-Friendly Test
   - Ensure touch targets are adequate

## Monitoring & Tools

### Tools to Use:

1. **Google Search Console**
   - Monitor search performance
   - Submit sitemap
   - Check for indexing issues
   - View search queries and CTR

2. **Google PageSpeed Insights**
   - Monitor Core Web Vitals
   - Get performance recommendations
   - Track improvements over time

3. **SEMrush / Ahrefs**
   - Keyword research
   - Competitor analysis
   - Backlink analysis

4. **Lighthouse**
   - Built into Chrome DevTools
   - Audit performance, accessibility, SEO

### Regular Maintenance:

1. Update meta descriptions for better CTR
2. Monitor search rankings for target keywords
3. Add fresh content regularly
4. Check for broken links
5. Update structured data as needed
6. Review Core Web Vitals monthly

## Environment Variables Required

Add to `.env.local`:

```env
# SEO Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Google Analytics (already configured)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Future Enhancements

1. **Product Schema Enhancement**:
   - Add price, availability, reviews
   - Include product images
   - Add rating data

2. **Breadcrumb Navigation**:
   - Implement breadcrumb component
   - Add BreadcrumbList schema
   - Improve site navigation clarity

3. **Blog/Content Section**:
   - Create SEO-friendly blog
   - Use Article schema
   - Build topical authority

4. **Hreflang Tags**:
   - Prepare for international expansion
   - Implement language alternates

5. **AMP (Accelerated Mobile Pages)**:
   - Consider for fast mobile experience
   - Improves mobile search rankings

6. **Progressive Web App (PWA)**:
   - Add web app manifest
   - Implement service workers
   - Enable offline functionality

## Troubleshooting

### Pages Not Indexing?

1. Check robots.txt allows the page
2. Verify canonical URL
3. Submit sitemap to Google Search Console
4. Check for noindex directive in metadata

### Poor Core Web Vitals?

1. Optimize image sizes
2. Reduce JavaScript bundle
3. Implement code splitting
4. Use Next.js Image optimization

### Duplicate Content?

1. Verify canonical URLs
2. Check for query parameters
3. Remove duplicate meta tags
4. Review pagination strategy

## Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Web.dev SEO Guides](https://web.dev/lighthouse-seo/)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)

---

**Last Updated**: January 18, 2026
**Maintained By**: Development Team
