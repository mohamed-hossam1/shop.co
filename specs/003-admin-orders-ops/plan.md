# Implementation Plan: Admin Orders Operations

**Branch**: `003-admin-orders-ops` | **Date**: 2026-04-30 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/003-admin-orders-ops/spec.md`

---

## Summary

Build the admin orders module at `/admin/orders` and `/admin/orders/[id]`, giving admins a filterable queue of all orders (authenticated + guest) and a detail view with status management. All required server actions (`getAdminOrders`, `getAdminOrderById`, `updateOrderStatus`) are already implemented and admin-gated. The admin shell, UI component system, and route constants are fully established from Phases 1 and 2. This feature is primarily a UI composition task over an existing, complete backend.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16 App Router  
**Primary Dependencies**: React 19, Tailwind CSS 4, Supabase SSR, Headless UI, Lucide React  
**Storage**: Supabase PostgreSQL — `orders` and `order_items` tables  
**Testing**: Manual browser verification against admin test scenarios  
**Target Platform**: Web (desktop-primary admin surface, mobile-navigable)  
**Project Type**: Web application — Next.js App Router monorepo (no separate backend)  
**Performance Goals**: Order list load in < 2 seconds; status save reflects in < 3 seconds  
**Constraints**: No new server actions, no new types, no schema changes — pure UI composition  
**Scale/Scope**: Admin-only surface; expected < 10 concurrent admin users

---

## Constitution Check

The constitution file is a blank template (not yet filled in for this project). Applying AGENTS.md principles:

- ✅ **No new API routes**: Feature uses existing server actions only.
- ✅ **Admin guard preserved**: All new routes will be inside `app/(admin)/admin/`, covered by the admin layout guard. All actions already call `requireAdmin()`.
- ✅ **Revalidation**: `revalidateOrderPaths` already covers `/admin/orders` and `/admin/orders/[id]`. No additional revalidation needed.
- ✅ **Type contracts respected**: `Order`, `OrderItem`, and `AdminOrderFilters` used as-is.
- ✅ **Styling consistency**: All components use the established monochrome Tailwind admin design system.
- ✅ **No complexity violations**: Single route group, no new packages, no new state stores.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-orders-ops/
├── spec.md              ✅ Complete
├── research.md          ✅ Complete
├── data-model.md        ✅ Complete
├── quickstart.md        ✅ Complete
├── plan.md              ← This file
├── checklists/
│   └── requirements.md  ✅ Complete
└── tasks.md             ← Phase 2 output (/speckit-tasks command)
```

### Source Code

```text
app/(admin)/admin/orders/
├── page.tsx                    [NEW] Order list — Server Component
└── [id]/
    └── page.tsx                [NEW] Order detail — Server Component

components/admin/orders/
├── OrderTable.tsx              [NEW] Client: filterable orders table
├── OrderFilterBar.tsx          [NEW] Client: search + filter controls
├── OrderDetail.tsx             [NEW] Client: detail layout wrapper
├── OrderItemsTable.tsx         [NEW] Client: line items table
├── OrderAddressCard.tsx        [NEW] Client: address display card
└── OrderPaymentCard.tsx        [NEW] Client: payment info + proof warning

components/admin/
├── OrderStatusSelect.tsx       [EXISTING — no changes]
├── AdminUI.tsx                 [EXISTING — no changes]
├── AdminChrome.tsx             [EXISTING — no changes]
└── ConfirmDialog.tsx           [EXISTING — no changes]

actions/
└── ordersAction.ts             [EXISTING — no changes]

types/
├── Order.ts                    [EXISTING — no changes]
└── Admin.ts                    [EXISTING — no changes]

lib/
├── admin.ts                    [EXISTING — no changes]
└── admin/revalidate.ts         [EXISTING — no changes]

constants/
└── routes.ts                   [EXISTING — ADMIN_ORDERS already present]
```

---

## Proposed Changes

### A. Order List Page

#### [NEW] `app/(admin)/admin/orders/page.tsx`

