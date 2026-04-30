# Contract: Admin Analytics Dashboard

## Route Contract
The `/admin` page accepts these query params:
- `range=last_7_days|last_30_days|mtd|custom`
- `from=YYYY-MM-DD` when `range=custom`
- `to=YYYY-MM-DD` when `range=custom`

Rules:
- Invalid or missing custom dates must return a validation error state.
- Default behavior is `range=last_30_days` when no params are provided.

## Server Action Contract
### `getAdminAnalyticsDashboard(filters)`
Input:
```ts
{
  range: 'last_7_days' | 'last_30_days' | 'mtd' | 'custom'
  from?: string
  to?: string
  timezone?: string
}
```

Output:
```ts
{
  success: boolean
  data?: {
    kpis: {
      recognizedRevenue: number
      deliveredOrders: number
      totalOrders: number
      averageOrderValue: number
      uniqueBuyers: number
      repeatBuyerRate: number
    }
    trends: {
      revenueSeries: Array<{ date: string; value: number; comparisonValue?: number }>
      ordersSeries: Array<{ date: string; value: number; comparisonValue?: number }>
    }
    distributions: {
      orderStatus: Record<string, number>
      paymentMethod: Record<string, number>
      guestShare: number
    }
    topProducts: Array<{
      productId: string
      title: string
      unitsSold: number
      revenue: number
    }>
    customerActivity: {
      newUsers: number
      activeBuyers: number
      repeatBuyers: number
      repeatBuyerRate: number
    }
    recentTransactions: Array<{
      id: string
      createdAt: string
      customerLabel: string
      customerType: 'guest' | 'registered'
      status: string
      paymentMethod: string
      totalPrice: number
    }>
  }
  message?: string
}
```

## Behavioral Notes
- Revenue and top-product metrics use delivered orders only.
- Total order counts include all statuses in the selected window.
- Comparison values are aligned to the previous equivalent date window.
- Empty results are valid and should still return `success: true` with zeroed metrics.
