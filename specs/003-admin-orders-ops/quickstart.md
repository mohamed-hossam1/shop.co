# Quickstart: Admin Orders Operations

**Feature**: `003-admin-orders-ops`  
**Date**: 2026-04-30

---

## Prerequisites

- Phase 1 (Admin Foundation) complete: `app/(admin)/admin/layout.tsx` with `requireAdmin()` gate, `AdminChrome` shell, and `AdminAccessDenied` component.
- Phase 2 (Catalog Management) complete: admin UI component system in `components/admin/AdminUI.tsx`, `components/admin/ConfirmDialog.tsx`, and `components/admin/OrderStatusSelect.tsx` all exist and are usable.
- All required server actions exist in `actions/ordersAction.ts`.

## Where Things Live

```
app/(admin)/admin/orders/
  page.tsx                   ← Order list page (Server Component)
  [id]/
    page.tsx                 ← Order detail page (Server Component)

components/admin/orders/
  OrderTable.tsx             ← Client component: filterable table + filter bar
  OrderFilterBar.tsx         ← Client component: search + filter controls
  OrderDetail.tsx            ← Client component: full detail view layout
  OrderItemsTable.tsx        ← Sub-component: line items table
  OrderAddressCard.tsx       ← Sub-component: address display
  OrderPaymentCard.tsx       ← Sub-component: payment info + proof warning
```

## Key Imports

```ts
// Server actions (all admin-gated)
import { getAdminOrders, getAdminOrderById, updateOrderStatus } from "@/actions/ordersAction";

// Types
import { Order, OrderItem } from "@/types/Order";
import { AdminOrderFilters, AdminOrderStatus } from "@/types/Admin";

// Shared admin UI
import { AdminPageHeader, AdminSection, AdminCard, AdminNotice, AdminStatusBadge, AdminEmptyState } from "@/components/admin/AdminUI";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

// Constants
import { ADMIN_ORDER_STATUSES, getStatusTone, formatAdminLabel } from "@/lib/admin";
import ROUTES from "@/constants/routes";
```

## Filter → URL Param Mapping

| UI Filter | URL param | `AdminOrderFilters` field |
|-----------|-----------|--------------------------|
| Search box | `?search=...` | `search` |
| Status dropdown | `?status=pending` | `status` |
| Payment method | `?paymentMethod=vodafone_cash` | `paymentMethod` |
| Customer type | `?customerType=guest` | `customerType` |
| Date from | `?dateFrom=2026-01-01` | `dateFrom` |
| Date to | `?dateTo=2026-04-30` | `dateTo` |

## Running Locally

The dev server is already running (`npm run dev`). Navigate to `http://localhost:3000/admin/orders` after signing in with an admin account.

## Status Badge Usage

```tsx
import { AdminStatusBadge } from "@/components/admin/AdminUI";
import { getStatusTone } from "@/lib/admin";

<AdminStatusBadge label={order.status} tone={getStatusTone(order.status)} />
```

## Payment Image Warning

Whenever `order.payment_image` is truthy, render:
```tsx
<AdminNotice tone="warning" title="Payment Proof">
  Stored filename: <strong>{order.payment_image}</strong>
  <br />
  This file cannot be retrieved from the dashboard. Only the filename is recorded.
</AdminNotice>
```
