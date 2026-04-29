# Tasks: Admin Catalog Management

**Input**: Design documents from `specs/002-admin-catalog-mgmt/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ui-contracts.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
**Tests**: Not requested — no test tasks generated.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the two TypeScript type additions that ALL user stories depend on, and the shared `ConfirmDialog` component that both delete flows require.

- [ ] T001 Add `AdminProductFilters` interface to `types/Admin.ts` (create file if it doesn't exist)
- [ ] T002 [P] Add `AdminProductListItem` type extending `ProductListItem` with `is_deleted: boolean` to `types/Product.ts`
- [ ] T003 [P] Create shared `ConfirmDialog` client component in `components/admin/ConfirmDialog.tsx` with `open`, `title`, `description`, `confirmLabel`, `confirmTone`, `isPending`, `onConfirm`, `onCancel` props per ui-contracts.md

**Checkpoint**: Types and shared dialog are ready — all feature work can now begin in parallel.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Adjust the existing `getProducts` action so it can return `is_deleted` for admin use. This is the only backend change required and blocks the product list stories.

- [ ] T004 Update `getProducts` in `actions/productsAction.ts` to expose `is_deleted` on results when `showDeleted` flag is present in the filter, and accept `AdminProductFilters` shape (search, categoryId, isNewArrival, isTopSelling, showDeleted) — no new action file needed

**Checkpoint**: Foundation ready — all user story pages and components can now begin.

---

## Phase 3: User Story 1 — Product Listing and Search (Priority: P1) 🎯 MVP

**Goal**: Admin can navigate to `/admin/products`, see a filterable/searchable paginated table of all products, and immediately locate any product by title or category.

**Independent Test**: Navigate to `http://localhost:3000/admin/products` as an admin, observe the product table loaded with live data, type a search term, and confirm only matching rows appear. Toggle category filter. Verify deleted products are hidden by default and visible when \"Show deleted\" is toggled.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create `components/admin/products/ProductTable.tsx` client component — receives `products: AdminProductListItem[]` and `categories: Category[]`; renders table rows with title, category name, cover image thumbnail, min price (`min_price`), stock summary, and `AdminStatusBadge` for deleted status; includes search input, category select, new-arrival checkbox, top-selling checkbox, and show-deleted toggle — all navigate via query params; includes \"Add Product\" button linking to `/admin/products/new`; Edit link per row to `/admin/products/[id]/edit`; Delete button per row opens `ConfirmDialog` and calls `deleteProduct(id)` then `router.refresh()`
- [ ] T006 [US1] Create `app/(admin)/admin/products/page.tsx` server component — reads `search`, `categoryId`, `showDeleted`, `isNewArrival`, `isTopSelling` from `searchParams`; calls `getProducts(filters)` and `getAllCategories()`; renders `AdminPageHeader` with title \"Products\" and \"Add Product\" action link; wraps `ProductTable` in a `Suspense` with skeleton fallback; passes `products` and `categories` as props to `ProductTable`

**Checkpoint**: User Story 1 is independently functional. Admin can list, search, and filter products end-to-end at `/admin/products`.

---

## Phase 4: User Story 2 — Product Create (Priority: P1)

**Goal**: Admin can click \"Add Product\" and fill a form to create a new product with variants, cover image, gallery images, and merchandising ranks; on save, the new product is visible on the storefront.

