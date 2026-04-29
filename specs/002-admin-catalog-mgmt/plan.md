# Implementation Plan: Admin Catalog Management

**Branch**: `002-admin-catalog-mgmt` | **Date**: 2026-04-29 | **Spec**: [specs/002-admin-catalog-mgmt/spec.md](file:///media/mohamed/mo/shop.co/specs/002-admin-catalog-mgmt/spec.md)
**Input**: User description: "Admin Catalog Management only"

## Summary

The admin catalog management feature provides the ability for store administrators to manage products and categories. This includes viewing paginated product and category lists, creating, editing, and soft-deleting products and categories, and setting merchandising ranks for products. All catalog write operations are restricted to admin users via server-side checks.

## Technical Context

**Language/Version**: TypeScript / React 19 / Next.js 16 (App Router)
**Primary Dependencies**: Supabase Auth/Postgres, Zustand, React Query, Formik, Yup, Radix UI, Tailwind CSS 4
**Storage**: Supabase Postgres (using `products`, `categories`, `product_variants`, `product_images`)
**Testing**: Manual testing through UI (no automated testing framework mentioned)
**Target Platform**: Web Browser
**Project Type**: Web Application
**Performance Goals**: Search in under 5 seconds, form submission to UI update within 10 seconds.
**Constraints**: Must use existing `update_full_product` RPC and `products_with_min_price` view.
**Scale/Scope**: Admin interface capable of managing 500+ products and up to 20 variants per product.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
No specific constitution rules currently defined.

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-catalog-mgmt/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code

```text
app/(admin)/
├── admin/
│   ├── products/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/edit/page.tsx
│   └── categories/
│       ├── page.tsx
│       ├── create/page.tsx
│       └── [id]/edit/page.tsx
components/admin/
├── products/
│   ├── ProductList.tsx
│   ├── ProductForm.tsx
│   └── VariantFields.tsx
└── categories/
    ├── CategoryList.tsx
    └── CategoryForm.tsx
```

**Structure Decision**: Using standard Next.js App Router conventions within the existing `(admin)` route group, adding specific sub-routes for products and categories. Reusable admin components will live in `components/admin/`.

