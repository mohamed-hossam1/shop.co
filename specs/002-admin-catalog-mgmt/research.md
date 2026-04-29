# Research: Admin Catalog Management

**Branch**: `002-admin-catalog-mgmt` | **Date**: 2026-04-29  
**Phase**: 0 — Research

---

## 1. Existing Action Surface

### Decision: Reuse all existing catalog server actions as-is

**Rationale**: All four core product mutations (`createProduct`, `updateFullProduct`, `deleteProduct`) and all category mutations (`createCategory`, `updateCategory`, `deleteCategory`) are already implemented in `actions/productsAction.ts` and `actions/categoriesAction.ts`. Each write action already calls `requireAdmin()` at the top, so server-side guards are in place. All read operations (`getProducts`, `getAllCategories`, `getProductById`) are also ready.

**What is already available**:
| Action | File | Admin-gated? | Revalidates? |
|---|---|---|---|
| `getProducts(filters)` | `productsAction.ts` | No (read) | — |
| `getProductById(id)` | `productsAction.ts` | No (read) | — |
| `createProduct(input)` | `productsAction.ts` | ✅ `requireAdmin()` | ✅ `revalidateCatalogPaths` |
| `updateFullProduct(id, input)` | `productsAction.ts` | ✅ `requireAdmin()` | ✅ `revalidateCatalogPaths` |
| `deleteProduct(id)` | `productsAction.ts` | ✅ `requireAdmin()` | ✅ `revalidateCatalogPaths` |
| `getAllCategories()` | `categoriesAction.ts` | No (read) | — |
| `createCategory(data)` | `categoriesAction.ts` | ✅ `requireAdmin()` | ✅ `revalidateCategoryPaths` |
| `updateCategory(id, data)` | `categoriesAction.ts` | ✅ `requireAdmin()` | ✅ `revalidateCategoryPaths` |
| `deleteCategory(id)` | `categoriesAction.ts` | ✅ `requireAdmin()` | ✅ `revalidateCategoryPaths` |

**Alternatives considered**: Adding new admin-specific action wrappers. Rejected — the existing actions already have all the behavior and guards needed.

---

## 2. Admin UI Foundation

### Decision: Use existing AdminUI primitives and AdminChrome shell

**Rationale**: `components/admin/AdminUI.tsx` already exports `AdminPageHeader`, `AdminCard`, `AdminSection`, `AdminField`, `AdminNotice`, `AdminStatusBadge`, `AdminEmptyState`, `adminInputClassName`, `adminTextareaClassName`, `adminSelectClassName`, and `adminCheckboxClassName`. All product and category screens should use these exclusively.

**Key primitives available**:

- `AdminPageHeader` — page-level header with title, description, and optional action slot
- `AdminSection` — card with title, description, and action slot for table/form containers
- `AdminField` — labeled field wrapper with error and hint support
- `AdminNotice` — toned notice box (neutral/info/success/warning/danger)
- `AdminStatusBadge` — inline status pill
- `AdminEmptyState` — empty-list state with optional action link
- `adminInputClassName` / `adminTextareaClassName` / `adminSelectClassName` / `adminCheckboxClassName` — consistent form element styling

---

## 3. Admin Route and Navigation

### Decision: Routes and nav items are already declared

**Rationale**: `constants/routes.ts` already exports `ADMIN_PRODUCTS: "/admin/products"` and `ADMIN_CATEGORIES: "/admin/categories"`. `lib/admin.ts` already includes both in `ADMIN_NAV_ITEMS`, so they will appear in the sidebar automatically once the pages exist.

**Gap identified**: The `deleteCategory` action does not check for associated products before deleting — the database may reject a foreign key violation. The admin UI must either pre-check product count before offering the delete option, or catch and surface the database error with a friendly message.

---

## 4. TypeScript Contracts

### Decision: Extend existing Product types rather than create new admin-only types

