# Tasks: Admin Orders Operations

**Input**: Design documents from `specs/003-admin-orders-ops/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
**Tests**: Not requested — no test tasks included.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites and scaffold the output directory for the orders admin module.

- [x] T001 Verify all prerequisites are satisfied: confirm `components/admin/AdminUI.tsx`, `components/admin/OrderStatusSelect.tsx`, `components/admin/ConfirmDialog.tsx`, `app/(admin)/admin/layout.tsx`, and `actions/ordersAction.ts` (with `getAdminOrders`, `getAdminOrderById`, `updateOrderStatus`) all exist
- [x] T002 Create the route directory `app/(admin)/admin/orders/` and the sub-directory `app/(admin)/admin/orders/[id]/`
- [x] T003 Create the component directory `components/admin/orders/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the two Server Component page shells that all client components will be composed into. These pages must exist before any client-side component work can be wired together.

⚠️ **CRITICAL**: No user story implementation work can begin until this phase is complete.

- [x] T004 Create the order list page shell at `app/(admin)/admin/orders/page.tsx` — Server Component that reads all filter query params (`search`, `status`, `paymentMethod`, `customerType`, `dateFrom`, `dateTo`) from `searchParams`, maps them to an `AdminOrderFilters` object using the type-safe extraction pattern from `plan.md` (Section A), calls `getAdminOrders(filters)` from `actions/ordersAction.ts`, and renders `AdminPageHeader` (title "Orders", description "Manage all customer and guest orders, review fulfillment details, and update order statuses.") with a placeholder where `<OrderTable>` will be rendered once that component exists
- [x] T005 Create the order detail page shell at `app/(admin)/admin/orders/[id]/page.tsx` — Server Component that parses the `id` route param, validates it is numeric (calls `notFound()` if not), calls `getAdminOrderById(id)` from `actions/ordersAction.ts`, calls `notFound()` if `success: false`, and renders `AdminPageHeader` (title "Order #[id]") with a "Back to Orders" link to `ROUTES.ADMIN_ORDERS` and a placeholder where `<OrderDetail>` will be rendered

**Checkpoint**: Both page shells compile and are accessible. Admin navigating to `/admin/orders` and `/admin/orders/[id]` sees page headers without runtime errors.

---

## Phase 3: User Story 1 — View All Orders Queue (Priority: P1) 🎯 MVP

**Goal**: A signed-in admin can navigate to `/admin/orders` and see all orders (authenticated + guest) in a filterable table with correct column data.

**Independent Test**: Sign in as admin → navigate to `/admin/orders` → confirm the table renders with all columns (Order ID, Customer, Date, Status, Total, Payment Method) → confirm both registered-user and guest orders appear → confirm applying the status filter to "pending" hides non-pending orders → confirm the empty state renders when a non-matching filter is applied.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `components/admin/orders/OrderFilterBar.tsx` — `"use client"` component that renders six filter controls: (1) a debounced text input updating `?search=`, (2) a `<select>` for status (All / Pending / Confirmed / Shipped / Delivered / Cancelled) updating `?status=`, (3) a `<select>` for payment method (All / Cash on Delivery / Vodafone Cash / Instapay) updating `?paymentMethod=`, (4) a `<select>` for customer type (All / Registered / Guest) updating `?customerType=`, (5) two `<input type="date">` inputs for `?dateFrom=` and `?dateTo=`, and (6) a "Clear filters" button that resets all params; all inputs use `adminInputClassName` / `adminSelectClassName` from `AdminUI.tsx`; filter changes call `router.push` with updated `URLSearchParams` to trigger a server re-render
- [x] T007 [US1] Create `components/admin/orders/OrderTable.tsx` — `"use client"` component that accepts `orders: Order[]` and current filter values as props, renders `<OrderFilterBar>` at the top, then renders a data table with columns: **#** (order ID), **Customer** (`user_name` + grey `AdminStatusBadge` "(Guest)" when `user_id` is null), **Date** (formatted via `lib/data.ts`), **Status** (`AdminStatusBadge` with `getStatusTone(order.status)` tone), **Total** (EGP formatted), **Payment** (`formatAdminLabel(order.payment_method)` from `lib/admin.ts`), **Actions** ("View" link to `/admin/orders/[id]`); shows `AdminEmptyState` when `orders` is empty; displays a truncation notice if result count reaches the query cap (e.g., 100 rows); depends on T006 (`OrderFilterBar` must exist)
- [x] T008 [US1] Wire `<OrderTable>` into `app/(admin)/admin/orders/page.tsx` — replace the placeholder with `<OrderTable orders={orders} />` passing the fetched orders array and current filter values; confirm the page compiles and renders the table with live data from `getAdminOrders`

