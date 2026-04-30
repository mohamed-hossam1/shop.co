# Implementation Tasks: Hardening, Integrity, and Launch Readiness

## Phase 1: Setup
**Goal**: Initialize feature context and establish development environment.

- [ ] T001 Verify database connection and Next.js dev server are running in root

## Phase 2: Foundational Infrastructure
**Goal**: Establish any shared utilities required by multiple stories.

- [ ] T002 Implement a robust server-side admin role check utility function in actions/userAction.ts

## Phase 3: Secure Order Confirmation Access (US1)
**Goal**: Prevent unauthorized exposure of order data via URL guessing.
**Priority**: P1
**Independent Test**: Attempt to access an order success page for an order belonging to a different user/guest, expecting an access denial.

- [ ] T003 [US1] Update app/(store)/order-success/page.tsx to verify order ownership against session/guest cookie
- [ ] T004 [US1] Redirect unauthorized users from app/(store)/order-success/page.tsx to home page

## Phase 4: Resilient Checkout Pricing Integrity (US2)
**Goal**: Calculate final order totals using authoritative database records.
**Priority**: P1
**Independent Test**: Intercept checkout submission, modify variant prices, and verify the generated order uses database prices.

- [ ] T005 [P] [US2] Update createOrder in actions/ordersAction.ts to fetch authoritative price from product_variants
- [ ] T006 [P] [US2] Update createOrder in actions/ordersAction.ts to fetch and validate coupon
- [ ] T007 [US2] Refactor createOrder in actions/ordersAction.ts to compute subtotal and total using fetched data

## Phase 5: Server-Side Admin Mutation Auditing (US3)
**Goal**: Explicitly guard all destructive and administrative actions with a server-side role check.
**Priority**: P1
**Independent Test**: Trigger an admin server action with a standard user session and verify explicit denial.

- [ ] T008 [P] [US3] Add server-side admin role check to mutations in actions/productsAction.ts
- [ ] T009 [P] [US3] Add server-side admin role check to mutations in actions/categoriesAction.ts
- [ ] T010 [P] [US3] Add server-side admin role check to mutations in actions/promoCodeAction.ts
- [ ] T011 [P] [US3] Add server-side admin role check to mutations in actions/deliveryAction.ts
- [ ] T012 [P] [US3] Add server-side admin role check to mutations in actions/ordersAction.ts

## Phase 6: Admin Dashboard Stock Visibility (US4)
**Goal**: Provide visibility into low or depleted stock levels in admin views.
**Priority**: P2
**Independent Test**: Set a variant's stock to 0 or 2, and observe the warnings in the admin product list and order detail views.

- [ ] T013 [P] [US4] Add Out of Stock and Low Stock badges to components/admin/products/ProductTable.tsx
- [ ] T014 [P] [US4] Add Out of Stock and Low Stock badges to components/admin/orders/OrderItemsTable.tsx

## Phase 7: Catalog Write-Path Cache Revalidation (US5)
**Goal**: Ensure changes made in the admin dashboard immediately reflect on the shopper-facing storefront.
**Priority**: P2
**Independent Test**: Update a product's title in the admin panel and refresh the public product listing to see the change.

- [ ] T015 [P] [US5] Add revalidatePath to product mutations in actions/productsAction.ts
- [ ] T016 [P] [US5] Add revalidatePath to category mutations in actions/categoriesAction.ts
- [ ] T017 [P] [US5] Add revalidatePath to promo code mutations in actions/promoCodeAction.ts
- [ ] T018 [P] [US5] Add revalidatePath to delivery fee mutations in actions/deliveryAction.ts

## Phase 8: Polish & Cross-Cutting Concerns
**Goal**: Final review and cross-cutting fixes.

- [ ] T019 Verify UI flows for order-success access denial manually in browser
- [ ] T020 Run end-to-end tests for checkout using valid and invalid promo codes manually in browser

## Dependencies
- US1 (Order Success) depends on Phase 2.
- US2 (Pricing Integrity) depends on Phase 2.
- US3 (Mutation Auditing) depends on Phase 2.
- US4 (Stock Visibility) depends on Phase 2.
- US5 (Cache Revalidation) depends on Phase 2.
- Polish depends on US1-US5.

## Parallel Execution Examples
- US3 auditing tasks (T008-T012) can be implemented in parallel since they modify different action files.
- US4 stock visibility tasks (T013, T014) can be implemented alongside US5 cache revalidation tasks (T015-T018) as they touch frontend vs. server actions respectively.

## Implementation Strategy
Start with US1 and US2 as the MVP (Minimum Viable Product) to secure the critical financial and privacy aspects of the storefront. Proceed to US3 to lock down admin mutations. Finally, implement US4 and US5 to improve the admin operational experience.