**Independent Test**: Click \"Add Product\" from `/admin/products`, fill in title, select a category, add one variant (color, size, price, stock), submit — confirm the product appears in the admin list and on the storefront `/products` page within 10 seconds.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Create `components/admin/products/VariantEditor.tsx` client component — receives `variants: VariantDraft[]`, `onChange: (variants: VariantDraft[]) => void`, and `errors?: Record<string, string>`; renders a list of variant rows each with inputs for color, size, SKU, price, price_before, stock; includes \"Add Variant\" button (appends blank row) and \"Remove\" button per row (splices row out); displays per-field inline errors keyed by `variant.[index].[field]`
- [ ] T008 [P] [US2] Create `components/admin/products/GalleryEditor.tsx` client component — receives `urls: string[]` and `onChange: (urls: string[]) => void`; renders a list of URL text inputs; includes \"Add Image\" button (appends empty string) and \"Remove\" button per row
- [ ] T009 [US2] Create `components/admin/products/ProductForm.tsx` client component — manages local state: `title`, `description`, `categoryId`, `imageCover`, `newArrivalRank`, `topSellingRank`, `categoryRank`, `variants: VariantDraft[]`, `galleryUrls: string[]`, `errors`, `isPending`; receives `product?: ProductDetails` (undefined = create mode) and `categories: Category[]`; on create: validates then calls `createProduct(input)` via `useTransition`, redirects to `/admin/products` on success; on edit: calls `updateFullProduct(id, input)` then redirects; validates title non-empty, at least one variant, each variant color/size non-empty and price ≥ 0, rank fields are positive integers when set; uses `AdminField`, `AdminSection`, `adminInputClassName`, `adminTextareaClassName`, `adminSelectClassName` from `components/admin/AdminUI.tsx`; embeds `VariantEditor` and `GalleryEditor`; displays `AdminNotice` on server error
- [ ] T010 [US2] Create `app/(admin)/admin/products/new/page.tsx` server component — calls `getAllCategories()`; renders `AdminPageHeader` with title \"New Product\" and back link to `/admin/products`; renders `ProductForm` with no `product` prop (create mode) and `categories` prop

**Checkpoint**: User Story 2 is independently functional. Admin can create new products including variants and gallery images.

---

## Phase 5: User Story 3 — Product Edit (Priority: P1)

**Goal**: Admin can open a pre-filled edit form for any existing product, modify any field including variant stock and pricing, and save — changes appear on the storefront immediately.

**Independent Test**: Open `/admin/products`, click Edit on an existing product, change a variant price, click Save — confirm the new price is shown on `/products/[id]` after the redirect.

### Implementation for User Story 3

- [ ] T011 [US3] Create `app/(admin)/admin/products/[id]/edit/page.tsx` server component — extracts `id` from `params`; calls `getProductById(id)` and `getAllCategories()` in parallel; if product not found redirects to `/admin/products`; renders `AdminPageHeader` with title \"Edit Product\" and back link; renders `ProductForm` with `product` and `categories` props (edit mode activates `updateFullProduct` on submit)

> **Note**: `ProductForm` (T009) already handles edit mode when `product` prop is defined. No changes to `ProductForm` required for this story.

**Checkpoint**: User Story 3 is independently functional. Admin can edit any existing product's fields, variants, gallery, and ranks.

---

## Phase 6: User Story 4 — Product Soft Delete (Priority: P2)

**Goal**: Admin can soft-delete a product via a confirmation dialog; the product immediately disappears from all shopper-facing pages and is only visible in the admin list under the \"Show deleted\" toggle.

**Independent Test**: On `/admin/products`, click Delete on a product, confirm in the dialog — verify the product is gone from the table, then toggle \"Show deleted\" to see it with a \"Deleted\" badge. Visit its storefront URL and verify a not-found/unavailable state.

> **Note**: `ProductTable` (T005) already implements the delete button + `ConfirmDialog` + `deleteProduct()` call + `router.refresh()`. `ConfirmDialog` (T003) is already built. The existing `deleteProduct` server action is already admin-gated and calls `revalidateCatalogPaths`. No new files are required for this story. Validate end-to-end behavior.

- [ ] T012 [US4] Verify soft-delete end-to-end: confirm `deleteProduct(id)` in `actions/productsAction.ts` sets `is_deleted = true` and calls `revalidateCatalogPaths`; confirm storefront `getProducts` filters `is_deleted = false` so deleted products disappear from `/products` and the home sections; confirm `/products/[id]` page returns not-found when `getProductById` returns null for a deleted product — add null guard and `notFound()` call in `app/(store)/products/[id]/page.tsx` if not already present

