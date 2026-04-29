# Feature Specification: Admin Orders Operations

**Feature Branch**: `003-admin-orders-ops`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "Orders Operations — Admin dashboard phase covering order queue, order detail review, and status management for all orders including guest orders."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View All Orders Queue (Priority: P1)

An admin needs to see every order placed on the platform — by both registered customers and guests — in a single, filterable list. Without this, admins must query the database directly to understand fulfillment load. The queue is the operational starting point for every downstream action.

**Why this priority**: Visibility over all orders is the prerequisite for any fulfillment action. Without it, status management and detail review cannot happen.

**Independent Test**: Can be fully tested by signing in as an admin and navigating to `/admin/orders`. The table must show orders from authenticated users and guest orders side-by-side, with correct column data (order ID, customer name/guest label, date, status, total, payment method).

**Acceptance Scenarios**:

1. **Given** an admin is signed in, **When** they navigate to the orders module, **Then** a paginated table displays all orders — including guest orders — with columns for Order ID, Customer, Date, Status, Total, and Payment Method.
2. **Given** the order list is loaded, **When** an admin filters by status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`), **Then** only orders matching that status are shown.
3. **Given** the order list is loaded, **When** an admin filters by payment method (Cash on Delivery, Vodafone Cash, Instapay), **Then** only orders using that method are shown.
4. **Given** the order list is loaded, **When** an admin filters by date range, **Then** only orders created within that range are shown.
5. **Given** the order list is loaded, **When** an admin searches by order ID or customer name, **Then** matching orders are returned instantly and non-matching rows are hidden.
6. **Given** a non-admin authenticated user navigates to `/admin/orders`, **Then** they are denied access and redirected.

---

### User Story 2 - Inspect Order Details (Priority: P1)

An admin selects an order to review its full contents: line items with product snapshots, quantities, and per-item prices; the delivery address; order notes; the payment method; and the payment proof filename (if provided). This is the core review step before taking fulfillment action.

**Why this priority**: Without order detail review, admins cannot verify payment, confirm item correctness, or identify fulfillment issues — making status management meaningless.

**Independent Test**: Can be fully tested by clicking any order row. A detail view (page or drawer) must open and display all order fields — items, address, totals, payment info — without navigating away from the queue.

**Acceptance Scenarios**:

1. **Given** an admin is on the orders list, **When** they click an order row, **Then** an order detail view opens showing: all line items (product title, image, color, size, quantity, price at purchase), subtotal, discount amount, delivery fee, and total price.
2. **Given** the order detail is open, **When** the order used a promo code, **Then** the discount amount is visible alongside the promo code identifier.
3. **Given** the order detail is open, **When** the order has a delivery address, **Then** the full address (name, phone, city, area, street line, notes) is displayed.
4. **Given** the order detail is open, **When** the order includes a payment proof filename, **Then** the filename is displayed with a clear notice that the file is not stored server-side and cannot be retrieved.
5. **Given** the order detail is open, **When** the order is a guest order, **Then** the customer section shows the guest name and phone captured at checkout rather than a user account link.

---

### User Story 3 - Update Order Status (Priority: P2)

An admin moves an order through its lifecycle — from `pending` to `confirmed`, then to `shipped`, then to `delivered`, or cancels it at any point. Each status change must be saved immediately and reflected in the order list without a full page reload.

**Why this priority**: Status management is the main write action in fulfillment. It is P2 because it requires P1 (visibility and detail review) to be meaningful.

**Independent Test**: Can be fully tested from the order detail view by selecting a new status from a dropdown and confirming. The updated status must appear both in the detail view and back in the order list row immediately after saving.

**Acceptance Scenarios**:

1. **Given** an admin is viewing an order detail, **When** they select a new status from the allowed options and confirm, **Then** the order status is updated, and both the detail view and the order list row reflect the new status without a full page reload.
2. **Given** an admin attempts to set a status, **When** the update fails (e.g., network error), **Then** an error message is shown and the order retains its previous status.
3. **Given** an order has a legacy status value not in the standard list, **When** an admin views the order detail, **Then** the legacy status is displayed as-is in the status field, and the admin can normalize it by saving a standard status.
4. **Given** an admin has updated an order status, **When** they return to the order list, **Then** the order row shows the updated status immediately.

---

### User Story 4 - Filter Guest vs. Authenticated Orders (Priority: P3)

An admin needs to distinguish between orders placed by registered customers (who have a user account) and guest orders (placed without authentication). This allows targeted follow-up — for example, contacting a guest by phone for payment confirmation vs. using an account email.

**Why this priority**: Useful operational segmentation, but the core queue (P1) already shows all orders. This adds filtering precision without being blocking.

**Independent Test**: Can be tested by applying a "Customer Type" filter to the order table and confirming that only guest or only registered-customer rows appear.

**Acceptance Scenarios**:

1. **Given** the order list is loaded, **When** an admin filters by "Guest" customer type, **Then** only orders without an associated user account are shown.
2. **Given** the order list is loaded, **When** an admin filters by "Registered" customer type, **Then** only orders linked to a user account are shown.
3. **Given** a guest order is shown in the list, **Then** the customer column displays the guest's name and/or a "Guest" label rather than an account email.

---

### Edge Cases

- What happens when an order has no items (data integrity issue)? The detail view must display a clear "No items found" message rather than crashing.
- How does the system handle an order with a legacy status value outside `pending / confirmed / shipped / delivered / cancelled`? The legacy value is displayed as-is and the admin can overwrite it with a standard status.
- What happens when the admin searches for an order ID that does not exist? An empty state message is shown instead of an error.
- How does the system handle a status update if the underlying order was concurrently modified? The latest server state is shown after save; the admin is notified if the update was rejected.
- What happens when the orders table is empty (no orders placed yet)? An empty state illustration and message are shown instead of an empty table.
- How are very long customer names or addresses handled in the table? Text is truncated with an ellipsis; the full value is visible in the detail view.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a dedicated admin orders section accessible only to users with the `admin` role.
- **FR-002**: The system MUST display all orders — from both authenticated users and guests — in a single paginated list.
- **FR-003**: Admins MUST be able to filter orders by status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
- **FR-004**: Admins MUST be able to filter orders by payment method (Cash on Delivery, Vodafone Cash, Instapay).
- **FR-005**: Admins MUST be able to filter orders by date range (from date, to date).
- **FR-006**: Admins MUST be able to filter orders by customer type (guest vs. registered).
- **FR-007**: Admins MUST be able to search orders by order ID or customer name.
- **FR-008**: The system MUST display a detail view for each order, showing: all line items with product snapshot data (title, image, color, size, quantity, price at purchase), subtotal, discount amount, delivery fee, and total price.
- **FR-009**: The order detail view MUST display the full delivery address (recipient name, phone, city, area, address line, and notes).
- **FR-010**: The order detail view MUST display the payment method and, if provided, the payment proof filename with a visible notice that the file is not stored server-side.
- **FR-011**: Admins MUST be able to change an order's status to any of the five standard statuses from the detail view.
- **FR-012**: The system MUST display legacy (non-standard) order status values as-is and allow admins to overwrite them with a standard status.
- **FR-013**: Status updates MUST be reflected in both the order detail view and the order list row without requiring a full page reload.
- **FR-014**: The system MUST show a clear error message if a status update fails and preserve the order's previous status.
- **FR-015**: Non-admin users MUST be denied access to all admin orders routes and actions, receiving an appropriate rejection response.
- **FR-016**: Guest orders MUST be visually distinguishable from registered-customer orders in the order list (e.g., a "Guest" label in the customer column).
- **FR-017**: The orders list MUST show an empty state message when no orders match the current filters or when no orders exist at all.

### Key Entities

- **Order**: A purchase transaction containing one or more line items. Has a status, payment method, optional payment proof filename, delivery address, totals, and is linked to either a registered user or identified as a guest. Key attributes: ID, customer identity (user or guest), status, payment method, payment proof filename, subtotal, discount, delivery fee, total, created date.
- **Order Item**: A snapshot of a product variant at the time of purchase. Stores product title, image, color, size, quantity, and price paid — independent of live product data. Belongs to one Order.
- **Order Status**: A bounded set of lifecycle values: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`. Legacy status strings outside this set may exist in historical data and must be handled gracefully.
- **Admin User**: A platform user with `role = admin`. The only actor permitted to access the orders administration surface.
- **Guest**: A shopper who placed an order without creating an account. Identified in orders by a name and phone captured at checkout; no user account link exists.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can load the full order list and apply any combination of filters within 2 seconds under normal operating conditions.
- **SC-002**: An admin can navigate from the order list to a complete order detail view in a single interaction (one click).
- **SC-003**: Order status changes are saved and reflected in the UI within 3 seconds of the admin confirming the action.
- **SC-004**: 100% of orders — including guest orders — are visible in the admin orders list; no orders are silently excluded.
- **SC-005**: Non-admin users are denied access to the orders administration surface in 100% of attempts, both at the route and action level.
- **SC-006**: An admin can locate a specific order by ID search in under 5 seconds.
- **SC-007**: The payment-proof limitation (filename-only, no file retrieval) is surfaced to admins in the order detail view for every order that has a proof value stored, preventing incorrect operational assumptions.

