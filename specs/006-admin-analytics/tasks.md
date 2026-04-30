# Tasks: Admin Analytics Dashboard

**Input**: Design documents from `/specs/006-admin-analytics/`
**Prerequisites**: `plan.md`, `specify.md`, `research.md`, `data-model.md`, `contracts/admin-analytics.md`

**Organization**: Tasks are grouped by user story to keep the dashboard shippable in increments.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the shared feature scaffolding used by every dashboard slice.

- [ ] T001 [P] Create analytics type definitions in `types/AdminAnalytics.ts` for filters, KPI payloads, trends, distributions, top products, customer activity, and recent transactions
- [ ] T002 [P] Create the analytics server action module in `actions/analyticsAction.ts` with the exported `getAdminAnalyticsDashboard` entry point
- [ ] T003 [P] Create the analytics component directory scaffold in `components/admin/analytics/` for the dashboard widgets defined in the plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared data-shaping and access-control logic that all user stories depend on.

**Checkpoint**: Dashboard data can be requested securely and normalized into a single analytics payload.

- [ ] T004 Implement range parsing, default window selection, and custom date validation in `actions/analyticsAction.ts`
- [ ] T005 Implement the admin guard and base Supabase reads for `orders`, `order_items`, and `users` in `actions/analyticsAction.ts`
- [ ] T006 Build shared aggregation helpers for recognized revenue, buyer identity keys, repeat buyer detection, and previous-period comparison windows in `actions/analyticsAction.ts`
- [ ] T007 Prepare the `/admin` page data flow in `app/(admin)/admin/page.tsx` so it reads query params and calls `getAdminAnalyticsDashboard(filters)` with the default last-30-days window

---

## Phase 3: User Story 1 - Filtered KPI Dashboard Shell (Priority: P1) 🎯 MVP

**Goal**: An admin can open `/admin`, change the date range, and immediately see the core KPI cards for the selected window.

**Independent Test**: Load `/admin` as an admin, confirm the default last-30-days summary renders, then switch to `last_7_days`, `mtd`, and a valid `custom` range and verify the KPI values update.

- [ ] T008 [P] [US1] Implement the analytics filter bar in `components/admin/analytics/AnalyticsFilterBar.tsx` with range presets and custom date inputs
- [ ] T009 [P] [US1] Implement the KPI grid in `components/admin/analytics/KpiGrid.tsx` for recognized revenue, delivered orders, total orders, average order value, unique buyers, and repeat buyer rate
- [ ] T010 [US1] Wire the KPI section into `app/(admin)/admin/page.tsx` so the page renders the filter bar and KPI grid from the analytics payload
- [ ] T011 [US1] Add empty and invalid-range handling in `app/(admin)/admin/page.tsx` so the dashboard shows a clear error or neutral state instead of crashing

---

## Phase 4: User Story 2 - Revenue Trends and Order Mix (Priority: P2)

**Goal**: An admin can inspect revenue and order trends plus the order-status and payment-method breakdowns for the selected date range.

**Independent Test**: Change the dashboard range and confirm the trend series and distribution sections update together, including comparison values for the previous equivalent window.

- [ ] T012 [P] [US2] Implement the revenue and orders trend chart component in `components/admin/analytics/RevenueOrdersTrend.tsx`
- [ ] T013 [P] [US2] Implement the order-status distribution component in `components/admin/analytics/StatusDistribution.tsx`
- [ ] T014 [US2] Extend `actions/analyticsAction.ts` to include daily trend series, comparison points, status counts, payment-method counts, and guest-vs-registered share in the analytics payload
- [ ] T015 [US2] Compose the trend and distribution sections in `app/(admin)/admin/page.tsx` using the analytics payload from the server action

---

## Phase 5: User Story 3 - Commerce Depth and Quick Actions (Priority: P3)

**Goal**: An admin can review top-selling products, customer activity, recent transactions, and still jump to the existing admin modules from the same page.

**Independent Test**: Load a populated date range, confirm top products and recent transactions appear, and verify each transaction row links to its admin order detail page while the module shortcuts remain visible below the analytics blocks.

- [ ] T016 [P] [US3] Implement the top-selling products table in `components/admin/analytics/TopProductsTable.tsx` using delivered-order scope and revenue contribution values
- [ ] T017 [P] [US3] Implement the customer activity panel in `components/admin/analytics/CustomerActivityPanel.tsx` for new users, active buyers, repeat buyers, and repeat buyer rate
- [ ] T018 [P] [US3] Implement the recent transactions table in `components/admin/analytics/RecentTransactionsTable.tsx` with links to `/admin/orders/[id]`
- [ ] T019 [P] [US3] Update the admin navigation label in `lib/admin.ts` from `Overview` to `Analytics`
- [ ] T020 [US3] Render the commerce-depth sections and the retained admin module cards in `app/(admin)/admin/page.tsx` beneath the KPI and trend blocks

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Tighten edge cases, keep the page resilient, and verify the implementation against the documented scenarios.

- [ ] T021 [P] Refine loading, empty, and error states across `app/(admin)/admin/page.tsx` and `components/admin/analytics/*` for no-order ranges and invalid filters
- [ ] T022 [P] Update `specs/006-admin-analytics/quickstart.md` and `specs/006-admin-analytics/contracts/admin-analytics.md` if any implementation detail changes the documented verification flow or payload shape
- [ ] T023 Validate the dashboard manually against `specs/006-admin-analytics/quickstart.md`, including access control, range changes, KPI correctness, and recent-transaction links

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on the core user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories; delivers the MVP dashboard shell and KPIs.
- **User Story 2 (P2)**: Depends on the shared analytics payload from the foundational phase, but remains independently testable.
- **User Story 3 (P3)**: Depends on the shared analytics payload and the page shell, but remains independently testable.

### Within Each User Story

- Shared data shaping must be complete before the first dashboard section is rendered.
- Components in different files can be built in parallel.
- Page composition should follow component implementation so the dashboard can be validated incrementally.

### Parallel Opportunities

- Setup tasks T001-T003 can run in parallel because they touch different files.
- Foundational tasks T004-T006 are sequentially related, but T005 can be prepared alongside T004 once the module scaffold exists.
- User Story 1 tasks T008 and T009 can run in parallel.
- User Story 2 tasks T012 and T013 can run in parallel.
- User Story 3 tasks T016, T017, T018, and T019 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Implement the analytics filter bar in components/admin/analytics/AnalyticsFilterBar.tsx"
Task: "Implement the KPI grid in components/admin/analytics/KpiGrid.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational work.
3. Complete Phase 3: User Story 1.
4. Stop and validate the KPI dashboard shell on `/admin`.

### Incremental Delivery

1. Ship the KPI dashboard shell first so admins get immediate value.
2. Add trends and order-mix analytics next.
3. Finish with top products, customer activity, and recent transactions.
4. Keep the existing admin module shortcuts visible throughout.

### Parallel Team Strategy

1. One developer can own the analytics action and data shaping.
2. A second developer can build the KPI/filter UI in parallel.
3. A third developer can implement trends, distributions, and commerce-depth widgets once the payload shape is stable.