**Checkpoint**: User Story 1 fully functional. Admin can view all orders in the table, apply any filter, see the guest badge, and see the empty state.

---

## Phase 4: User Story 2 — Inspect Order Details (Priority: P1)

**Goal**: An admin can click an order row and navigate to `/admin/orders/[id]` to view all order details: line items, address, totals, and payment information.

**Independent Test**: Click any order row → confirm the detail page loads → verify line items table (title, image, color, size, qty, price, line total), address card (name, city, area, address line, notes), payment card (method label, payment proof warning or "no proof" notice), and totals section (subtotal, discount, delivery fee, grand total) all render correctly for both guest and registered-user orders.

### Implementation for User Story 2

- [x] T009 [P] [US2] Create `components/admin/orders/OrderItemsTable.tsx` — `"use client"` component that accepts `items: OrderItem[] | undefined` and renders a table with columns: product image thumbnail (from `product_image` snapshot, sized ~48×48px), Product (title + `variant_color` + `variant_size`), Unit Price (`price_at_purchase` in EGP), Qty (`quantity`), Line Total (`price_at_purchase × quantity` in EGP); shows "No items found." message if `items` is empty or undefined (data integrity edge case)
- [x] T010 [P] [US2] Create `components/admin/orders/OrderAddressCard.tsx` — `"use client"` component that accepts an `order: Order` and renders an `AdminCard` with `AdminField` rows for: Full Name (`user_name`), City (`city`), Area (`area`), Address (`address_line`), Notes (`notes || "—"`); note that phone is not stored on the order record — omit or display "N/A" for phone as documented in `plan.md` Section G
- [x] T011 [P] [US2] Create `components/admin/orders/OrderPaymentCard.tsx` — `"use client"` component that accepts an `order: Order` and renders an `AdminCard` showing the payment method label via `formatAdminLabel(order.payment_method)`; if `order.payment_image` is falsy renders an `AdminNotice` with `tone="neutral"` stating "No payment proof provided."; if `order.payment_image` is truthy renders the filename in a read-only field and an `AdminNotice` with `tone="warning"` stating "Payment proof is stored as a filename only. The original file cannot be retrieved from this dashboard." (per `quickstart.md` Payment Image Warning section)
- [x] T012 [US2] Create `components/admin/orders/OrderDetail.tsx` — `"use client"` component that accepts `order: Order` (with `items` array) and composes the full detail layout: (1) Top section with order ID, formatted date, customer type badge, and `<OrderStatusSelect orderId={order.id} currentStatus={order.status} />` for status management; (2) A responsive card grid with `<OrderItemsTable items={order.items} />`, `<OrderAddressCard order={order} />`, and `<OrderPaymentCard order={order} />`; (3) Totals section showing Subtotal, Discount Amount (with a note that the original promo code string is not stored), Delivery Fee, and **Total**; depends on T009, T010, T011
- [x] T013 [US2] Wire `<OrderDetail>` into `app/(admin)/admin/orders/[id]/page.tsx` — replace the placeholder with `<OrderDetail order={data} />` passing the fetched order; confirm the page compiles and renders a complete detail view

**Checkpoint**: User Story 2 fully functional. Admin can view the complete order detail for any order ID, including items, address, payment info, and totals.

---

## Phase 5: User Story 3 — Update Order Status (Priority: P2)

**Goal**: An admin can select a new status for an order from the detail view and save it; the update reflects immediately in the detail and list without a full page reload.

