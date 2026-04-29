# Quickstart: Admin Catalog Management

**Branch**: `002-admin-catalog-mgmt` | **Date**: 2026-04-29

This guide walks a developer through understanding and extending the Admin Catalog Management feature once it is implemented.

---

## Prerequisites

- Phase 1 (Admin Foundation) must be complete. The admin shell, `requireAdmin()` guard, `AdminChrome`, and `AdminUI` primitives must already exist.
- A Supabase project with `products`, `product_variants`, `product_images`, `categories`, and `products_with_min_price` view must be running.
- The `update_full_product` RPC must exist in the database.

---

## Key Files

### Pages (Server Components)

| Route | File |
|---|---|
| `/admin/products` | `app/(admin)/admin/products/page.tsx` |
| `/admin/products/new` | `app/(admin)/admin/products/new/page.tsx` |
| `/admin/products/[id]/edit` | `app/(admin)/admin/products/[id]/edit/page.tsx` |
| `/admin/categories` | `app/(admin)/admin/categories/page.tsx` |
| `/admin/categories/new` | `app/(admin)/admin/categories/new/page.tsx` |
| `/admin/categories/[id]/edit` | `app/(admin)/admin/categories/[id]/edit/page.tsx` |

### Client Components

| Component | File |
|---|---|
| Product list + delete | `components/admin/products/ProductTable.tsx` |
| Product create/edit form | `components/admin/products/ProductForm.tsx` |
| Variant row editor | `components/admin/products/VariantEditor.tsx` |
| Gallery URL editor | `components/admin/products/GalleryEditor.tsx` |
| Category list + delete | `components/admin/categories/CategoryTable.tsx` |
| Category create/edit form | `components/admin/categories/CategoryForm.tsx` |
| Shared confirm dialog | `components/admin/ConfirmDialog.tsx` |

### Server Actions (existing — no changes needed)

| Action | File |
|---|---|
| `getProducts(filters)` | `actions/productsAction.ts` |
| `getProductById(id)` | `actions/productsAction.ts` |
| `createProduct(input)` | `actions/productsAction.ts` |
| `updateFullProduct(id, input)` | `actions/productsAction.ts` |
| `deleteProduct(id)` | `actions/productsAction.ts` |
| `getAllCategories()` | `actions/categoriesAction.ts` |
| `getCategoryById(id)` | `actions/categoriesAction.ts` |
| `createCategory(data)` | `actions/categoriesAction.ts` |
| `updateCategory(id, data)` | `actions/categoriesAction.ts` |
| `deleteCategory(id)` | `actions/categoriesAction.ts` |

### Types (minor additions)

| Change | File |
|---|---|
| Add `AdminProductFilters` interface | `types/Admin.ts` |
| Add `AdminProductListItem` type | `types/Product.ts` |

---

## How to Add a New Field to the Product Form

1. Add the field to `CreateProductInput` in `types/Product.ts` if it's not already there.
2. Add the DB column write to `createProduct` and `updateFullProduct` in `actions/productsAction.ts`.
3. Add a new `AdminField` block inside `ProductForm.tsx`.
4. Update the submit handler to include the new field in the input object.
5. Add a validation rule in the `validate()` function inside `ProductForm`.

---

## How to Add a New Category Field

1. Extend the `Category` type in `types/Product.ts`.
2. Update `createCategory` and `updateCategory` to include the new field.
3. Add a new `AdminField` block in `CategoryForm.tsx`.

---

## Slug Helper

The `toSlug` utility (implemented in `CategoryForm.tsx` or extracted to `lib/utils.ts`) converts a string to a valid category slug:

```
"My New Category" → "my-new-category"
"Beauty & Wellness" → "beauty-wellness"
```

Logic: lowercase, replace non-alphanumeric sequences with `-`, trim leading/trailing `-`.

---

## Variant Editor Pattern

`VariantEditor` renders a dynamic list of variant rows. Each row is an index into the `variants` array held in `ProductForm` state. The pattern:

```
ProductForm state: variants = [{ color, size, price, price_before, stock, sku }]
  → VariantEditor receives variants + onChange callback
  → "Add Variant" appends a blank row
  → "Remove" splices the row out
  → any field change calls onChange with updated array
```

---

## Delete Safety Pattern (Categories)

Before enabling the delete button for a category, `CategoryTable` checks `productCounts[category.id] > 0`. This count is computed server-side in the page by calling `getProducts({ categoryId })` for each category — or in a single `getProducts()` call with client-side grouping by `category_id`. If the count is zero, the delete button is active. If > 0, it is visually disabled with a tooltip.

---

## Running Locally

```bash
npm run dev
```

Navigate to `http://localhost:3000/admin/products` (requires an admin-role session).
