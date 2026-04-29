# UI Contracts: Admin Catalog Management

**Branch**: `002-admin-catalog-mgmt` | **Date**: 2026-04-29

This document defines the interface contracts between admin pages (Server Components) and their child client components. It specifies what props each client component receives, what server actions it calls, and what navigation it triggers on success/error.

---

## Products Module

### `ProductTable` (Client Component)

**Location**: `components/admin/products/ProductTable.tsx`

**Receives from page**:
```typescript
props: {
  products: AdminProductListItem[];   // pre-fetched server-side
  categories: Category[];            // for category name lookup
}
```

**User interactions**:
| Action | Triggers |
|---|---|
| Click product title/edit | Navigate to `/admin/products/[id]/edit` |
| Click "Add Product" | Navigate to `/admin/products/new` |
| Click "Delete" | Opens `ConfirmDialog` |
| Confirm delete | Calls `deleteProduct(id)` → reloads page via router.refresh() |
| Toggle "Show deleted" | Navigates to same page with `?showDeleted=true/false` |
| Search / filter | Navigates to same page with updated query params |

**Server actions called**: `deleteProduct(id: number)`

---

### `ProductForm` (Client Component)

**Location**: `components/admin/products/ProductForm.tsx`

**Receives from page**:
```typescript
props: {
  product?: ProductDetails;      // undefined = create mode, defined = edit mode
  categories: Category[];        // for category dropdown
}
```

**Internal state**:
```typescript
{
  title: string;
  description: string;
  categoryId: number | "";
  imageCover: string;
  newArrivalRank: string;        // string for input, parsed to number|null on submit
  topSellingRank: string;
  categoryRank: string;
  variants: VariantDraft[];      // local variant row list
  galleryUrls: string[];         // local gallery URL list
  errors: Record<string, string>;
  isPending: boolean;
}
```

**On submit (create mode)**: calls `createProduct(input: CreateProductInput)` → redirect to `/admin/products`  
**On submit (edit mode)**: calls `updateFullProduct(id, input: CreateProductInput)` → redirect to `/admin/products`  
**On error**: sets `errors` state, form remains populated

**Validation before submit**:
- `title` non-empty
- At least one variant row
- Each variant: `color` non-empty, `size` non-empty, `price` ≥ 0
- `newArrivalRank`, `topSellingRank`, `categoryRank` if set must be positive integers

---

### `VariantEditor` (sub-component of ProductForm)

**Location**: `components/admin/products/VariantEditor.tsx`

**Receives**:
```typescript
props: {
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
  errors?: Record<string, string>;  // keyed by "variant.[index].[field]"
}
```

**Operations**: add row, update row field, remove row

---

### `GalleryEditor` (sub-component of ProductForm)

**Location**: `components/admin/products/GalleryEditor.tsx`

**Receives**:
```typescript
props: {
  urls: string[];
  onChange: (urls: string[]) => void;
}
```

**Operations**: add URL field, update URL field, remove URL field

---

## Categories Module

### `CategoryTable` (Client Component)

**Location**: `components/admin/categories/CategoryTable.tsx`

**Receives from page**:
```typescript
props: {
  categories: Category[];              // pre-fetched
  productCounts: Record<number, number>; // categoryId → product count
}
```

**User interactions**:
| Action | Triggers |
|---|---|
| Click category title/edit | Navigate to `/admin/categories/[id]/edit` |
| Click "Add Category" | Navigate to `/admin/categories/new` |
| Click "Delete" (count > 0) | Delete button disabled, tooltip explains |
| Click "Delete" (count === 0) | Opens `ConfirmDialog` |
| Confirm delete | Calls `deleteCategory(id)` → router.refresh() |

**Server actions called**: `deleteCategory(id: number)`

---

### `CategoryForm` (Client Component)

**Location**: `components/admin/categories/CategoryForm.tsx`

**Receives from page**:
```typescript
props: {
  category?: Category;   // undefined = create mode, defined = edit mode
}
```

**Slug auto-populate**: When admin types in the title field and the slug field has not been manually edited, the slug is auto-populated using `toSlug(title)`. Once the admin manually edits the slug, auto-population stops.

**Validation before submit**:
- `title` non-empty
- `slug` non-empty, matches `/^[a-z0-9-]+$/`
- `image` if provided must be a non-empty string (no URL format enforcement in v1)

**On submit (create mode)**: calls `createCategory(data)` → redirect to `/admin/categories`  
**On submit (edit mode)**: calls `updateCategory(id, data)` → redirect to `/admin/categories`  
**On DB unique-slug error**: surface as field-level error on slug field

---

## Shared: `ConfirmDialog` (Client Component)

**Location**: `components/admin/ConfirmDialog.tsx`

**Receives**:
```typescript
props: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;       // default: "Delete"
  confirmTone?: "danger" | "neutral";  // default: "danger"
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Behavior**: Modal dialog with a backdrop. Cancel closes without action. Confirm calls `onConfirm` and disables both buttons while `isPending` is true.

---

## Shared: `AdminPagination` (Client Component) — deferred

Pagination for the product list is deferred to a follow-up iteration. Initial implementation fetches all products (up to ~500) and renders the full table. Client-side search/filter navigation updates query params, and the server re-fetches with filters applied.