**Independent Test**: From the order detail page → select a new status in the `OrderStatusSelect` dropdown → click Save → confirm the status badge updates in the detail view → navigate back to the orders list → confirm the row status badge matches the new status → simulate failure (no network / bad orderId) → confirm error message renders and previous status is retained.

### Implementation for User Story 3

- [x] T014 [US3] Verify `components/admin/OrderStatusSelect.tsx` handles the full status update lifecycle correctly: it must call `updateOrderStatus(orderId, status)` from `actions/ordersAction.ts`, call `router.refresh()` on success (which causes `revalidateOrderPaths` to revalidate `/admin/orders` and `/admin/orders/[id]`), display an inline success/error message, handle legacy status values (prepend to dropdown if not in `ADMIN_ORDER_STATUSES`), and preserve previous status on failure — validate this matches the research findings in `research.md` Section 2; if any behavior is missing, fix `components/admin/OrderStatusSelect.tsx` accordingly
- [x] T015 [US3] Validate the end-to-end status update flow in the running dev server at `http://localhost:3000/admin/orders`: navigate to an order detail, change status, save, confirm both the detail view and the list row reflect the new status; verify an order with a legacy (non-standard) status string renders without error and can be overwritten

**Checkpoint**: User Story 3 fully functional. Status updates save and reflect immediately. Error states are handled. Legacy statuses display correctly.

---

## Phase 6: User Story 4 — Filter Guest vs. Authenticated Orders (Priority: P3)

**Goal**: An admin can apply the "Customer Type" filter to see only guest orders or only registered-user orders, and guest orders show a visible "Guest" label in the customer column.

**Independent Test**: Apply `?customerType=guest` → confirm only orders where `user_id` is null appear → confirm each row shows "(Guest)" badge in the Customer column → apply `?customerType=user` → confirm only orders with a `user_id` appear → apply no filter → confirm all orders visible.

### Implementation for User Story 4

- [x] T016 [US4] Verify the Customer Type filter (`customerType` URL param → `AdminOrderFilters.customerType`) is fully wired: the `OrderFilterBar` (T006) must emit the correct `?customerType=guest` or `?customerType=user` param, the `app/(admin)/admin/orders/page.tsx` (T004/T008) must extract it and pass it in the `AdminOrderFilters` object, and `getAdminOrders` must apply the Supabase `is("user_id", null)` / `not("user_id", "is", null)` filter — validate all three layers are connected; fix any wiring gap found
- [x] T017 [US4] Verify the guest label is visible in the `OrderTable` Customer column (T007): when `order.user_id` is null, the Customer cell must display `order.user_name` with a grey `AdminStatusBadge` labelled "(Guest)" alongside it — validate this renders correctly for actual guest orders in the dev database

**Checkpoint**: User Story 4 fully functional. Customer-type filtering works end-to-end and guest orders are visually distinguished.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final review of edge cases, visual consistency, and overall quality.

- [x] T018 [P] Validate edge case — empty orders table: apply a filter combination that returns zero orders (e.g., `?status=shipped&paymentMethod=instapay` with no matching data) and confirm `AdminEmptyState` renders with a clear message instead of an empty `<table>` element
- [x] T019 [P] Validate edge case — order with no items: if a test order exists with zero `order_items` rows (or simulate by passing an empty array), confirm `OrderItemsTable` renders "No items found." without crashing
- [x] T020 [P] Validate edge case — invalid order ID route: navigate to `/admin/orders/99999999` and confirm the Next.js 404 page renders (not a runtime error), confirming `notFound()` fires correctly in `app/(admin)/admin/orders/[id]/page.tsx`
- [x] T021 [P] Validate edge case — legacy status: find or create an order with a status value not in `["pending","confirmed","shipped","delivered","cancelled"]` and confirm it renders as-is in the `AdminStatusBadge` and appears as the selected option in `OrderStatusSelect` (prepended to the dropdown)
- [x] T022 Validate text truncation in the `OrderTable`: confirm long customer names and addresses are truncated with ellipsis in the table and the full value is visible in the detail view
- [x] T023 Validate mobile/responsive layout: confirm `app/(admin)/admin/orders/page.tsx` list and `app/(admin)/admin/orders/[id]/page.tsx` detail are navigable on narrow viewports (the admin shell is desktop-primary but must be mobile-navigable per plan.md Technical Context)
- [x] T024 Run through the full quickstart verification checklist in `specs/003-admin-orders-ops/quickstart.md` — confirm all imports resolve, the dev server shows no console errors on the orders pages, and the filter → URL param mapping table is correct end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user story phases
- **Phase 3 (US1)**: Depends on Phase 2 — MVP deliverable
- **Phase 4 (US2)**: Depends on Phase 2 — can start alongside Phase 3 (different files)
- **Phase 5 (US3)**: Depends on Phase 4 (requires `OrderDetail` to exist and `OrderStatusSelect` to be wired)
- **Phase 6 (US4)**: Depends on Phase 3 (requires `OrderFilterBar` and `OrderTable` to exist)
- **Phase 7 (Polish)**: Depends on all story phases complete

