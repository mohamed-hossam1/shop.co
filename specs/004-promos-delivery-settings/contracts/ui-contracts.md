# UI Contracts: Promotions and Delivery Settings

**Feature**: `004-promos-delivery-settings` | **Date**: 2026-04-30

This document defines the interface contracts between the new admin pages (Server Components) and their child client components for promo code and delivery settings management.

---

## Promo Codes Module

### Route Surface

| Route | Responsibility |
|---|---|
| `/admin/promo-codes` | List, search, filter, and delete promo codes |
| `/admin/promo-codes/new` | Create a promo code |
| `/admin/promo-codes/[id]/edit` | Edit a promo code |

### `PromoCodeTable` (Client Component)

**Location**: `components/admin/promo-codes/PromoCodeTable.tsx`

**Receives from page**:

```ts
props: {
  promoCodes: PromoCode[];
}
```

**Reads from URL**:

```ts
searchParams: {
  search?: string;
  status?: "all" | "active" | "inactive" | "expired" | "exhausted";
}
```

**User interactions**:

| Action | Triggers |
|---|---|
| Change search input | `router.push("/admin/promo-codes?search=...")` |
| Change status filter | `router.push("/admin/promo-codes?status=...")` |
| Click `Add Promo Code` | Navigate to `/admin/promo-codes/new` |
| Click `Edit` | Navigate to `/admin/promo-codes/[id]/edit` |
| Click `Delete` | Open `ConfirmDialog` |
| Confirm delete | Call `deletePromoCode(id)` then `router.refresh()` |

**Server actions called**:

- `deletePromoCode(id: number)`

**Display contract**:

Each row must show:

- `code`
- `type`
- `value`
- `min_purchase`
- `used_count`
- `max_uses`
- `expires_at`
- `is_active`

Optional derived badges may also show `Expired` or `Usage Capped`, but they do not replace the required data columns.

---

### `PromoCodeForm` (Client Component)

**Location**: `components/admin/promo-codes/PromoCodeForm.tsx`

**Receives from page**:

```ts
props: {
  promoCode?: PromoCode; // undefined = create mode
}
```

**Internal state**:

```ts
{
  code: string;
  type: "percentage" | "fixed";
  value: string;
  min_purchase: string;
  max_uses: string;
  expires_at: string;
  is_active: boolean;
  errors: Record<string, string>;
  isPending: boolean;
}
```

**Validation before submit**:

- `code` non-empty
- `value` parses to a positive number
- percentage `value` stays between `1` and `100`
- `min_purchase` blank or `>= 0`
- `max_uses` blank or integer `>= 0`
- `expires_at` blank allowed

**Normalization before submit**:

- trim `code`
- blank `min_purchase` → `0`
- blank `max_uses` → `null`
- blank `expires_at` → `null`

**On submit (create mode)**:

- Call `createPromoCode(input)`
- On success: `router.push("/admin/promo-codes")` then `router.refresh()`
- On duplicate or validation error: stay on the page and show field/global error

**On submit (edit mode)**:

- Call `updatePromoCode(id, input)`
- On success: `router.push("/admin/promo-codes")` then `router.refresh()`
- On duplicate or validation error: stay on the page and show field/global error

---

### Promo Pages (Server Components)

**List page**: `app/(admin)/admin/promo-codes/page.tsx`

- parses `searchParams`
- builds `AdminPromoFilters`
- calls `getPromoCodes(filters)`
- passes `promoCodes` to `PromoCodeTable`

**Edit page**: `app/(admin)/admin/promo-codes/[id]/edit/page.tsx`

- validates numeric `id`
- calls `getPromoCodeById(id)`
- returns `notFound()` if missing
- passes the loaded record to `PromoCodeForm`

**Create page**: `app/(admin)/admin/promo-codes/new/page.tsx`

- renders `PromoCodeForm` without a record prop

---

## Delivery Module

### Route Surface

| Route | Responsibility |
|---|---|
| `/admin/delivery` | List and delete delivery settings |
| `/admin/delivery/new` | Create a delivery setting |
| `/admin/delivery/[id]/edit` | Edit a delivery setting |

### `DeliveryTable` (Client Component)

**Location**: `components/admin/delivery/DeliveryTable.tsx`

**Receives from page**:

```ts
props: {
  settings: Delivery[];
}
```

**User interactions**:

| Action | Triggers |
|---|---|
| Click `Add City` | Navigate to `/admin/delivery/new` |
| Click `Edit` | Navigate to `/admin/delivery/[id]/edit` |
| Click `Delete` | Open `ConfirmDialog` |
| Confirm delete | Call `deleteDeliverySetting(id)` then `router.refresh()` |

**Server actions called**:

- `deleteDeliverySetting(id: number)`

**Display contract**:

Each row must show:

- `city`
- `delivery_fee`

---

### `DeliveryForm` (Client Component)

**Location**: `components/admin/delivery/DeliveryForm.tsx`

**Receives from page**:

```ts
props: {
  setting?: Delivery; // undefined = create mode
}
```

**Internal state**:

```ts
{
  city: string;
  delivery_fee: string;
  errors: Record<string, string>;
  isPending: boolean;
}
```

**Validation before submit**:

- `city` non-empty
- `delivery_fee` parses to a number greater than `0`

**Normalization before submit**:

- trim `city`
- parse `delivery_fee` to number

**On submit (create mode)**:

- Call `createDeliverySetting(input)`
- On success: `router.push("/admin/delivery")` then `router.refresh()`
- On duplicate/validation error: stay on page and show error

**On submit (edit mode)**:

- Call `updateDeliverySetting(id, input)`
- On success: `router.push("/admin/delivery")` then `router.refresh()`
- On duplicate/validation error: stay on page and show error

---

### Delivery Pages (Server Components)

**List page**: `app/(admin)/admin/delivery/page.tsx`

- calls `getDeliverySettings()`
- passes `settings` to `DeliveryTable`

**Edit page**: `app/(admin)/admin/delivery/[id]/edit/page.tsx`

- validates numeric `id`
- calls `getDeliverySettingById(id)`
- returns `notFound()` if missing
- passes the loaded record to `DeliveryForm`

**Create page**: `app/(admin)/admin/delivery/new/page.tsx`

- renders `DeliveryForm` without a record prop

---

## Shared Contracts

### `ConfirmDialog`

Promo and delivery delete flows use the existing shared component:

```ts
props: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmTone?: "danger" | "neutral";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

### Admin access model

- Route access is gated by `app/(admin)/admin/layout.tsx`
- Server actions are gated independently by `requireAdmin()`
- UI hiding alone is not sufficient; direct action calls from non-admin users must still fail