---

## Assumptions

- The admin authentication and role-guard foundation (Phase 1) is complete and provides a shared `requireAdmin()` guard that this feature reuses on every admin-only order read and status-update action.
- The existing `orders` and `order_items` schema and the existing `updateOrderStatus()` action are sufficient for the status management flow; no schema changes are needed for this feature.
- A new global order-read action (`getAdminOrders` with filters, and `getAdminOrderById`) must be added because the current order reads are shopper-scoped and do not expose all orders to admin callers.
- The standard admin order status vocabulary is: `pending`, `confirmed`, `shipped`, `delivered`, and `cancelled`. Historical orders may carry other strings, which the UI must render without error.
- Payment screenshots are not stored server-side in any file storage system; only the filename string is persisted in the `orders` table. The admin UI will display the filename and a disclaimer but will not attempt to retrieve or preview the file.
- The order detail view will be implemented as a slide-over drawer or a dedicated detail page within the admin shell; either approach satisfies the spec — the choice is left to the planning phase.
- Pagination strategy (page-based or infinite scroll) for the orders list is left to the planning phase.
- No email or SMS notification is sent to customers when an admin updates an order status in this release.
- Stock is not decremented or adjusted during order status transitions; stock management remains a separate manual concern.
- Guest orders are identified by the absence of a `user_id` value on the order record; guest identity is captured from the name and phone fields stored on the order.