A Server Component that:
1. Reads all filter query params from `searchParams` (`search`, `status`, `paymentMethod`, `customerType`, `dateFrom`, `dateTo`)
2. Calls `getAdminOrders(filters)` — admin-gated server action
3. Passes the result and current filters to the `<OrderTable>` client component
4. Wraps content with `AdminPageHeader` (title: "Orders", description: "Manage all customer and guest orders, review fulfillment details, and update order statuses.")
5. Shows `AdminEmptyState` via `OrderTable` when no orders match filters

**Filter param extraction pattern** (mirrors `app/(admin)/admin/products/page.tsx`):
```tsx
const params = await searchParams;
const filters: AdminOrderFilters = {
  search: typeof params.search === "string" ? params.search : undefined,
  status: typeof params.status === "string" ? params.status : undefined,
  paymentMethod: typeof params.paymentMethod === "string" ? params.paymentMethod : undefined,
  customerType: params.customerType === "guest" || params.customerType === "user"
    ? params.customerType : undefined,
  dateFrom: typeof params.dateFrom === "string" ? params.dateFrom : undefined,
  dateTo: typeof params.dateTo === "string" ? params.dateTo : undefined,
};
```

---

### B. Order Detail Page

#### [NEW] `app/(admin)/admin/orders/[id]/page.tsx`

A Server Component that:
1. Parses the `id` route param and validates it is numeric (returns `notFound()` if not)
2. Calls `getAdminOrderById(id)` — admin-gated server action
3. Returns `notFound()` if the action returns `success: false`
4. Renders the order detail using composed client components:
   - `AdminPageHeader` with order ID in title and a "Back to Orders" link
   - `OrderDetail` layout wrapper (receives the full `Order` object with items)
5. Includes `OrderStatusSelect` for status management

---

### C. `OrderTable` Client Component

#### [NEW] `components/admin/orders/OrderTable.tsx`

Responsibilities:
- Renders the filter bar (`OrderFilterBar`) and the orders data table
- Table columns: **#** (order ID), **Customer**, **Date**, **Status**, **Total**, **Payment**, **Actions**
- Customer column: shows `user_name`; appends a "(Guest)" tag (grey `AdminStatusBadge`) when `user_id` is null
- Status column: `AdminStatusBadge` with `getStatusTone(order.status)` tone
- Payment column: formatted payment method label using `formatAdminLabel`
- Total column: formatted currency (EGP)
- Actions column: "View" link to `/admin/orders/[id]`
- Shows `AdminEmptyState` when `orders` array is empty
- Displays row count / truncation notice if result count is at the query cap

**Client-side URL param updates**: When the user changes a filter, the component calls `router.push` with updated search params (same approach as `ProductTable`). This triggers a server re-render with new data.

---

### D. `OrderFilterBar` Client Component

#### [NEW] `components/admin/orders/OrderFilterBar.tsx`

Renders filter controls:
1. **Search input** — debounced text input updating `?search=`
2. **Status select** — options: All, Pending, Confirmed, Shipped, Delivered, Cancelled; updates `?status=`
3. **Payment method select** — options: All, Cash on Delivery, Vodafone Cash, Instapay; updates `?paymentMethod=`
4. **Customer type select** — options: All, Registered, Guest; updates `?customerType=`
5. **Date range** — two `<input type="date">` inputs for `?dateFrom=` and `?dateTo=`
6. **Clear filters** button — resets all params to empty

All filter inputs use `adminInputClassName` / `adminSelectClassName` from `AdminUI.tsx`.

---

### E. `OrderDetail` Client Component

#### [NEW] `components/admin/orders/OrderDetail.tsx`

Layout wrapper for the order detail view. Receives a full `Order` (with `items` array). Composes:

**Top section** — Order summary:
- Order ID, date (`lib/data.ts` formatted), customer type badge
- `OrderStatusSelect` (existing component) for status management