**Checkpoint**: User Story 4 is independently functional. Soft-delete is confirmed end-to-end with no shopper visibility of deleted products.

---

## Phase 7: User Story 5 — Category Management (Priority: P2)

**Goal**: Admin can view all categories, create new ones with title/slug/image, edit existing ones, and delete those with no associated products.

**Independent Test**: Navigate to `/admin/categories`, create a new category with title \"Test Cat\" and slug \"test-cat\", verify it appears in the list and in the product category dropdown. Then delete it (no products assigned) and confirm it is removed.

### Implementation for User Story 5

- [ ] T013 [P] [US5] Create `components/admin/categories/CategoryTable.tsx` client component — receives `categories: Category[]` and `productCounts: Record<number, number>`; renders table rows with image thumbnail, title, slug; Edit link per row to `/admin/categories/[id]/edit`; Delete button per row: disabled with tooltip when `productCounts[id] > 0` (uses `AdminNotice` or tooltip explaining products must be removed first), enabled when count === 0 and opens `ConfirmDialog` then calls `deleteCategory(id)` then `router.refresh()`; \"Add Category\" button linking to `/admin/categories/new`
- [ ] T014 [P] [US5] Create `components/admin/categories/CategoryForm.tsx` client component — receives `category?: Category` (undefined = create mode); manages local state: `title`, `slug`, `image`, `slugManuallyEdited: boolean`, `errors`, `isPending`; auto-populates `slug` from `title` using `toSlug(title)` (inline helper: lowercase, replace non-alphanumeric with `-`, trim) while `slugManuallyEdited` is false; stops auto-populate once slug field is manually edited; validates title non-empty, slug non-empty and matches `/^[a-z0-9-]+$/`; on create: calls `createCategory(data)` via `useTransition`, redirects to `/admin/categories`; on edit: calls `updateCategory(id, data)` then redirects; surfaces DB unique-slug error as field-level error on slug input; uses `AdminField`, `adminInputClassName`, `adminSelectClassName` from `components/admin/AdminUI.tsx`
- [ ] T015 [US5] Create `app/(admin)/admin/categories/page.tsx` server component — calls `getAllCategories()`; for each category calls `getProducts({ categoryId: category.id })` and builds `productCounts` map; renders `AdminPageHeader` with title \"Categories\" and \"Add Category\" action link; renders `CategoryTable` with `categories` and `productCounts`
- [ ] T016 [US5] Create `app/(admin)/admin/categories/new/page.tsx` server component — renders `AdminPageHeader` with title \"New Category\" and back link to `/admin/categories`; renders `CategoryForm` with no `category` prop (create mode)
- [ ] T017 [US5] Create `app/(admin)/admin/categories/[id]/edit/page.tsx` server component — extracts `id` from `params`; calls `getCategoryById(id)`; if not found redirects to `/admin/categories`; renders `AdminPageHeader` with title \"Edit Category\" and back link; renders `CategoryForm` with `category` prop (edit mode)

**Checkpoint**: User Story 5 is independently functional. Admin can manage the full category lifecycle.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that span multiple user stories — navigation wiring, empty states, error boundaries, and quickstart validation.

