# Research: Hardening, Integrity, and Launch Readiness

This document captures findings for the unknowns identified during the planning phase for the Hardening, Integrity, and Launch Readiness feature.

## Testing Framework

- **Decision**: Manual testing via verified user scenarios and independent tests defined in the feature spec.
- **Rationale**: The shop.co repository (`AGENTS.md`) lacks an automated test suite (e.g., Jest, Playwright). Adopting an entirely new test framework is out of scope for this readiness feature. Testing will rely on the Next.js dev server and rigorous manual verification of access denial and data integrity scenarios.
- **Alternatives considered**: Setting up Playwright for E2E testing (rejected due to out-of-scope setup time).

## Order Ownership Verification (`order-success`)

- **Decision**: Validate the `order.user_id` against the Supabase session ID, or the `order.guest_id` against the `guest-id` cookie.
- **Rationale**: The `orders` table tracks both `user_id` and `guest_id`. The `order-success` page receives an `orderId`. Before rendering, it should fetch the order and compare ownership fields with the current visitor's credentials.
- **Alternatives considered**: Relying on a cryptographic token in the URL (rejected because it requires schema changes and email dispatch logic not currently prioritized).

## Checkout Price Recalculation

- **Decision**: Refactor `createOrder` to discard client-submitted totals and instead fetch current `product_variants` and `coupons`, computing the subtotal, discount, and total dynamically.
- **Rationale**: Client payloads are inherently untrusted. The server must be the ultimate authority on pricing to prevent malicious manipulation.
- **Alternatives considered**: None. Server-side price authority is a non-negotiable e-commerce standard.

## Admin Role Verification

- **Decision**: Enforce an explicit server-side role check (`user.role === 'admin'`) at the top of all admin-only server actions.
- **Rationale**: Next.js Server Actions are exposed as public endpoints. Even if UI elements are hidden, the actions can be invoked directly. The existing `GetUser()` action retrieves the user profile, which includes the `role` field.
- **Alternatives considered**: Relying only on the `requireAdmin` middleware (rejected because middleware doesn't fully protect direct POST requests to server actions out-of-the-box).

## Cache Revalidation for Catalog Writes

- **Decision**: Use Next.js `revalidatePath` inside admin mutation actions (e.g., `updateFullProduct`, `updateCategory`, `updateDeliveryFee`).
- **Rationale**: Next.js aggressively caches route segments. When admins update products or fees, the storefront (`/`, `/products`, `/checkout`) must reflect these changes. `revalidatePath('/', 'layout')` will reliably clear the cache for the entire site.
- **Alternatives considered**: Time-based revalidation (rejected because it doesn't provide immediate feedback to admins). Tag-based revalidation (good, but `revalidatePath('/', 'layout')` is simpler and guarantees freshness across all pages).
