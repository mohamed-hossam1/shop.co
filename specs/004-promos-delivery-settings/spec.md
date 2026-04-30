# Feature Specification: Promotions and Delivery Settings

**Feature Branch**: `004-promos-delivery-settings`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "read PLAN.me and create specify for Promotions and Delivery Settings"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Manage Promo Codes (Priority: P1)

An admin needs to see all promotional codes in the system — active, inactive, expired, and usage-capped — from a single list screen. From this list, they can create new promo codes, edit existing ones, or delete codes that are no longer needed. Each promo code row shows enough context (type, value, usage, expiry, status) to allow the admin to make decisions without opening a detail page.

**Why this priority**: Promotions directly affect checkout revenue. Admins currently have no UI to view or manage promo codes; every change requires direct database edits. This is the highest operational pain point for the feature.

**Independent Test**: Can be fully tested by navigating to the promo-code admin screen, creating a new percentage-off promo, verifying it appears in the list with correct values, editing it, and then deleting it — without touching delivery settings.

**Acceptance Scenarios**:

1. **Given** the admin is authenticated and on the promo-codes admin screen, **When** the list loads, **Then** all promo codes in the system are displayed with their code, discount type, discount value, minimum purchase, usage count, usage cap, expiry date, and active status.
2. **Given** the admin is on the promo-codes admin screen, **When** they apply the "Active" filter, **Then** only promo codes where `is_active` is true AND not yet expired AND not yet usage-capped are shown.
3. **Given** the admin is on the promo-codes admin screen, **When** they apply the "Expired" filter, **Then** only promo codes whose expiry date is in the past are shown.
4. **Given** the admin is on the promo-codes admin screen, **When** they apply the "Usage Capped" filter, **Then** only promo codes where `used_count >= max_uses` are shown.
5. **Given** the admin fills in the promo code creation form with a valid, unique code, discount type, value, and minimum purchase, **When** they submit, **Then** the new promo code appears in the list and is immediately usable at checkout.
6. **Given** the admin edits an existing promo code and changes the discount value, **When** they save, **Then** the updated value is reflected in both the list and at checkout validation.
7. **Given** the admin clicks delete on a promo code, **When** they confirm the destructive action, **Then** the promo code is permanently removed and no longer accepted at checkout.
8. **Given** the admin attempts to create a promo code with a code string that already exists, **When** they submit, **Then** the system rejects the submission with a clear duplicate-code error message.

---

### User Story 2 - View and Manage Delivery Cities and Fees (Priority: P2)

An admin needs to manage the city-to-delivery-fee mapping that drives the checkout fee calculation. They can view all configured cities, add new cities with their corresponding fees, edit fees for existing cities, and remove cities that are no longer served. Any change takes effect for shoppers at the next checkout without requiring a deployment.

**Why this priority**: Delivery fees are a direct checkout dependency. Incorrect or missing city data breaks the checkout fee lookup for affected cities. However, promo codes are changed more frequently in day-to-day operations, making them P1.

**Independent Test**: Can be fully tested by navigating to the delivery admin screen, adding a new city with a fee, verifying it appears in the checkout city dropdown, editing the fee, and then deleting the city — without touching promo codes.

**Acceptance Scenarios**:

1. **Given** the admin is on the delivery admin screen, **When** the list loads, **Then** all city-fee entries are displayed with the city name and delivery fee amount.
2. **Given** the admin fills in the city creation form with a unique city name and a positive numeric fee, **When** they submit, **Then** the new city appears in the list and is available for selection in the checkout flow.
3. **Given** the admin edits the delivery fee for an existing city, **When** they save, **Then** the checkout fee for that city reflects the new value on the next lookup.
4. **Given** the admin clicks delete on a delivery city entry, **When** they confirm, **Then** the city is removed and no longer appears in the checkout city dropdown.
5. **Given** the admin attempts to add a city name that already exists in the delivery table, **When** they submit, **Then** the system rejects the entry with a clear duplicate-city error message.
6. **Given** the admin enters a delivery fee that is not a positive number, **When** they submit, **Then** the system rejects the entry with a clear validation error.

---

### User Story 3 - Filter Promo Codes by Status (Priority: P3)

An admin running a campaign review needs to quickly isolate promo codes by their operational status — active, inactive, expired, or usage-capped — to assess what is currently live, what has wound down, and what needs to be cleaned up.

**Why this priority**: Filtering adds significant operational efficiency over scrolling through a growing list, but the base list (P1) already delivers value without it.

**Independent Test**: Can be fully tested by creating promo codes in different states and verifying that each filter returns only the expected subset.

**Acceptance Scenarios**:

1. **Given** promo codes in various states exist, **When** the admin selects the "Inactive" filter, **Then** only codes where `is_active` is false are shown.
2. **Given** the admin selects "All" (default), **When** the list loads, **Then** all promo codes regardless of status are displayed.
3. **Given** the admin switches between filter states, **When** a new filter is selected, **Then** the list updates immediately without a full page reload.

---

### Edge Cases

- What happens when an admin deletes a promo code that has already been used in existing orders? The promo code must be removed from the available list and checkout validation, but historical `orders.discount_amount` records must not be modified.
- What happens when an admin deletes a delivery city that is referenced in historical orders? The city must be removed from the checkout dropdown, but the city name stored in `orders.city` must not be altered.
- How does the system handle a delivery fee edit while a shopper is mid-checkout with the old fee? The new fee takes effect on the next checkout load; in-progress checkout sessions are not retroactively updated.
- What happens when two admins simultaneously edit the same promo code? The last save wins; no optimistic conflict detection is required in this release.
- What happens if a promo code has no expiry date? It is treated as never-expiring and is only bounded by `max_uses` and `is_active`.
- What happens if `max_uses` is null or zero? A null `max_uses` means unlimited use; zero should be treated as "no uses allowed" and the code is effectively inactive regardless of `is_active`.

