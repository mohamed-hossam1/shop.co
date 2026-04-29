# Feature Specification: Admin Foundation and Access Control

**Feature Branch**: `001-admin-foundation`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "Admin Foundation and Access Control — Phase 1 from PLAN.me"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unauthenticated Visitor Blocked from Admin (Priority: P1)

A visitor who is not signed in attempts to access any page under the admin area. The system immediately redirects them to the sign-in page without exposing any admin content.

**Why this priority**: This is the foundational security guarantee. Without it, all other admin features are exposed to the public internet. Every subsequent phase depends on this gate being in place.

**Independent Test**: Can be fully tested by loading `/admin` (or any admin sub-path) in a private browser window and confirming the redirect to sign-in. Delivers value by proving the entry point is protected.

**Acceptance Scenarios**:

1. **Given** a visitor with no active session, **When** they navigate to `/admin`, **Then** they are redirected to the sign-in page and cannot view any admin content.
2. **Given** a visitor with no active session, **When** they navigate to `/admin/products`, **Then** they are redirected to the sign-in page.
3. **Given** a visitor with no active session, **When** they attempt to invoke an admin write operation directly, **Then** the operation is rejected with an authorization error and no data is modified.

---

### User Story 2 - Non-Admin Authenticated User Blocked from Admin (Priority: P1)

A signed-in customer (non-admin) attempts to access the admin area. The system recognizes their role and denies access, showing a clear "access denied" message rather than leaking admin content or redirecting to sign-in.

**Why this priority**: Equal priority to P1 because a signed-in non-admin user bypasses the unauthenticated check. Role enforcement at the admin boundary is the second tier of the two-tier security model.

**Independent Test**: Can be tested by signing in with a regular customer account and navigating to `/admin`. The system should display an access denied state without exposing any admin navigation or data.

**Acceptance Scenarios**:

1. **Given** a signed-in user whose role is not "admin", **When** they navigate to `/admin`, **Then** they see an access-denied message and no admin navigation or data is visible.
2. **Given** a signed-in non-admin user, **When** they attempt to invoke an admin write operation directly (e.g., by constructing a direct request), **Then** the operation is rejected server-side and no data is modified.
3. **Given** a signed-in non-admin user who is shown the access-denied state, **When** they click a back or home link, **Then** they are returned to the storefront without errors.

---

### User Story 3 - Admin User Reaches the Admin Landing Page (Priority: P2)

A signed-in admin user navigates to the admin area and sees a landing page that lists the available management modules with clear navigation links. The page does not contain reporting widgets or analytics.

**Why this priority**: This unlocks the shell that all future phases plug into. Without a working admin landing page and navigation, no subsequent admin module has a home.

**Independent Test**: Can be tested by signing in with an admin account, navigating to `/admin`, and confirming the landing page renders with navigation links to each planned module (Products, Categories, Orders, Promo Codes, Delivery, Users). No data widgets need to be functional for this test to pass.

**Acceptance Scenarios**:

1. **Given** a signed-in admin user, **When** they navigate to `/admin`, **Then** they see the admin landing page with navigation links to all planned modules and their own name or identifier in the admin header.
2. **Given** a signed-in admin user on the landing page, **When** they click a module link, **Then** they are taken to that module's area (which may show an empty state if not yet built).
3. **Given** a signed-in admin user, **When** they navigate between admin sections, **Then** breadcrumb indicators correctly reflect their current location within the admin hierarchy.

---

### User Story 4 - Admin Can Sign Out from the Admin Area (Priority: P2)

A signed-in admin user can sign out from within the admin shell without needing to navigate back to the storefront first.

**Why this priority**: Basic operational hygiene for admin sessions, especially on shared devices. Needed for the shell to be considered complete.

**Independent Test**: Can be tested by signing in as an admin, navigating to `/admin`, clicking the sign-out control, and confirming redirection to the sign-in page with the session cleared.

**Acceptance Scenarios**:

1. **Given** a signed-in admin user in the admin area, **When** they activate the sign-out control, **Then** their session is ended and they are redirected to the sign-in page.
2. **Given** a user who has just signed out from the admin area, **When** they press the browser back button, **Then** they are redirected to sign-in rather than seeing cached admin content.

---

### Edge Cases