**Rationale**: `types/Product.ts` already defines `Product`, `ProductListItem`, `ProductVariant`, `ProductImage`, `ProductDetails`, `CreateProductInput`, and `Category`. These cover all data needs for catalog admin screens.

**Gap identified**: `ProductListItem` from the `products_with_min_price` view does not include `is_deleted`, making it impossible to show a "Deleted" status badge in the admin product list. Options:

- **Option A** (chosen): Extend `ProductListItem` with an optional `is_deleted?: boolean` field, and update the query to also select from `products` directly when `showDeleted` is needed, or use a joined query.
- **Option B**: Create a separate `AdminProductListItem` type. Rejected for complexity.

**Additional type needed**: `AdminProductFilters` interface for the product list filter state (search, categoryId, isNewArrival, isTopSelling, showDeleted).

---

## 5. Page Architecture Pattern

### Decision: Server Component pages + Client Component forms

**Rationale**: Consistent with the rest of the app (AGENTS.md §2). Product list pages are server-rendered with Suspense. Create/edit forms are client components that call server actions directly via React `useTransition` or form actions. This avoids React Query for write operations since Supabase real-time is not used in this app.

**Page pattern for product list**:

- `app/(admin)/admin/products/page.tsx` — Server Component; reads filters from searchParams; fetches product list server-side
- `components/admin/products/ProductTable.tsx` — Client Component; handles delete confirmation dialog

**Page pattern for product create/edit**:

- `app/(admin)/admin/products/new/page.tsx` — Server Component shell
- `app/(admin)/admin/products/[id]/edit/page.tsx` — Server Component; fetches product + all categories server-side
- `components/admin/products/ProductForm.tsx` — Client Component; manages variant array state and submits via server action

**Page pattern for categories**:

- `app/(admin)/admin/categories/page.tsx` — Server Component; fetches all categories
- `app/(admin)/admin/categories/new/page.tsx` — Server Component shell
- `app/(admin)/admin/categories/[id]/edit/page.tsx` — Server Component; fetches category by id
- `components/admin/categories/CategoryForm.tsx` — Client Component

---

## 6. Form State Management

### Decision: Local React state + useTransition (no Formik/Yup for admin forms)

**Rationale**: Formik/Yup is used in auth forms (`lib/validation/authValidations.ts`) but adding it to admin forms adds overhead without clear benefit. The admin forms have straightforward validation that can be handled inline. `useTransition` wraps server action calls to show pending states without blocking the UI.

**Variant array management**: The product form manages `variants: VariantDraft[]` in local state. Add/remove/update variant rows are plain state mutations. On submit, the array is passed to `createProduct` or `updateFullProduct`.

---

## 7. Slug Normalization

### Decision: Client-side slug normalization in CategoryForm

**Rationale**: The spec requires slugs to be lowercase alphanumeric with hyphens. A helper function `toSlug(input: string): string` converts the title to a slug automatically when the admin types a title (auto-populate) or edits the slug field directly. Uniqueness is enforced at the database level; the UI will surface the database error as a field-level message.

---

## 8. Delete Safety — Category

### Decision: Pre-check product count before showing delete option

**Rationale**: `getProducts({ categoryId })` already exists. Before confirming a category delete, the UI will call this action (or count from the response) to determine if products exist. If count > 0, the delete button is disabled with an explanation. This is cleaner than catching a database FK error.

---

## 9. Revalidation Coverage

### Decision: Existing revalidation helpers are sufficient

**Rationale**: `revalidateCatalogPaths(productId?)` already revalidates `/`, `/products`, `/admin`, `/admin/products`, `/admin/categories`, and the specific product detail page. `revalidateCategoryPaths()` covers the same set. No new revalidation logic is required.

---

## 10. No New Actions Needed

All actions required for this feature already exist. The feature work is entirely new **UI** (pages + components), with zero new server actions required. The only code-level additions needed alongside UI are:

- `AdminProductFilters` type in `types/Admin.ts`
- Optional `is_deleted` field exposure for admin product listing (small query adjustment)
