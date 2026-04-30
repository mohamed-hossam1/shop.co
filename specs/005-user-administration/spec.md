# Feature Specification: User Administration

**Feature Branch**: `005-user-administration`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "read PLAN.me and AGENTS.md and create specify for User Administration only"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and Review User Accounts (Priority: P1)

An admin needs a single place to view all platform user accounts and quickly find a specific person by role, email, phone, or account creation date. The list must provide enough account context for operational decisions without leaving the screen.

**Why this priority**: Account lookup is the entry point for every other user-administration action. Without reliable search and filtering, role updates and access removal are slow and error-prone.

**Independent Test**: Can be fully tested by opening the user administration area, applying each filter type, and confirming the expected account subset appears.

**Acceptance Scenarios**:

1. **Given** an authenticated admin opens user administration, **When** the user list loads, **Then** all current user accounts are displayed with name, email, phone, role, and account creation date.
2. **Given** the admin enters an email or phone query, **When** they submit the search, **Then** only matching user accounts are displayed.
3. **Given** the admin applies a role filter, **When** the list refreshes, **Then** only users with the selected role are displayed.
4. **Given** the admin applies a created-date filter, **When** the list refreshes, **Then** only users created in the selected range are displayed.

---

### User Story 2 - Manage Roles from User Detail (Priority: P2)

An admin needs to open a user detail view, review the account profile, review related order history for that user, and update that user’s platform role when needed.

**Why this priority**: Role management controls privileged access and is a critical operational function, but it depends on first finding the correct account.

**Independent Test**: Can be fully tested by selecting one account from the list, reviewing profile and order history, changing the role, and confirming access behavior changes accordingly.

**Acceptance Scenarios**:

1. **Given** the admin opens a user detail view, **When** the page loads, **Then** the user’s profile information and related order history are displayed together.
2. **Given** the admin changes a user role and confirms the change, **When** the update succeeds, **Then** the new role is saved and reflected in subsequent access checks.
3. **Given** the admin attempts a role change without required permissions, **When** the request is submitted, **Then** the request is rejected and no role change is saved.

---

### User Story 3 - Remove Platform Access Safely (Priority: P3)

An admin needs to remove a user’s ability to sign in through a clearly destructive flow with explicit confirmation, while preserving historical commerce records.

**Why this priority**: Access removal is lower-frequency than search and role changes, but it is high-impact and must be explicit to avoid accidental lockout or data-loss assumptions.

**Independent Test**: Can be fully tested by removing access for a non-admin user, confirming sign-in is blocked afterward, and verifying historical order records remain unchanged.

**Acceptance Scenarios**:

1. **Given** the admin initiates access removal for a user, **When** they complete explicit confirmation, **Then** the user loses platform sign-in access.
2. **Given** access is removed for a user with prior orders, **When** order history is reviewed after removal, **Then** historical order records remain available and unchanged.
3. **Given** the admin cancels the destructive confirmation step, **When** the flow exits, **Then** no access removal occurs.

---

### Edge Cases

- A role change request targets a user account that no longer exists by the time the action is submitted.
- Two admins update the same user role nearly simultaneously; the system must keep one final persisted role and show accurate final state on refresh.
- An access-removal request is submitted for a user who is already unable to sign in; the system should return a clear no-op result instead of failing silently.
- Access removal is attempted for a user with extensive historical orders; order records and totals must remain intact.

## Requirements *(mandatory)*

### Functional Requirements

**User Discovery and Detail**

- **FR-001**: The system MUST provide an admin-only user list that displays all user accounts with core profile fields needed for administration.
- **FR-002**: Admins MUST be able to search the user list by email and phone.
- **FR-003**: Admins MUST be able to filter the user list by role and account creation date.
- **FR-004**: The system MUST provide a user detail view that includes profile data and related order history for that user.

**Role Management**

- **FR-005**: Admins MUST be able to change a user’s role from the user detail context.
- **FR-006**: Role changes MUST take effect in authorization checks on the user’s next protected request.
- **FR-007**: The system MUST reject role updates from non-admin callers at the action layer, even if the UI is bypassed.

**Access Removal**

- **FR-008**: The system MUST provide a destructive access-removal flow with an explicit confirmation step before execution.
- **FR-009**: After confirmed access removal, the affected user MUST no longer be able to sign in.
- **FR-010**: Access removal MUST preserve historical commerce records, including orders and order line snapshots.
- **FR-011**: The system MUST clearly communicate what is removed (platform access) and what is preserved (historical commerce records).

**Authorization Boundaries**

- **FR-012**: Only authenticated admins MUST be able to access user-administration views and actions.
- **FR-013**: Non-admin access attempts to user-administration actions MUST be denied server-side.

### Key Entities *(include if feature involves data)*

- **User Account**: A platform identity record used for sign-in and account-level access control, with attributes such as name, email, phone, role, and creation date.
- **Role Assignment**: The privilege level associated with a user account that determines whether admin-only capabilities are allowed.
- **Access Removal Event**: A destructive administrative action that revokes sign-in capability for a selected user account.
- **User Order History**: Historical purchase records associated with a user account, preserved for business and audit continuity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of user-account lookup tasks (find by role/email/phone/date) are completed by admins in under 30 seconds.
- **SC-002**: 100% of successful role changes are reflected in protected-access behavior on the affected user’s next request.
- **SC-003**: 100% of confirmed access-removal actions prevent subsequent sign-in attempts for the affected user.
- **SC-004**: 100% of access-removal actions preserve historical order records without changes to existing order totals or line snapshots.
- **SC-005**: 100% of non-admin attempts to execute user-administration actions are rejected.

## Assumptions

- Admin foundation and authentication gating already exist and are reused for this module.
- The first release supports direct per-user actions (view, role change, access removal) and excludes bulk-edit workflows.
- The role model contains one privileged administrator role; non-admin roles are treated as non-privileged for admin access checks.
- Removing a user means revoking platform access, not deleting or rewriting historical commerce records.
- User detail order history is limited to existing order records already tied to that user account.
