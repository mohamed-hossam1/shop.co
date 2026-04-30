# Data Model: Promotions and Delivery Settings

**Phase**: 1 — Design  
**Feature**: `004-promos-delivery-settings`  
**Date**: 2026-04-30

---

## Entities

### Promo Code (`Coupon`)

Represents a discount rule that checkout can validate and apply.

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Primary key |
| `code` | `string` | Unique code string; trimmed before save |
| `type` | `"percentage" \| "fixed"` | Discount mode |
| `value` | `number` | Positive number; percentage values should stay within `1..100` |
| `used_count` | `number` | Non-negative usage counter |
| `max_uses` | `number \| null` | `null` = unlimited use; `0` = no uses allowed |
| `min_purchase` | `number` | `0` means no minimum purchase requirement |
| `is_active` | `boolean` | Admin-controlled toggle |
| `expires_at` | `string \| null` | `null` = never expires |
| `created_at` | `string` | ISO timestamp |

**Validation rules**:

- `code` is required and unique
- `value > 0`
- `type === "percentage"` implies `1 <= value <= 100`
- `min_purchase >= 0`
- `max_uses === null` or integer `>= 0`
- `expires_at` may be `null`

**Derived flags**:

- `hasUsageCap = max_uses !== null`
- `isUsageCapped = hasUsageCap && used_count >= max_uses`
- `isExpired = expires_at !== null && new Date(expires_at) < now`
- `isOperationallyActive = is_active && !isExpired && !isUsageCapped`

**Important modeling note**:

Promo status filters are predicate-based, not a single stored enum. A promo can satisfy more than one non-active filter at the same time, for example both `inactive` and `expired`.

---

### Delivery Setting

Represents one city-to-fee mapping used during checkout.

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Primary key |
| `city` | `string` | Unique city name; trimmed before save |
| `delivery_fee` | `number` | Positive numeric fee |
| `created_at` | `string` | ISO timestamp |

**Validation rules**:

- `city` is required
- `city` must be unique case-insensitively
- `delivery_fee > 0`

---

## Supporting Inputs / View Models

### Admin Promo Filters

Used by the promo list page and `getPromoCodes()`.

| Field | Type | URL param | Notes |
|---|---|---|---|
| `search` | `string` | `search` | Matches promo code text |
| `status` | `"all" \| "active" \| "inactive" \| "expired" \| "exhausted"` | `status` | `exhausted` is labeled "Usage Capped" in the UI |

---

### Promo Form Draft

Client-side form state for create/edit pages.

| Field | Type | Notes |
|---|---|---|
| `code` | `string` | Raw text input |
| `type` | `"percentage" \| "fixed"` | Select input |
| `value` | `string` | String in form, parsed to number on submit |
| `min_purchase` | `string` | Blank becomes `0` |
| `max_uses` | `string` | Blank becomes `null` |
| `expires_at` | `string` | Blank becomes `null` |
| `is_active` | `boolean` | Checkbox/toggle |

---

### Delivery Form Draft

Client-side form state for create/edit pages.

| Field | Type | Notes |
|---|---|---|
| `city` | `string` | Trim before submit |
| `delivery_fee` | `string` | Parse to number and require `> 0` |

---

## Relationships

```text
coupons ──────┐
              └─ used by validatePromoCode() during cart/checkout pricing

delivery ─────┐
              ├─ getCities() for checkout/profile city selectors
              └─ getDeliveryFee(city) for checkout fee lookup

orders
├─ discount_amount  (historical snapshot; not changed when coupon row is deleted)
├─ city             (historical snapshot; not changed when delivery row is deleted)
└─ delivery_fee     (historical snapshot; not changed when delivery row is deleted)
```

---

## State Transitions

### Promo Code Operational State

Operational state is derived from field changes and time, not explicitly persisted.

```text
created
  ├─ is_active = true, not expired, not capped  → Active
  ├─ is_active = false                          → Inactive
  ├─ expires_at passes current time             → Expired
  └─ used_count reaches max_uses                → Usage Capped
```

Admins can edit the source fields at any time:

- toggle `is_active`
- change `expires_at`
- change `max_uses`
- change the discount value / type / minimum purchase

No optimistic concurrency handling is required; last save wins.

---

### Delivery Setting Lifecycle

```text
create → update fee/city → delete
```

Deletion removes the city from future checkout/profile selection but does not mutate any existing `orders` rows.

---

## Implementation Invariants

1. Promo create/update/delete must stay admin-only server-side.
2. Delivery create/update/delete must stay admin-only server-side.
3. `validatePromoCode()` remains the only shopper-facing promo validation path.
4. `getCities()` and `getDeliveryFee()` remain the only storefront delivery lookups.
5. Historical order data is immutable with respect to source promo and delivery row deletion.
