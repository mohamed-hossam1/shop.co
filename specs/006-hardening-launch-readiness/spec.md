# Feature Specification: Hardening, Integrity, and Launch Readiness

**Feature Branch**: `[006-hardening-launch-readiness]`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "read PLAN.me and AGENTS.md and create specify for Hardening, Integrity, and Launch Readiness"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Order Confirmation Access (Priority: P1)

Shoppers should only be able to view their own order confirmation details, preventing unauthorized exposure of order data via URL guessing.

**Why this priority**: Exposing order details to arbitrary users is a significant privacy and security risk.

**Independent Test**: Can be fully tested by attempting to access an order success page for an order belonging to a different user/guest, expecting an access denial.

**Acceptance Scenarios**:

1. **Given** a user is viewing `/order-success?orderId=123`, **When** they are the owner of the order (via auth ID or guest cookie), **Then** the order details are successfully displayed.
2. **Given** an unauthenticated user or unrelated authenticated user requests `/order-success?orderId=123`, **When** the server processes the request, **Then** access is denied and the user is redirected away or shown an error.

---

### User Story 2 - Resilient Checkout Pricing Integrity (Priority: P1)

The system must calculate final order totals using authoritative database records rather than relying on the client's submitted cart payload.

**Why this priority**: Relying on client-submitted prices allows malicious manipulation of order totals and discounts.

**Independent Test**: Can be fully tested by intercepting checkout submission and modifying variant prices in the payload, verifying the generated order still uses the correct database prices.

**Acceptance Scenarios**:

1. **Given** a shopper submits an order with a tampered cart subtotal, **When** the `createOrder` action runs, **Then** the server calculates the true total by looking up current variant pricing and coupon rules.
2. **Given** a shopper attempts to use an expired or exhausted coupon code, **When** the order is finalized, **Then** the discount is rejected and the order reflects the correct undiscounted total.

---

### User Story 3 - Server-Side Admin Mutation Auditing (Priority: P1)

All destructive and administrative actions must be explicitly guarded by a server-side role check, regardless of UI visibility.

**Why this priority**: Client-side UI hiding is insufficient; direct API/action calls must be prevented for non-admins.

**Independent Test**: Can be fully tested by triggering an admin server action with a standard user session and verifying explicit denial.

**Acceptance Scenarios**:

1. **Given** a user without the 'admin' role, **When** they attempt to directly invoke an admin server action, **Then** the server aborts the action and returns an unauthorized error.
2. **Given** a user with the 'admin' role, **When** they invoke an admin action, **Then** the action proceeds normally.

---

### User Story 4 - Admin Dashboard Stock Visibility (Priority: P2)

Administrators need visibility into low or depleted stock levels while managing orders and products to maintain fulfillment operations.

**Why this priority**: Operational efficiency requires admins to know when items are unavailable or nearing depletion without manually checking each variant.

**Independent Test**: Can be fully tested by setting a variant's stock to 0 or 2, and observing the warnings in the admin product list and order detail views.

**Acceptance Scenarios**:

1. **Given** an admin is viewing the product catalog, **When** a variant has 0 stock, **Then** an "Out of Stock" warning badge is visibly displayed.
2. **Given** an admin is viewing order details, **When** an ordered item has low stock remaining, **Then** a "Low Stock" warning is displayed next to the line item.

---

### User Story 5 - Catalog Write-Path Cache Revalidation (Priority: P2)

Changes made in the admin dashboard must quickly and predictably reflect on the shopper-facing storefront.

**Why this priority**: Without cache revalidation, product updates, delivery fee changes, or stock modifications may not appear to shoppers, leading to confusion or invalid orders.

**Independent Test**: Can be fully tested by updating a product's title in the admin panel and immediately refreshing the public product listing to see the change.

**Acceptance Scenarios**:

1. **Given** an admin modifies product details or merchandising ranks, **When** the update action completes, **Then** the cache for public routes is invalidated and the new data is visible.
2. **Given** an admin changes a delivery fee, **When** the update completes, **Then** the checkout page reflects the new fee on subsequent loads.

### Edge Cases

- What happens when a guest user clears their cookies before accessing the order success page? (Access is denied; they must rely on an email confirmation if any, or support).
- How does system handle concurrent checkout submissions with conflicting low stock? (Out of scope for strict stock decrement per PLAN.me, but late-stage validation should ideally reject if strictly zero).
- What happens if an admin role is removed mid-session while performing actions? (Subsequent server actions must immediately reject based on the current database role).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate `orderId` ownership on the `order-success` page against the authenticated user's ID or the active guest cookie.
- **FR-002**: System MUST calculate `createOrder()` totals using authoritative prices from the database and active rules from valid coupons, ignoring client-submitted price data.
- **FR-003**: System MUST verify the user has an 'admin' role on the server side for all admin-specific server actions (mutations and reads).
- **FR-004**: System MUST display "Low Stock" and "Out of Stock" visual indicators on admin product and order views for relevant variants.
- **FR-005**: System MUST trigger cache revalidation for affected public routes after admin modifications to catalog or delivery data.

### Key Entities

- **Order**: Validated for ownership and accurately priced based on live variants.
- **Product Variant**: Checked for accurate live pricing and stock thresholds.
- **User/Role**: Server-side authorization authority for admin actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unauthorized attempts to access unowned orders via the order success URL are denied.
- **SC-002**: 100% of created orders reflect the true variant prices and valid coupon constraints, regardless of client payload tampering.
- **SC-003**: 100% of admin server actions actively reject requests lacking the appropriate admin role.
- **SC-004**: Storefront accurately reflects catalog, merchandising, and delivery administrative changes immediately after an admin write.

## Assumptions

- The low stock threshold is assumed to be 5 units for displaying warnings.
- System's native cache invalidation mechanisms are sufficient for storefront freshness.
- Guest cookies map reliably to the identifier stored on orders, allowing for guest ownership validation.