### User Story Dependencies

| Story | Depends On | Reason |
|-------|------------|--------|
| US1 (Order Queue) | Phase 2 only | Self-contained list view |
| US2 (Order Detail) | Phase 2 only | Self-contained detail view (different files from US1) |
| US3 (Status Update) | US2 complete | Requires `OrderDetail` + `OrderStatusSelect` wired |
| US4 (Guest Filter) | US1 complete | Requires `OrderFilterBar` + `OrderTable` wired |

### Within Each User Story

- Components with `[P]` can be built simultaneously (different files, no shared dependencies)
- Wire step (final task in each story) must come after component tasks complete
- Each story ends with a checkpoint validation before proceeding

### Parallel Opportunities

```
Phase 3 and Phase 4 can run in parallel (US1 and US2 work on different component files):
  Developer A: T006 → T007 → T008  (OrderFilterBar → OrderTable → wire into list page)
  Developer B: T009, T010, T011 in parallel → T012 → T013  (sub-components → OrderDetail → wire into detail page)

Within Phase 4 (US2):
  T009 (OrderItemsTable), T010 (OrderAddressCard), T011 (OrderPaymentCard) — all [P], run together
```

---

## Parallel Example: User Story 2

```bash
# Launch all three sub-components in parallel (all marked [P]):
Task T009: "Create components/admin/orders/OrderItemsTable.tsx"
Task T010: "Create components/admin/orders/OrderAddressCard.tsx"
Task T011: "Create components/admin/orders/OrderPaymentCard.tsx"

# After T009 + T010 + T011 complete, proceed sequentially:
Task T012: "Create components/admin/orders/OrderDetail.tsx"  (composes T009/T010/T011)
Task T013: "Wire OrderDetail into app/(admin)/admin/orders/[id]/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational — page shells (T004–T005)
3. Complete Phase 3: User Story 1 — order queue (T006–T008)
4. **STOP and VALIDATE**: Admin can view all orders, filter by status/payment/date, see guest labels, and see empty state
5. Demo / deploy if ready

### Incremental Delivery

1. Setup + Foundational → page shells exist (no runtime errors)
2. User Story 1 → order list with filters working → **MVP Demo**
3. User Story 2 → order detail view working → **Demo v2**
4. User Story 3 → status update working → **Demo v3**
5. User Story 4 → guest filter precision → **Demo v4**
6. Polish → edge cases verified → **Production ready**

---

## Notes

- No new server actions, types, or schema changes are needed for this feature — it is pure UI composition over an existing backend (per `research.md` Decision #1)
- All admin UI primitives (`AdminCard`, `AdminField`, `AdminNotice`, `AdminStatusBadge`, `AdminEmptyState`, `AdminPageHeader`, `OrderStatusSelect`) are already implemented and import-ready from `components/admin/AdminUI.tsx` and `components/admin/OrderStatusSelect.tsx`
- `revalidateOrderPaths` already covers `/admin/orders` and `/admin/orders/[id]` — no additional revalidation setup needed
- `[P]` tasks operate on different files with no shared in-progress dependencies
- Each user story ends at an independently testable checkpoint
- Commit after each phase checkpoint