- What happens when a user's role is changed from "admin" to a non-admin role while they have an active admin session? The next page load or action within the admin area should deny access.
- What happens when the sign-in page redirects back to `/admin` after a successful login for a non-admin user? The system should show the access-denied state, not an error.
- What happens if the admin area receives a request with a malformed or expired session token? The user is treated as unauthenticated and redirected to sign-in.
- What happens when an admin navigates to a module path that does not yet exist (future phases)? The system shows a graceful "not found" or "coming soon" state rather than an unhandled error.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST deny access to all pages under the admin area for any visitor without an active authenticated session, redirecting them to the sign-in page.
- **FR-002**: The system MUST deny access to all pages under the admin area for any signed-in user whose role is not "admin", displaying a clear access-denied message.
- **FR-003**: The system MUST enforce the admin role check server-side on every admin write operation, independently of any UI-level restrictions, so that direct invocations are also rejected.
- **FR-004**: The system MUST display an admin landing page to authenticated admin users that lists navigation links to all planned management modules.
- **FR-005**: The admin shell MUST include a persistent navigation sidebar that remains visible across all admin sections and clearly indicates the currently active section.
- **FR-006**: The admin shell MUST include a header that displays at minimum the signed-in admin user's name or identifier.
- **FR-007**: The admin shell MUST display breadcrumb navigation that reflects the user's current location within the admin hierarchy.
- **FR-008**: The admin shell MUST provide a sign-out control accessible from any admin page.
- **FR-009**: The system MUST provide consistent loading states within the admin shell while data is being fetched, so that the admin never sees broken or partially loaded layouts.
- **FR-010**: The system MUST provide consistent mutation feedback (success and error states) within the admin shell so that admins know the result of every write action they take.
- **FR-011**: The admin landing page MUST NOT include reporting widgets, analytics charts, or aggregated metrics in this phase; it is navigation-only.
- **FR-012**: The admin area MUST be structurally isolated from the storefront shell, using its own layout that does not render the storefront navbar or footer.

### Key Entities

- **Admin User**: A registered user whose role is set to "admin". Has full access to the admin area and all admin write operations.
- **Non-Admin User**: A registered user with any role value other than "admin". Has zero access to the admin area.
- **Admin Session**: An active authenticated session belonging to an admin user. The system validates both the presence of a session and the admin role on every admin request.
- **Admin Module**: A top-level management section within the admin area (Products, Categories, Orders, Promo Codes, Delivery, Users). Represented as a navigation link on the landing page.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unauthenticated requests to any admin path result in a redirect to sign-in, with no admin content rendered.
- **SC-002**: 100% of authenticated non-admin requests to any admin path result in an access-denied response, with no admin content rendered.
- **SC-003**: 100% of admin write operations reject non-admin callers server-side even when invoked directly, without relying on UI-level hiding.
- **SC-004**: An admin user can navigate from the landing page to any planned module link and back within 2 clicks, with no broken navigation paths.
- **SC-005**: The admin shell is stable enough that any future management module can be added by a developer without modifying the shell's layout, navigation, or access control logic.
- **SC-006**: Zero unhandled error states are visible to admin users during normal navigation within the shell; all loading and empty states are handled gracefully.

---

## Assumptions

- The "admin" role value is the single privileged role in this release. Any user whose role field does not exactly equal "admin" is treated as a non-admin. No other role hierarchy is introduced in Phase 1.
- The admin landing page lists all six planned modules (Products, Categories, Orders, Promo Codes, Delivery, Users) as navigation links, even if those modules have no content yet.
- Sign-out from the admin area redirects to the storefront sign-in page, not to a separate admin sign-in page.
- The admin area uses its own dedicated layout shell that is completely separate from the storefront navbar and footer. No shared layout components are reused between the storefront and admin shells.
- Role-enforcement logic is centralized in a single shared guard that every admin operation calls, rather than being duplicated per operation.
- The admin shell's visual design is functional and clear but is not required to match the storefront's premium aesthetic; readability and operational clarity take priority.
- No reporting, analytics, order counts, revenue figures, or any aggregated metrics appear on the admin landing page in this phase.
- Middleware-level protection handles the unauthenticated redirect (before the page renders). Role-level enforcement happens both in the layout and server-side in every admin action as a defense-in-depth approach.
- The existing `users.role` field in the database is already present and populated for at least one admin user before this phase can be validated end-to-end.
