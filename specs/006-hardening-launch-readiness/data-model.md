# Data Model: Hardening, Integrity, and Launch Readiness

This feature does not introduce new database tables, but it relies on stricter validation and state verification around existing entities.

## Entities

### `orders`
- **Fields used for verification**: `user_id` (UUID, nullable), `guest_id` (String, nullable).
- **Validation**:
  - During checkout, `total_price`, `subtotal`, and `discount_amount` must be calculated on the server.
  - During `order-success` viewing, either `user_id` must match the authenticated session, or `guest_id` must match the browser cookie.

### `product_variants`
- **Fields used for validation**: `price`, `stock`.
- **Validation**:
  - `price` is fetched during checkout to compute true `subtotal`.
  - `stock` is fetched to ensure quantities don't exceed availability (existing logic, but needs ensuring).
  - Admin UI will check `stock <= 5` for "Low Stock" and `stock === 0` for "Out of Stock" warnings.

### `coupons`
- **Validation**:
  - Server-side checkout must fetch the coupon (if provided), verify `is_active`, `expires_at`, `used_count < max_uses`, and `min_purchase <= subtotal`.
  - Discount is calculated based on `type` (percentage or fixed) and `value`.

### `users`
- **Fields used for validation**: `role`.
- **Validation**:
  - Admin mutations require `role === 'admin'`.

## State Transitions
- **Checkout Pricing**: `Client Payload (Untrusted)` -> `Server Lookup (variants, coupons)` -> `Calculated Totals (Trusted)` -> `Order Insert`.
