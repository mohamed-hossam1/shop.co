# Data Model: Admin Analytics Dashboard

## Domain Objects

### AdminAnalyticsFilters
- `range`: `last_7_days | last_30_days | mtd | custom`
- `from`: ISO date string, required when `range = custom`
- `to`: ISO date string, required when `range = custom`
- `timezone`: optional string, defaults to `Africa/Cairo`

Validation rules:
- `from` and `to` must be valid dates when provided.
- `from` must be less than or equal to `to`.
- Custom span must not exceed 366 days.

### AdminAnalyticsDashboard
- `kpis`: aggregated revenue and order metrics
- `trends`: daily revenue and order series plus comparison values
- `distributions`: status, payment method, and guest-vs-registered splits
- `topProducts`: top-selling products by units and revenue
- `customerActivity`: new users, active buyers, repeat buyers
- `recentTransactions`: latest order rows for quick review

Relationships:
- Derived from `orders`, `order_items`, and `users`.
- Top products are derived from delivered `orders` joined to `order_items`.
- Customer activity uses `users.created_at` and order ownership data.

### KpiMetric
- `recognizedRevenue`
- `deliveredOrders`
- `totalOrders`
- `averageOrderValue`
- `uniqueBuyers`
- `repeatBuyerRate`

Validation rules:
- `averageOrderValue` must be `0` when there are no delivered orders.
- `repeatBuyerRate` must be `0` when there are no buyers.

### TrendPoint
- `date`
- `value`
- optional `comparisonValue`

Validation rules:
- One point per business day in the selected range.
- Comparison series must align to the same number of days as the primary window.

### TopProductRow
- `productId`
- `title`
- `unitsSold`
- `revenue`

Validation rules:
- Rows are sorted by `unitsSold` descending, then `revenue` descending as tie-breaker.

### CustomerActivitySummary
- `newUsers`
- `activeBuyers`
- `repeatBuyers`
- `repeatBuyerRate`

Relationships:
- `newUsers` comes from `users.created_at` in range.
- `activeBuyers` comes from distinct buyers in the filtered orders set.

### RecentTransactionRow
- `id`
- `createdAt`
- `customerLabel`
- `customerType`
- `status`
- `paymentMethod`
- `totalPrice`

Validation rules:
- `customerType` is either `registered` or `guest`.
- Rows are sorted by `createdAt` descending.

## State Transitions
- Filter change -> server action request -> aggregated payload -> dashboard re-render.
- Invalid filter -> server action failure -> error state on dashboard.
- Empty result set -> dashboard renders neutral empty states without exceptions.
