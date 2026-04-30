# Plan V2: Admin Analytics Dashboard Transformation

## Summary
Transform `/admin` from a module launcher into a full analytics dashboard that gives admins an at-a-glance operational and business view of store performance, while keeping quick links to existing admin modules on the same page.

This plan uses current Supabase tables and server actions architecture, adds one dedicated analytics server action, and introduces clear, date-range-driven KPIs, charts, and transaction views.

## Scope
- Replace current `/admin` page content with analytics-first UI.
- Keep admin sidebar and existing module routes unchanged.
- Keep module quick-access cards in a secondary section on `/admin`.
- Implement commerce-only customer activity metrics from existing DB data.
- Use default range: last 30 days with previous 30 days comparison.
- Use recognized revenue basis: delivered orders only.

## Out of Scope
- Traffic/session/conversion analytics from page events.
- New data warehouse, BI tool, or external analytics service.
- Schema migrations to add new tables.
- Replacing existing admin module pages (`/admin/orders`, `/admin/products`, etc.).

## Public Interface and Type Changes
- Add dashboard filter query params on `/admin`:
1. `range`: `last_7_days | last_30_days | mtd | custom`
2. `from`: `YYYY-MM-DD` (required when `range=custom`)
3. `to`: `YYYY-MM-DD` (required when `range=custom`)
- Add a new server action contract:
1. `getAdminAnalyticsDashboard(filters)`
2. Returns `{ success: true, data } | { success: false, message }`
- Add analytics-specific types in `types/AdminAnalytics.ts`:
1. Filter input type
2. KPI payload type
3. Trend series type
4. Top-product row type
5. Customer-activity payload type
6. Recent-transaction row type
- Update admin nav label in `lib/admin.ts` from `Overview` to `Analytics` for clarity.

## Dashboard Definition (What `/admin` Becomes)
- Primary purpose: decision-making dashboard for revenue, orders, products, customers, and recent commerce activity.
- Secondary purpose: quick navigation hub to operational modules.
- Refresh model: request-time data, scoped by selected date range.
- Access model: same admin-only guard via existing layout + `requireAdmin()` in action.

## Metrics and Features
- KPI Cards:
1. Recognized Revenue (sum `orders.total_price` where `status=delivered`)
2. Delivered Orders count
3. Total Orders count (all statuses)
4. Average Order Value (`recognizedRevenue / deliveredOrders`)
5. Unique Buyers (`distinct user_id` plus guest keys from filtered orders)
6. Repeat Buyer Rate (`buyersWith2PlusOrders / uniqueBuyers`)
- Revenue/Orders Trend:
1. Daily recognized revenue series
2. Daily total orders series
3. Period-over-period deltas vs previous equivalent window
- Order Quality and Mix:
1. Status distribution (pending/confirmed/shipped/delivered/cancelled)
2. Payment method distribution
3. Guest vs registered order share
- Top-Selling Products:
1. Rank by units sold from `order_items`
2. Revenue contribution from `price_at_purchase * quantity`
3. Uses delivered-order scope for ranking consistency with revenue
- Customer Activity:
1. New registered users in period (`users.created_at`)
2. Active registered buyers in period (`distinct orders.user_id`)
3. Repeat buyers count and rate
- Recent Transactions:
1. Latest orders table with order ID, date, customer name/type, status, payment method, total
2. Row action linking to `/admin/orders/[id]`
- Operational Shortcuts:
1. Existing module cards retained below analytics blocks

## Suggested UI Layout
- Header row:
1. `AdminPageHeader` title: `Analytics Dashboard`
2. Subtitle with recognized revenue scope and date range
3. Filter bar with range preset and custom date inputs
- Section 1: KPI grid
1. 6 metric cards in responsive 2/3/6-column layout
- Section 2: Trend and distribution
1. Left: Revenue + Orders trend chart
2. Right: Status distribution chart
- Section 3: Commerce depth
1. Left: Top-selling products table
2. Right: Customer activity panel + payment/guest mix mini charts
- Section 4: Recent transactions
1. Full-width table with order detail links
- Section 5: Admin modules
1. Existing launcher cards for Products, Categories, Orders, Promo Codes, Delivery, Users

