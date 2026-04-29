# Research: Admin Orders Operations

**Phase**: 0 — Codebase Analysis & Decision Resolution  
**Feature**: `003-admin-orders-ops`  
**Date**: 2026-04-30

---

## 1. Existing Action Surface

### Finding: All required server actions already exist

**Decision**: No new server actions need to be created for this feature.

**Evidence**:

| Action | Location | Status |
|--------|----------|--------|
| `getAdminOrders(filters)` | `actions/ordersAction.ts:301` | ✅ Already implemented |
| `getAdminOrderById(orderId)` | `actions/ordersAction.ts:373` | ✅ Already implemented |
| `updateOrderStatus(orderId, status)` | `actions/ordersAction.ts:399` | ✅ Already implemented |

All three actions:
- Call `requireAdmin()` from `lib/auth/admin.ts` and throw `Unauthorized` if the caller is not admin
- Use the server-side Supabase client (cookie-based session)
- Return `{ success: true, data }` or `{ success: false, message }` consistent with the action contract pattern

**`getAdminOrders` filter support** (all spec filters covered):
- `status` — `eq("status", status)`
- `paymentMethod` — `eq("payment_method", paymentMethod)`
- `customerType` — `is("user_id", null)` for guest, `not("user_id", "is", null)` for registered
- `dateFrom` / `dateTo` — `gte` / `lte` on `created_at`
- `search` — numeric-aware: if search is digits → OR on `id.eq` + `user_name.ilike`; else `user_name.ilike`
- `userId` — filter by specific user ID (used for the Users admin module cross-link, not the main orders filter UI)

**`updateOrderStatus` validation**:
- Uses `isAdminOrderStatus()` from `lib/admin.ts` — validates against `ADMIN_ORDER_STATUSES = ["pending","confirmed","shipped","delivered","cancelled"]`
- Revalidates via `revalidateOrderPaths(orderId)` which hits: `/orders`, `/order-success`, `/admin`, `/admin/orders`, `/admin/orders/[id]`

**Rationale**: Implementing the UI layer around pre-existing, hardened server actions is lower risk than building new action logic.

---

## 2. Shared Component Inventory

### Finding: All admin UI primitives exist and can be used directly

**Decision**: Reuse the existing admin component system entirely.

| Component | File | Used for |
|-----------|------|----------|
| `AdminChrome` | `components/admin/AdminChrome.tsx` | Sidebar + header shell (via layout) |
| `AdminPageHeader` | `components/admin/AdminUI.tsx` | Module title + description + action slot |
| `AdminSection` | `components/admin/AdminUI.tsx` | Card wrapper with title + children |
| `AdminCard` | `components/admin/AdminUI.tsx` | Base card wrapper |
| `AdminField` | `components/admin/AdminUI.tsx` | Form field wrapper with label + error |
| `AdminNotice` | `components/admin/AdminUI.tsx` | Tone-aware notice box (neutral/info/success/warning/danger) |
| `AdminStatusBadge` | `components/admin/AdminUI.tsx` | Inline status chip |
| `AdminEmptyState` | `components/admin/AdminUI.tsx` | Empty state with optional CTA |
| `OrderStatusSelect` | `components/admin/OrderStatusSelect.tsx` | Status dropdown + save button with `useTransition` |
| `ConfirmDialog` | `components/admin/ConfirmDialog.tsx` | Headless UI dialog for destructive actions |

**`OrderStatusSelect` behaviour**:
- When `currentStatus` is not in `ADMIN_ORDER_STATUSES`, prepends it to the list → guarantees legacy statuses render correctly
- Calls `updateOrderStatus` server action, then calls `router.refresh()` on success
- Displays inline save/error message

**Styling system**: All admin components use the existing Tailwind-first monochrome design (black borders, `font-satoshi`, `font-integral` headings, uppercase tracking). Orders module MUST follow the same pattern.

**`getStatusTone(status)`** already maps:
- `delivered` → `success` (green)
- `confirmed` → `info` (sky)  
- `shipped` → `warning` (amber)
- `cancelled` → `danger` (red)
- `pending` / anything else → `neutral`

**Rationale**: Reusing the established design system ensures visual consistency with the catalog management pages and avoids design debt.

---

## 3. Route & Navigation Structure

### Finding: `/admin/orders` is already registered in ROUTES and nav

**Decision**: Follow the products module pattern: `page.tsx` (list) + `[id]/page.tsx` (detail).

**Evidence**:
- `ROUTES.ADMIN_ORDERS = "/admin/orders"` — already in `constants/routes.ts`
- `ADMIN_NAV_ITEMS` in `lib/admin.ts` already includes the Orders nav entry with `ReceiptText` icon
- `revalidateOrderPaths()` already revalidates `/admin/orders` and `/admin/orders/[id]`

**Pattern to follow** (from `app/(admin)/admin/products/`):
```
app/(admin)/admin/products/
  page.tsx          ← Server Component, reads searchParams, fetches, passes to client table
  [id]/
    edit/
      page.tsx      ← Server Component, loads product, renders form
```

**Orders module will use**:
```
app/(admin)/admin/orders/
  page.tsx          ← Server Component, reads searchParams filters, fetches getAdminOrders
  [id]/
    page.tsx        ← Server Component, fetches getAdminOrderById, renders detail view
```