## Requirements *(mandatory)*

### Functional Requirements

**Promo Code Management**

- **FR-001**: The system MUST provide an admin screen listing all promo codes, regardless of their active, expired, or usage-capped status.
- **FR-002**: The promo code list MUST display, for each code: code string, discount type (percentage or fixed), discount value, minimum purchase threshold, current usage count, maximum usage cap, expiry date, and active/inactive status.
- **FR-003**: Admins MUST be able to filter the promo code list by status: All, Active, Inactive, Expired, and Usage Capped.
- **FR-004**: Admins MUST be able to create a new promo code by providing a unique code string, discount type, discount value, optional minimum purchase, optional maximum usage cap, optional expiry date, and active toggle.
- **FR-005**: The system MUST reject promo code creation if the code string already exists, displaying a clear error message to the admin.
- **FR-006**: Admins MUST be able to edit any field of an existing promo code and save changes, with the updated values taking effect immediately at checkout validation.
- **FR-007**: Admins MUST be able to permanently delete a promo code after confirming a destructive-action prompt.
- **FR-008**: The system MUST preserve the existing promo validation rules (expiry, usage cap, minimum purchase, active flag) enforced by `validatePromoCode()`; admin edits change the stored data, not the validation logic.

**Delivery Settings Management**

- **FR-009**: The system MUST provide an admin screen listing all city-to-delivery-fee entries currently configured.
- **FR-010**: The delivery list MUST display, for each entry: city name and delivery fee amount.
- **FR-011**: Admins MUST be able to add a new city-fee entry by providing a unique city name and a positive numeric fee.
- **FR-012**: The system MUST reject city creation if the city name already exists, displaying a clear duplicate-city error message.
- **FR-013**: The system MUST reject city creation or editing if the fee is not a positive number.
- **FR-014**: Admins MUST be able to edit the delivery fee for an existing city, with changes reflected in checkout fee lookup on the next request.
- **FR-015**: Admins MUST be able to delete a city-fee entry after confirming a destructive-action prompt; deletion must not alter historical order records that already reference the city.
- **FR-016**: The system MUST trigger a checkout page data refresh after delivery changes so the storefront city list and fee lookup stay current.

**Access Control**

- **FR-017**: Only authenticated users with admin role MUST be able to access, create, edit, or delete promo codes and delivery settings.
- **FR-018**: Non-admin requests to promo or delivery admin actions MUST be rejected server-side, not only hidden in the UI.

### Key Entities *(include if feature involves data)*

- **Promo Code (Coupon)**: Represents a discount rule available at checkout. Key attributes: unique code string, discount type (percentage/fixed), discount value, minimum purchase amount, maximum usage count, current usage count, expiry date, and active status.
- **Delivery Setting**: Represents a city-to-fee mapping used by checkout to calculate shipping. Key attributes: city name (unique), delivery fee (positive number).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can create, edit, and delete a promo code entirely from the admin UI without touching the database directly; the entire flow completes in under 60 seconds.
- **SC-002**: Admins can add, edit, and remove a delivery city-fee entry entirely from the admin UI; changes are reflected in the checkout city selection on the very next shopper request.
- **SC-003**: The promo code status filters correctly isolate Active, Inactive, Expired, and Usage Capped subsets, with 0% cross-contamination between filter states.
- **SC-004**: Duplicate promo code creation attempts are rejected 100% of the time with a user-readable error, with no duplicate rows created in the database.
- **SC-005**: Duplicate city creation attempts are rejected 100% of the time, with a user-readable error.
- **SC-006**: Admin promo and delivery mutations are rejected server-side for non-admin callers 100% of the time, even when called directly outside the UI.
- **SC-007**: Deleting a promo code or delivery city does not modify any historical order record data — verified by checking order rows before and after deletion.

## Assumptions

- The admin dashboard shell (Phase 1) is already implemented; promo and delivery screens plug into the existing admin layout and sidebar navigation.
- The existing `validatePromoCode()` logic is the source of truth for promo validation rules; this feature only adds the admin CRUD surface, not new validation behavior.
- Promo codes are permanently deleted, not soft-deleted; the assumption is that historical discount amounts are captured in `orders.discount_amount` and do not require the coupon row to persist.
- Delivery settings use a simple city string as the unique key (same as current `delivery` table behavior); no geographic hierarchy or postal-code matching is introduced.
- Delivery fees are stored and displayed as flat numeric values (e.g., Egyptian Pounds); no currency conversion or multi-currency support is in scope.
- Image or file uploads are not involved in either promo or delivery management.
- The admin list screens do not require server-side pagination in the first release; all promo codes and delivery cities are expected to fit comfortably in a single page load at current data volumes.
- A "promo listing" server action (`getPromoCodes`) does not currently exist and must be added as part of this feature.
- Admin delivery actions (`getDeliverySettings`, `createDeliverySetting`, `updateDeliverySetting`, `deleteDeliverySetting`) do not currently exist and must be added.
- All mutation feedback (success/error) follows the existing admin toast/notification pattern established in the admin shell.