- [ ] T018 [P] Verify that `/admin/products` and `/admin/categories` links are active and highlighted correctly in the admin sidebar nav (`lib/admin.ts` nav items already exist; confirm active-route highlighting in `app/(admin)/admin/layout.tsx` or the nav component)
- [ ] T019 [P] Add `AdminEmptyState` to `ProductTable` (T005) when the fetched products list is empty, with a prompt to create the first product linking to `/admin/products/new`
- [ ] T020 [P] Add `AdminEmptyState` to `CategoryTable` (T013) when the fetched categories list is empty, with a prompt to create the first category linking to `/admin/categories/new`
- [ ] T021 Validate all storefront revalidation paths: after a product create/edit/delete confirm that `/`, `/products`, and `/products/[id]` reflect changes within 10 seconds in the running dev server (manual spot-check per quickstart.md)
- [ ] T022 Run quickstart.md end-to-end validation: sign in as admin, create a product, edit it, soft-delete it, create a category, assign a product, attempt to delete the assigned category (expect error), delete the category after unassigning

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T001/T002/T003 are all parallelizable
- **Phase 2 (Foundational)**: Depends on T001 (AdminProductFilters type) — blocks Phase 3 and 6
- **Phase 3 (US1 — Product List)**: Depends on Phase 2; T005 and T006 can run in parallel with each other
- **Phase 4 (US2 — Product Create)**: Depends on Phase 2; T007 and T008 can run in parallel; T009 depends on T007+T008; T010 depends on T009
- **Phase 5 (US3 — Product Edit)**: Depends on T009 (ProductForm with edit mode built-in); T011 is a single task
- **Phase 6 (US4 — Soft Delete)**: Depends on T005 (ProductTable with delete flow) and T003 (ConfirmDialog); T012 is a verification task
- **Phase 7 (US5 — Category Management)**: Depends on T003 (ConfirmDialog); T013/T014 can run in parallel; T015/T016/T017 each depend on T013+T014
- **Phase 8 (Polish)**: Depends on all prior user story phases

### User Story Dependencies

| Story | Depends On | Parallelizable With |
|---|---|---|
| US1 (Product List) | Phase 1 + Phase 2 | US2, US5 |
| US2 (Product Create) | Phase 1 + Phase 2 | US1, US5 |
| US3 (Product Edit) | US2 (T009 ProductForm) | US1, US5 |
| US4 (Soft Delete) | US1 (T005 ProductTable) | US5 |
| US5 (Category Mgmt) | Phase 1 (T003 ConfirmDialog) | US1, US2 |

### Parallel Opportunities

```bash
# Phase 1 — all three tasks in parallel:
T001: Add AdminProductFilters to types/Admin.ts
T002: Add AdminProductListItem to types/Product.ts
T003: Create components/admin/ConfirmDialog.tsx

# Phase 4 (US2) — parallel sub-tasks:
T007: Create VariantEditor.tsx
T008: Create GalleryEditor.tsx

# Phase 7 (US5) — parallel sub-tasks:
T013: Create CategoryTable.tsx
T014: Create CategoryForm.tsx

# Phase 8 — all polish tasks parallelizable:
T018, T019, T020 can run simultaneously
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001, T002, T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: US1 — Product List (T005, T006)
4. **STOP AND VALIDATE**: Admin can list, search, and filter products
5. Complete Phase 4: US2 — Product Create (T007–T010)
6. **STOP AND VALIDATE**: Admin can create new products with variants
7. Deploy/demo the MVP catalog read + write surface

### Incremental Delivery

1. Setup + Foundational → Types and shared dialog ready
2. US1 Product List → Admin can browse and search the catalog
3. US2 Product Create → Admin can add new products
4. US3 Product Edit → Admin can update any product (low effort — reuses ProductForm)
5. US4 Soft Delete → Admin can remove products safely (no new files — validation only)
6. US5 Category Management → Admin can manage categories and product groupings
7. Polish → Nav wiring, empty states, revalidation spot-check

---

## Notes

- **No new server actions**: All required actions already exist and are admin-gated. Feature work is 100% UI.
- **`[P]`** tasks operate on different files and have no incomplete task dependencies — safe to run concurrently.
- **`[Story]`** label maps each task to a specific user story for independent traceability.
- US3 (Edit) adds nearly zero new code — `ProductForm` (T009) handles both create and edit mode via the `product?` prop.
- US4 (Soft Delete) is a verification task — the delete mechanism is already built into `ProductTable` (T005).
- Commit after each checkpoint to preserve working increments.
