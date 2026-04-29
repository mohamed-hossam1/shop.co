# Data Model: Admin Orders Operations

**Phase**: 1 — Design  
**Feature**: `003-admin-orders-ops`  
**Date**: 2026-04-30

---

## Entities

### Order

Represents a completed purchase transaction. The single source of truth for fulfillment state.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `number` | Primary key, auto-increment |
| `user_id` | `string \| null` | Auth user ID; null for guest orders |
| `guest_id` | `string \| null` | Guest identifier; null for authenticated orders |
| `status` | `string` | Free-form; standard values are the 5 admin statuses. Legacy values must render. |
| `subtotal` | `number` | Server-computed sum of item prices × quantities |
| `discount_amount` | `number` | Server-computed discount; 0 if no promo |
| `delivery_fee` | `number` | Locked at order creation from `delivery` table |
| `total_price` | `number` | `subtotal + delivery_fee - discount_amount` |
| `payment_method` | `string` | One of: `cash_on_delivery`, `vodafone_cash`, `instapay` |
| `payment_image` | `string \| null` | **Filename string only** — not a URL or stored file |
| `city` | `string` | Delivery city |
| `area` | `string` | Delivery area / district |
| `address_line` | `string` | Street address |
| `notes` | `string \| null` | Optional delivery notes |
| `user_name` | `string` | Customer name captured at checkout |
| `created_at` | `string` | ISO timestamp |

**Computed / derived for UI**:
- `isGuest`: `user_id === null || user_id === undefined`
- `customerLabel`: `user_name` + "(Guest)" suffix when `isGuest`

**Status lifecycle**:
```
pending → confirmed → shipped → delivered
       ↘                              
        cancelled (from any state)
```

Legacy status strings (not in the 5-value set) must be displayed and overwritable by admin.

---

### OrderItem

Immutable snapshot of one product variant line at the time the order was placed. Does not reference live product data.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `number` | Primary key |
| `order_id` | `number` | FK → `orders.id` |
| `variant_id` | `number` | Historical reference; live variant may have changed |
| `quantity` | `number` | Quantity ordered |
| `price_at_purchase` | `number` | Price per unit at order time |
| `product_title` | `string` | Product name snapshot |
| `product_image` | `string` | Product cover image URL snapshot |
| `variant_color` | `string` | Color snapshot |
| `variant_size` | `string` | Size snapshot |

**Derived for UI**:
- `lineTotal`: `price_at_purchase × quantity`

---

### AdminOrderStatus (bounded type)

```
"pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
```

The admin UI treats any other string value as a legacy status: it is displayed as-is and the `OrderStatusSelect` component prepends it to the dropdown so the admin can still save a standard status.

---

### AdminOrderFilters (query parameters)

Controls what `getAdminOrders` returns. All fields optional.

| Field | Type | URL param | Notes |
|-------|------|-----------|-------|
| `search` | `string` | `search` | Matches order ID (numeric) or `user_name` (ilike) |
| `status` | `string` | `status` | One of the 5 standard statuses |
| `paymentMethod` | `string` | `paymentMethod` | Exact match on `payment_method` |
| `customerType` | `"guest"\|"user"` | `customerType` | `guest` = no user_id; `user` = has user_id |
| `dateFrom` | `string` | `dateFrom` | ISO date string, inclusive start |
| `dateTo` | `string` | `dateTo` | ISO date string, inclusive end |

---

## State Transitions

### Order Status

```
Any state → cancelled     (admin discretion)
pending   → confirmed     (payment verified)
confirmed → shipped       (dispatched)
shipped   → delivered     (received)
[legacy]  → [any standard] (normalization)
```

Transitions are not enforced by the application — admins can save any status from any current status. The UI offers all 5 standard options from any state.

---

## Type Mapping to Existing Code

All types already exist in the codebase. No new type files needed.

| Spec Entity | TypeScript Type | File |
|-------------|-----------------|------|
| Order | `Order` | `types/Order.ts` |
| OrderItem | `OrderItem` | `types/Order.ts` |
| AdminOrderStatus | `AdminOrderStatus` | `types/Admin.ts` |
| AdminOrderFilters | `AdminOrderFilters` | `types/Admin.ts` |
| AdminCustomerType | `AdminCustomerType` | `types/Admin.ts` |

---

## Relationships

```
orders (1) ─────────────── (N) order_items
         [user_id] ──────── users (optional)
         [guest_id] ──────── (guest tracking only)
```

The admin orders module reads both sides: orders with `user_id` (registered) and orders with `user_id = null` and a `guest_id` value (guest). The `getAdminOrders` action fetches all without scoping — this is the key difference from the shopper-facing `getUserOrders` action.

---

## Data Limitations

1. **Payment proof**: `payment_image` stores a filename string captured from a local `<input type="file">`. No file upload pipeline exists. The file cannot be retrieved by the admin dashboard.

2. **Promo code reference**: The order stores `discount_amount` but not the original coupon code string or coupon ID. The admin detail view can only show the discount amount applied.

3. **Variant live state**: `order_items` stores snapshots. `variant_id` still exists as a column but the variant data shown is always from the snapshot fields, not a live join.