## Data Sources and Calculations
- Tables queried:
1. `orders`
2. `order_items`
3. `users`
- Query strategy:
1. Fetch filtered `orders` in selected range with required fields only
2. Fetch `order_items` by `order_id in (...)` for product aggregation
3. Fetch `users` created in range for signup activity
- Calculation rules:
1. Revenue metrics use delivered orders only
2. Operational volume metrics use all filtered orders
3. Top products use delivered orders only
4. Customer identity key:
   `user:<user_id>` for registered, `guest:<guest_id>` for guest
5. Previous-period comparison window mirrors current window length
- Time handling:
1. Use Africa/Cairo business-day boundaries for range labels
2. Preserve current codebase date formatting approach for display

## Required Server Action Changes
- Add `actions/analyticsAction.ts`:
1. `getAdminAnalyticsDashboard(filters)` with `requireAdmin()` gate
2. Input validation for date range and maximum span (recommended cap: 366 days)
3. Supabase queries for orders, order_items, users
4. Server-side aggregation to analytics DTO
- No mutation actions required for v1 analytics.
- No DB schema change required for v1 analytics.

## File-Level Implementation Phases
1. **Phase 1: Contracts and Scaffolding**
   Create `types/AdminAnalytics.ts`, define filter/query param contract, and shared metric DTOs.
2. **Phase 2: Analytics Data Action**
   Implement `actions/analyticsAction.ts` with admin auth guard, range parser, queries, and aggregation.
3. **Phase 3: Analytics UI Components**
   Add `components/admin/analytics/*`:
   `AnalyticsFilterBar.tsx`, `KpiGrid.tsx`, `RevenueOrdersTrend.tsx`, `StatusDistribution.tsx`, `TopProductsTable.tsx`, `CustomerActivityPanel.tsx`, `RecentTransactionsTable.tsx`.
4. **Phase 4: Replace `/admin` Page**
   Rewrite `app/(admin)/admin/page.tsx` to fetch analytics data and render new layout; keep module shortcut cards section.
5. **Phase 5: Navigation and Naming Consistency**
   Update `lib/admin.ts` nav label to `Analytics`; keep same route path `/admin`.
6. **Phase 6: Hardening and Edge Cases**
   Add robust empty/error states, invalid-date handling, and graceful behavior when no orders exist in selected range.
7. **Phase 7: Verification**
   Run manual admin scenarios for filters, calculations, links, and access controls.

## Test Cases and Scenarios
1. Non-admin or signed-out user cannot access `/admin` analytics data.
2. Default `/admin` loads last 30 days and comparison metrics.
3. Custom range with valid dates recalculates all KPI cards and charts.
4. Custom range with `from > to` returns clear validation error UI.
5. Revenue KPI excludes non-delivered orders.
6. Total orders KPI includes all statuses.
7. Top products ranking changes correctly when date range changes.
8. Recent transactions rows link correctly to `/admin/orders/[id]`.
9. Guest vs registered share matches filtered order set.
10. New users metric changes with date range and reflects `users.created_at`.
11. Empty range (no orders) shows neutral empty states without crashes.
12. Performance remains acceptable for default range with current dataset size.

## Assumptions and Defaults
- Revenue basis is delivered orders only.
- Default range is last 30 days with previous 30 days comparison.
- `/admin` is the analytics page (not a separate `/admin/analytics` route).
- Customer activity is commerce-only, not traffic/session-based.
- Existing schema fields are accurate and sufficient for v1 analytics.
- Dashboard values are computed server-side from source tables each request.
- Module launcher cards remain available as a lower section on the page.
- Payment proof remains filename-only and is not part of analytics media retrieval.
