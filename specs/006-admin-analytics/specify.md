# Admin Analytics — Specification

## Overview

Transform the existing `/admin` page into an analytics-first dashboard that surfaces commerce KPIs, trends, top products, customer activity, and recent transactions while retaining the existing module launcher cards as secondary shortcuts.

## Goals

- Provide decision-grade KPIs scoped by a selectable date range (default: last 30 days).
- Use recognized revenue = delivered orders only.
- Keep admin access model and existing module routes unchanged.
- Compute values server-side via a new analytics server action.

## Scope

- Replace content of `/admin` with analytics UI and shortcut cards.
- Implement server-side action `getAdminAnalyticsDashboard(filters)` behind `requireAdmin()`.
- Add types in `types/AdminAnalytics.ts` and analytics UI components under `components/admin/analytics/`.

Out of scope: traffic/session analytics, new data warehouse, DB schema migrations, external BI integration.

## Functional Requirements

1. Date-range filtering via query params: `range=last_7_days|last_30_days|mtd|custom`, and `from`/`to` when `custom`.
2. KPI Cards (server-calculated): Recognized Revenue, Delivered Orders, Total Orders, Average Order Value, Unique Buyers, Repeat Buyer Rate.
3. Trends: daily series for recognized revenue and total orders with previous-period comparison.
4. Order quality: status distribution, payment method distribution, guest vs registered share.
5. Top-selling products by units sold and revenue (delivered-order scope).
6. Customer activity: new registrations, active buyers, repeat buyers.
7. Recent transactions table with link to `/admin/orders/[id]`.
8. Operational shortcuts: existing admin module cards preserved below analytics.

## Non-functional Requirements

- Server-side aggregation; UI fetches via single action per filter change.
- Date range validation with a recommended max span (cap: 366 days).
- Timezone: Africa/Cairo for range labels and display.
- Graceful empty/error states when data absent or invalid dates provided.

## API Contract

- New server action: `actions/analyticsAction.ts` export `getAdminAnalyticsDashboard(filters)`.
- Input: `filters: { range: string; from?: string; to?: string; timezone?: string }`.
- Output: `{ success: boolean; data?: AdminAnalyticsPayload; message?: string }`.

AdminAnalyticsPayload (summary):

- `kpis`: { recognizedRevenue:number, deliveredOrders:number, totalOrders:number, aov:number, uniqueBuyers:number, repeatBuyerRate:number }
- `trends`: { revenueSeries: Array<{ date:string, value:number }>, ordersSeries: Array<{ date:string, value:number }> }
- `distributions`: { status: Record<string,number>, paymentMethods: Record<string,number>, guestShare:number }
- `topProducts`: Array<{ productId:string, title:string, units:number, revenue:number }>
- `customerActivity`: { newUsers:number, activeBuyers:number, repeatBuyers:number }
- `recentTransactions`: Array<{ id:string, date:string, customerLabel:string, status:string, paymentMethod:string, total:number }>

## Types to Add

- `types/AdminAnalytics.ts` with: Filter type, KPI DTO, Trend series type, Distribution types, TopProductRow, CustomerActivity, RecentTransaction.

## Data Sources & Aggregation Rules

- Primary tables: `orders`, `order_items`, `users`.
- Recognized revenue: sum `orders.total_price` filtered by `status = 'delivered'` and date range.
- Delivered orders: count of `orders` where `status = 'delivered'` in range.
- Total orders: count of `orders` in range (all statuses).
- AOV = recognizedRevenue / deliveredOrders (handle divide-by-zero).
- Unique buyers: distinct `user_id` plus guest key usage (`guest:<guest_id>`).
- Repeat buyers: count buyers with >=2 orders in the filtered window (or include previous period if desired).
- Top products: aggregate `order_items` joined to delivered `orders`.

Query strategy (server action):

1. Parse and validate filter window; compute previous window for comparisons.
2. Query filtered `orders` (select minimal fields) and `order_items` for those orders.
3. Query `users` created in the period for new-registrations metric.
4. Compute aggregates in-memory or via SQL GROUP BY depending on cost; return DTO.

## UI / Component Layout

- `components/admin/analytics/AnalyticsFilterBar.tsx` — range presets, custom date inputs.
- `components/admin/analytics/KpiGrid.tsx` — six metric cards.
- `components/admin/analytics/RevenueOrdersTrend.tsx` — line/area chart for revenue/orders.
- `components/admin/analytics/StatusDistribution.tsx` — pie/bar for order status.
- `components/admin/analytics/TopProductsTable.tsx` — sortable top-products table.
- `components/admin/analytics/CustomerActivityPanel.tsx` — new users, active buyers, repeat metrics.
- `components/admin/analytics/RecentTransactionsTable.tsx` — paginated table linking to `/admin/orders/[id]`.

UI notes:

- Default server-render on `/admin` page using a server component that calls the action with default filters.
- Charts may use lightweight client components (client wrappers) to render series passed from server.

## File-level Implementation Phases

1. Phase 1 — Contracts & Types: `types/AdminAnalytics.ts` and query param contract.
2. Phase 2 — Server Action: `actions/analyticsAction.ts` implementing `getAdminAnalyticsDashboard` and `requireAdmin()` guard.
3. Phase 3 — UI Components: add `components/admin/analytics/*` components.
4. Phase 4 — `/admin` page: update `app/(admin)/admin/page.tsx` to render analytics and module cards.
5. Phase 5 — Naming: update `lib/admin.ts` nav label to `Analytics`.
6. Phase 6 — Hardening: edge cases, validation, and empty states.
7. Phase 7 — Verification: run manual scenarios and validate test cases.

## Acceptance Criteria (derived from PLAN.md tests)

- Non-admins cannot access analytics data.
- Default load uses last 30 days and shows KPIs and trend charts.
- Custom ranges validate and update all metrics; invalid ranges show errors.
- Revenue KPIs exclude non-delivered orders; total orders include all statuses.
- Top-products and recent-transactions update correctly with range changes.
- Empty data ranges show neutral empty states without errors.

## Risks & Assumptions

- Assumes `orders`, `order_items`, and `users` contain sufficient fields; no DB migrations planned.
- Performance for large spans may need SQL aggregation tuning; cap range to 366 days.
- Timezone and date-handling must follow `Africa/Cairo` business rules.

## Next Steps (options)

1. I can scaffold `types/AdminAnalytics.ts` and `actions/analyticsAction.ts` now.
2. Or scaffold the UI components and the `/admin` server page.

---

Specification created from `PLAN.md` and repository context.