No "new" or "edit" route needed — orders are read-only and status-only mutable.

---

## 4. Filter Implementation Pattern

### Finding: Catalog module uses query-param-driven server-component filtering (no client state)

**Decision**: Use the same server-component + searchParams pattern for the orders filter bar.

**Catalog pattern** (`app/(admin)/admin/products/page.tsx`):
```tsx
const params = await searchParams;
const filters: AdminProductFilters = {
  search: typeof params.search === "string" ? params.search : undefined,
  categoryId: ...
};
const [productsRes] = await Promise.all([getProducts(filters), ...]);
```

Client-side table component (`ProductTable`) handles filter UI updates by pushing query params, causing a server re-render.

**Orders filter params** to extract from `searchParams`:
- `search` (string)
- `status` (string — one of the 5 statuses or undefined for "all")
- `paymentMethod` (string)
- `customerType` (`"guest"` | `"user"` | undefined)
- `dateFrom` (date string)
- `dateTo` (date string)

---

## 5. Detail View: Page vs Drawer

### Finding: Catalog uses dedicated detail pages (not drawers); Headless UI Dialog available

**Decision**: Use a **dedicated detail page** (`/admin/orders/[id]`) consistent with the products pattern. The detail page is a Server Component that fetches `getAdminOrderById` and renders read-only fields plus the `OrderStatusSelect` widget.

**Rationale**: 
- Consistent with the established products route structure
- Server Component can fetch data server-side without client state complexity
- Supports direct linking / bookmarking of order detail URLs
- `router.refresh()` in `OrderStatusSelect` already works correctly with page-based navigation

---

## 6. Type Completeness

### Finding: All necessary types already exist

| Type | File | Fields |
|------|------|--------|
| `Order` | `types/Order.ts` | id, user_id, guest_id, status, subtotal, discount_amount, total_price, payment_method, payment_image, delivery_fee, city, area, address_line, notes, user_name, created_at, items? |
| `OrderItem` | `types/Order.ts` | id, order_id, variant_id, quantity, price_at_purchase, product_title, product_image, variant_color, variant_size |
| `AdminOrderFilters` | `types/Admin.ts` | search, status, paymentMethod, customerType, dateFrom, dateTo, userId |
| `AdminOrderStatus` | `types/Admin.ts` | "pending"\|"confirmed"\|"shipped"\|"delivered"\|"cancelled" |
| `AdminCustomerType` | `types/Admin.ts` | "user"\|"guest" |

**Gap**: The `Order` type does not include a `coupon_code` field — the discount amount is stored on the order but the original coupon code/ID is not denormalized. The detail view should display `discount_amount` and clarify that the original code string is not stored on the order row. This is a data limitation, not a missing feature — document it in the UI.

---

## 7. Pagination Strategy

### Finding: No pagination in the current admin list implementations

**Decision**: Implement client-side limit filtering for v1. Add a URL-param `limit` cap at 100 rows (Supabase default) with a notice when results may be truncated. Full server-side pagination (page/offset) is deferred to a follow-on task to match the existing catalog list pattern.

**Rationale**: Consistent with current products/categories list behavior; avoids over-engineering before scale is proven.

---

## 8. Auth Guard: Layout vs Action Layer

### Finding: Two-layer guard already in place

**Decision**: No new middleware or layout guard changes needed.

**Layer 1 — Middleware** (`middleware.ts:36`): `/admin` prefix is in `protectedRoutes`. Any unauthenticated request is redirected to `/sign-in`.

**Layer 2 — Layout** (`app/(admin)/admin/layout.tsx`): Calls `requireAdmin()` server-side. Non-admin authenticated users get the `AdminAccessDenied` component.

**Layer 3 — Action guard**: `getAdminOrders`, `getAdminOrderById`, and `updateOrderStatus` all call `requireAdmin()` directly, ensuring server actions are protected even if someone calls them outside the admin UI.

---

## 9. Payment Image Limitation

### Finding: `payment_image` stores a filename string, not a URL

**Decision**: Display the value with an `AdminNotice` (warning tone) explaining the limitation.

**Evidence**: `orders.payment_image` is populated via `orderData.payment_image || null` from the checkout form. The checkout flow reads a local file input and stores only the filename string — no upload pipeline exists.

**UI treatment**: In the order detail view, when `payment_image` has a value, render:
- The filename string in a read-only field
- An `AdminNotice` with `tone="warning"` stating: "Payment proof is stored as a filename only. The original file cannot be retrieved from this dashboard."

---

## Summary of Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | No new server actions needed | All 3 required actions already implemented with `requireAdmin()` guard |
| 2 | Reuse all existing admin UI components | Consistency with catalog management; avoids design drift |
| 3 | Dedicated detail page at `/admin/orders/[id]` | Matches products pattern; simpler than drawer for server data |
| 4 | Query-param–driven filter bar | Consistent with products list; no client state complexity |
| 5 | Client-side row limit for v1 pagination | Consistent with existing list behavior; deferred full pagination |
| 6 | `OrderStatusSelect` reused as-is | Already handles legacy status values and optimistic refresh |
| 7 | `AdminNotice` warning for payment image | Prevents operational misunderstanding; existing component available |