**Cards grid** — Three side-by-side cards (stack on mobile):
1. `OrderItemsTable` — line items
2. `OrderAddressCard` — delivery address
3. `OrderPaymentCard` — payment details

**Totals section**:
- Subtotal, discount amount (with note that promo code string is not stored), delivery fee, **Total**

---

### F. `OrderItemsTable` Sub-Component

#### [NEW] `components/admin/orders/OrderItemsTable.tsx`

Renders `order.items` in a table with columns:
- Product image thumbnail (from `product_image` snapshot)
- Product title + color + size
- Unit price at purchase
- Quantity
- Line total (`price_at_purchase × quantity`)

Shows "No items found" if `items` is empty or undefined (data integrity edge case).

---

### G. `OrderAddressCard` Sub-Component

#### [NEW] `components/admin/orders/OrderAddressCard.tsx`

Renders the delivery address fields using `AdminCard` and `AdminField` pattern:
- Full name (`user_name`)
- Phone (from order — note: phone is stored in `users` table, not `orders`; show "N/A" if unavailable)
- City
- Area
- Address line
- Notes (if present)

> **Note**: The `Order` type does not carry a `phone` field. The phone is on the `users` table. For the admin detail page, display the fields available on the order record. A future enhancement could join the user's phone for registered-user orders.

---

### H. `OrderPaymentCard` Sub-Component

#### [NEW] `components/admin/orders/OrderPaymentCard.tsx`

Renders payment information:
- Payment method (formatted with `formatAdminLabel`)
- Payment image section:
  - If `payment_image` is null/empty: render `AdminNotice` (neutral tone) "No payment proof provided."
  - If `payment_image` is set: render the filename in a read-only field + `AdminNotice` (warning tone) stating the file cannot be retrieved from the dashboard.

---

## Complexity Tracking

No constitution violations. No additional complexity justification required.

---

## Verification Plan

### Manual Verification Scenarios

1. **Access control**: Sign out → navigate to `/admin/orders` → assert redirect to `/sign-in`.
2. **Non-admin access**: Sign in as non-admin user → navigate to `/admin/orders` → assert `AdminAccessDenied` renders.
3. **Order list loads**: Sign in as admin → navigate to `/admin/orders` → assert all orders (including guest orders) appear in the table.
4. **Status filter**: Apply `status=pending` filter → assert only pending orders are visible.
5. **Payment method filter**: Apply `paymentMethod=vodafone_cash` → assert only Vodafone Cash orders shown.
6. **Customer type filter**: Apply `customerType=guest` → assert only guest orders (user_id = null) shown; verify "(Guest)" label appears.
7. **Search by order ID**: Enter a known order ID → assert matching order appears.
8. **Search by customer name**: Enter a partial customer name → assert matching orders appear.
9. **Date range filter**: Set dateFrom + dateTo → assert only orders within range shown.
10. **Empty state**: Apply a filter that matches no orders → assert `AdminEmptyState` renders (no crash).
11. **Order detail navigation**: Click "View" on any order → assert `/admin/orders/[id]` loads with full details.
12. **Order detail contents**: Verify line items table, address card, payment card, and totals all render correctly.
13. **Guest order detail**: View a guest order → assert customer section shows guest name + "(Guest)" indicator; no linked user account shown.
14. **Status update**: Select a new status in `OrderStatusSelect`, click Save → assert status updates in detail and list without full page reload.
15. **Status update error**: (Simulate with a bad network) → assert error message shown; previous status retained in UI.
16. **Legacy status display**: Seed or find an order with a non-standard status string → assert it renders correctly; assert `OrderStatusSelect` prepends it to the dropdown.
17. **Payment proof warning**: View an order with `payment_image` set → assert filename is displayed + warning notice renders.
18. **No payment proof**: View an order without `payment_image` → assert "No payment proof provided" notice renders (no crash).
19. **Empty items**: View an order with no `items` (edge case) → assert "No items found" message renders without crash.
20. **Invalid order ID**: Navigate to `/admin/orders/99999999` → assert `notFound()` behavior (404 page).
