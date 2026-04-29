# Data Model: Admin Catalog Management

**Branch**: `002-admin-catalog-mgmt` | **Date**: 2026-04-29  
**Source**: `specs/002-admin-catalog-mgmt/spec.md`

---

## Entities

### Product

Represents a catalog item available for purchase.

| Field              | Type           | Constraints           | Notes                                            |
| ------------------ | -------------- | --------------------- | ------------------------------------------------ |
| `id`               | number         | PK, auto              | —                                                |
| `title`            | string         | required, non-empty   | Storefront display name                          |
| `description`      | string \| null | optional              | Long-form description                            |
| `category_id`      | number \| null | FK → categories.id    | Optional category assignment                     |
| `image_cover`      | string \| null | optional, URL/path    | Cover image shown on product cards               |
| `is_deleted`       | boolean        | default false         | Soft-delete flag; hides from all shopper queries |
| `new_arrival_rank` | number \| null | optional, integer ≥ 1 | Controls position in new-arrivals home section   |
| `top_selling_rank` | number \| null | optional, integer ≥ 1 | Controls position in top-selling home section    |
| `category_rank`    | number \| null | optional, integer ≥ 1 | Controls sort order within category              |
| `created_at`       | string         | auto                  | ISO timestamp                                    |

**State transitions**:

- `is_deleted = false` → active (visible to shoppers)
- `is_deleted = true` → soft-deleted (hidden from shoppers, visible in admin with toggle)
- No restore (un-delete) flow in this phase

---

### Product Variant

A sellable configuration of a product. Every product must have at least one variant.

| Field          | Type           | Constraints           | Notes                                               |
| -------------- | -------------- | --------------------- | --------------------------------------------------- |
| `id`           | number         | PK, auto              | —                                                   |
| `product_id`   | number         | FK → products.id      | Parent product                                      |
| `color`        | string         | required, non-empty   | Display label (not a hex code)                      |
| `size`         | string         | required, non-empty   | Display label                                       |
| `price`        | number         | required, ≥ 0         | Current selling price                               |
| `price_before` | number \| null | optional, ≥ 0         | Original/compare-at price for strikethrough display |
| `stock`        | number         | required, integer ≥ 0 | Available inventory count                           |
| `sku`          | string \| null | optional              | Stock-keeping unit identifier                       |

**Validation rules**:

- At least one variant per product (enforced in form and action)
- `price` must be a non-negative number
- `price_before` when set must be ≥ `price` (soft rule, warn but do not block)
- `stock` must be a non-negative integer

---

### Product Image

An additional gallery image for a product. Zero or more per product.

| Field        | Type   | Constraints         | Notes                      |
| ------------ | ------ | ------------------- | -------------------------- |
| `id`         | number | PK, auto            | —                          |
| `product_id` | number | FK → products.id    | Parent product             |
| `url`        | string | required, non-empty | Image URL or relative path |

**Notes**: Images are stored as URL strings only. No upload pipeline exists in this phase.

---

### Category

A grouping for products used in storefront filtering and navigation.

| Field   | Type           | Constraints                            | Notes               |
| ------- | -------------- | -------------------------------------- | ------------------- |
| `id`    | number         | PK, auto                               | —                   |
| `title` | string         | required, non-empty                    | Display name        |
| `slug`  | string         | required, unique, format: `[a-z0-9-]+` | URL-safe identifier |
| `image` | string \| null | optional, URL/path                     | Category thumbnail  |

**Validation rules**:

- `slug` must be unique across all categories (database-level; surfaced as form error)
- `slug` must contain only lowercase letters, digits, and hyphens
- A category with one or more assigned products cannot be deleted

---

## Admin-Only Type Extensions

### `AdminProductFilters` (new — add to `types/Admin.ts`)

```typescript
export interface AdminProductFilters {
  search?: string; // title ilike filter
  categoryId?: number; // category_id eq filter
  isNewArrival?: boolean; // not-null new_arrival_rank
  isTopSelling?: boolean; // not-null top_selling_rank
  showDeleted?: boolean; // include is_deleted=true rows
}
```

### `ProductListItem` extension note

The existing `ProductListItem` type (from `products_with_min_price` view) does not expose `is_deleted`. For the admin product list, a separate admin-facing list query should join from `products` directly (or use a modified view) so that `is_deleted` is available for the "Deleted" badge. The new field should be typed as `is_deleted?: boolean` on an extended `AdminProductListItem` type:

```typescript
// In types/Product.ts
export type AdminProductListItem = ProductListItem & {
  is_deleted: boolean;
};
```

---

## Relationships

```
categories (1) ──── (0..*) products
products   (1) ──── (1..*) product_variants   [min 1 enforced]
products   (1) ──── (0..*) product_images
```

---

## Data Flow: Product Create

```
Admin fills ProductForm
  → variant rows added/edited in local state
  → gallery URLs added/removed in local state
  → submit triggers createProduct(input: CreateProductInput)
    → requireAdmin() guard
    → insert products row
    → insert product_variants rows
    → insert product_images rows (if any)
    → revalidateCatalogPaths(productId)
  → redirect to /admin/products
```

## Data Flow: Product Edit

```
Admin opens /admin/products/[id]/edit
  → page server-fetches getProductById(id) + getAllCategories()
  → ProductForm pre-populated with current data
  → admin edits fields/variants/images
  → submit triggers updateFullProduct(id, input: CreateProductInput)
    → requireAdmin() guard
    → RPC update_full_product (core fields + variants + images)
    → separate patch for rank fields
    → revalidateCatalogPaths(id)
  → redirect to /admin/products
```

## Data Flow: Product Soft Delete

```
Admin clicks Delete on product row
  → ConfirmDialog shown
  → on confirm: deleteProduct(id)
    → requireAdmin() guard
    → patch products.is_deleted = true
    → revalidateCatalogPaths(id)
  → product table refreshes
```

## Data Flow: Category Delete Safety

```
Admin clicks Delete on category row
  → UI checks: getProducts({ categoryId: id })
    → if products.length > 0: delete disabled, notice shown
    → if products.length === 0: ConfirmDialog shown
  → on confirm: deleteCategory(id)
    → requireAdmin() guard
    → delete categories row
    → revalidateCategoryPaths()
```
