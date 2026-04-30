# Research: Admin Analytics Dashboard

## 1. Revenue Basis
Decision: Use delivered orders only for recognized revenue and average order value.
Rationale: This matches the feature spec and keeps revenue aligned with fulfilled commerce rather than in-progress operations.
Alternatives considered: all paid orders, all non-cancelled orders, or gross order totals regardless of status.

## 2. Date Range Strategy
Decision: Support `last_7_days`, `last_30_days`, `mtd`, and `custom` ranges, with Africa/Cairo business-day boundaries and a 366-day maximum span.
Rationale: These presets cover the common admin review windows and keep custom analytics bounded and predictable.
Alternatives considered: free-form date spans without a cap, rolling 90-day defaults, or UTC-only boundaries.

## 3. Data Retrieval Approach
Decision: Implement a dedicated server action that fetches `orders`, `order_items`, and `users`, then aggregates analytics server-side.
Rationale: The current app already uses server actions as the backend boundary, and this keeps the dashboard aligned with existing architecture and access control.
Alternatives considered: client-side aggregation after loading raw records, a new `app/api` route, or a database view/RPC for the full analytics payload.

## 4. Buyer Identity
Decision: Count unique buyers using `user:<user_id>` for registered users and `guest:<guest_id>` for guest orders.
Rationale: This prevents guest and registered identities from colliding and supports repeat-buyer calculations across both checkout paths.
Alternatives considered: distinct `user_id` only, email-only identity, or treating all guest orders as anonymous buckets.

## 5. Trend Comparison Window
Decision: Compare the current range to the previous equivalent window of equal length.
Rationale: Period-over-period comparisons are easiest for admins to interpret and keep trend deltas consistent across presets and custom ranges.
Alternatives considered: prior calendar month only, year-over-year comparisons, or no comparison series at all.

## 6. UI Composition
Decision: Render the page server-side and pass analytics payloads into small dashboard components, with charts handled by lightweight client wrappers only where needed.
Rationale: This minimizes client fetching, keeps the page fast, and fits the existing Server Component pattern used in the app.
Alternatives considered: fully client-rendered dashboard, chart-first page shell, or a separate analytics route group.
