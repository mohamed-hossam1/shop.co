# Implementation Plan: User Administration

**Branch**: `005-user-administration` | **Date**: 2026-04-30 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/005-user-administration/spec.md`

---

## Summary

Deliver the missing `/admin/users` module so admins can find user accounts, inspect profile + order history, change roles, and remove sign-in access with explicit destructive confirmation. The codebase already has most action-layer primitives (`getAdminUsers`, `getAdminUserById`, `updateUserRole`, `deleteUserAccess`, and `getAdminOrders`), so implementation focuses on:

1. Building list/detail admin pages and table/detail components under `app/(admin)/admin/users`.
2. Extending user list filters with created-date range support.
3. Hardening access removal semantics to enforce explicit confirmation and clearer preservation messaging.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16 App Router  
**Primary Dependencies**: React 19, Tailwind CSS 4, Supabase SSR, Headless UI, Lucide React  
**Storage**: Supabase PostgreSQL (`users`, `orders`, `order_items`) + Supabase Auth admin API for access removal  
**Testing**: Manual browser verification for admin/auth flows; no automated test suite exists in-repo  
**Target Platform**: Web application (desktop-primary admin surface, mobile-safe layouts)  
**Project Type**: Single Next.js App Router application using server actions as backend boundary  
**Performance Goals**: Admin user list and detail data load in <2s for typical admin queries; role/access mutations reflect in <3s after refresh  
**Constraints**: No `app/api` additions, preserve existing server-action return patterns, keep historical order records unchanged after access removal, enforce admin-only server checks  
**Scale/Scope**: Internal admin-only module; account-level actions (no bulk operations in this phase)

---

## Constitution Check

The constitution file (`.specify/memory/constitution.md`) is an unfilled template, so no enforceable project-specific constitution gates are defined. Applying active repo constraints from `AGENTS.md`:

- ✅ **Architecture guard**: stay on App Router + server actions; no new HTTP API layer.
- ✅ **Authorization guard**: admin views remain under admin layout gate and all admin actions remain `requireAdmin()` protected.
- ✅ **Data integrity guard**: access removal revokes sign-in only and preserves historical order data.
- ✅ **Contract guard**: preserve existing `{ success, data?, message? }` action response style.
- ✅ **UI consistency guard**: reuse `AdminUI` primitives and existing admin route/component patterns.
- ✅ **Complexity guard**: no new packages, no schema migration required for first release.

Post-design re-check: still passes.

---

## Project Structure

### Documentation (this feature)

```text
specs/005-user-administration/
├── spec.md              ✅ Complete
├── research.md          ✅ Complete
├── data-model.md        ✅ Complete
├── quickstart.md        ✅ Complete
├── contracts/
│   └── ui-contracts.md  ✅ Complete
├── plan.md              ← This file
└── tasks.md             ← Phase 2 output (/speckit-tasks command)
```

### Source Code

```text
app/(admin)/admin/users/
├── page.tsx                        [NEW] User list page
└── [id]/
    └── page.tsx                    [NEW] User detail page

components/admin/users/
├── UserTable.tsx                   [NEW] Filterable user list
├── UserFilterBar.tsx               [NEW] Search/role/date filter controls
├── UserProfileCard.tsx             [NEW] User profile + role panel
└── UserOrdersTable.tsx             [NEW] User-scoped order history table

components/admin/
├── UserRoleSelect.tsx              [MODIFY] Keep role-update flow + feedback
├── DeleteUserAccessButton.tsx      [MODIFY] Move from window.confirm to shared ConfirmDialog pattern
└── ConfirmDialog.tsx               [EXISTING — reused]

actions/
├── userAction.ts                   [MODIFY] Date-range user filters + explicit access-removal confirmation contract
└── ordersAction.ts                 [EXISTING — reused userId filter support]

types/
├── Admin.ts                        [MODIFY] Extend AdminUserFilters with created-date range
└── User.ts                         [EXISTING — reused]

lib/
├── admin.ts                        [EXISTING — role/status helpers reused]
├── auth/admin.ts                   [EXISTING — admin guard reused]
└── admin/revalidate.ts             [EXISTING — revalidateUserPaths reused]

constants/
└── routes.ts                       [EXISTING — ADMIN_USERS already defined]
```

**Structure Decision**: Follow the same admin module pattern already used by products/orders/promo/delivery: server pages load and validate data, client components handle filter UX and mutation interactions, server actions enforce authorization and persistence.

---

## Proposed Changes

### A. Extend User Action Layer for Spec Completeness

#### `types/Admin.ts` [MODIFY]

Extend:

- `AdminUserFilters` with:
  - `dateFrom?: string`
  - `dateTo?: string`

This closes the missing created-date filter requirement (FR-003).

#### `actions/userAction.ts` [MODIFY]

1. `getAdminUsers(filters)`
- Keep current `search` + `role` behavior.
- Add created-date range filters on `users.created_at` using `gte/lte`.
- Keep admin server guard (`requireAdmin()`).

2. Access removal hardening
- Keep `deleteUserAccess` admin guard and self-protection.
- Require explicit confirmation input in the action contract (for example, a required `confirmRemoval: true` flag or confirmation token).
- Keep actual auth revocation via Supabase admin delete.
- Return explicit success copy clarifying behavior: access removed, historical order records preserved.

3. Privileged helper boundary
- Keep the raw auth-delete helper internal to `userAction.ts` (not public admin UI surface) so role checks stay centralized in `deleteUserAccess`.

---

### B. Add `/admin/users` List Page

#### `app/(admin)/admin/users/page.tsx` [NEW]

Server page responsibilities:

1. Parse `searchParams` into `AdminUserFilters` (`search`, `role`, `dateFrom`, `dateTo`).
2. Call `getAdminUsers(filters)`.
3. Render `AdminPageHeader` with module description.
4. Pass fetched users + active filters into `UserTable`.

Expected query params:
- `search`
- `role` (`admin` or `user`)
- `dateFrom` (YYYY-MM-DD)
- `dateTo` (YYYY-MM-DD)

---

### C. Add `/admin/users/[id]` Detail Page

#### `app/(admin)/admin/users/[id]/page.tsx` [NEW]

Server page responsibilities:

1. Validate `id` route param as non-empty string (UUID-like user ID).
2. Load profile via `getAdminUserById(userId)`.
3. Load order history via `getAdminOrders({ userId })`.
4. Render:
- user profile panel (name/email/phone/role/created date)
- role management control (`UserRoleSelect`)
- destructive access-removal control (`DeleteUserAccessButton`)
- user-scoped order history list with links to `/admin/orders/[id]`
5. Handle missing users with `notFound()`.

This satisfies FR-004 while reusing existing order admin reads.

---

### D. Build Users UI Components

#### `components/admin/users/UserFilterBar.tsx` [NEW]

- URL-driven filter controls mirroring existing admin conventions.
- Debounced search input (email/phone/name).
- Role select.
- Date-from/date-to inputs.
- Clear filters action.

#### `components/admin/users/UserTable.tsx` [NEW]

- Table columns: Name, Email, Phone, Role, Created, Actions.
- Role badge rendering via `AdminStatusBadge` / `getRoleTone`.
- Empty states aligned with existing admin modules.
- Actions:
  - `View` → `/admin/users/[id]`

#### `components/admin/users/UserProfileCard.tsx` [NEW]

- Displays core account metadata.
- Embeds `UserRoleSelect` for role update.
- Shows local mutation feedback and refresh behavior.

#### `components/admin/users/UserOrdersTable.tsx` [NEW]

- User-specific order history snapshot.
- Columns: Order ID, Date, Status, Total, Payment, Action.
- Empty state for users with no orders.
- `View Order` links to existing admin order detail route.

---

### E. Standardize Destructive UX for Access Removal

#### `components/admin/DeleteUserAccessButton.tsx` [MODIFY]

- Replace `window.confirm(...)` with shared `ConfirmDialog` for consistency with other admin destructive actions.
- Keep destructive messaging explicit:
  - what changes: sign-in access removed
  - what remains: historical order records preserved
- Pass required confirmation payload expected by updated `deleteUserAccess` action.

---

## Complexity Tracking

No constitution violations requiring special justification.

---

## Verification Plan

### Manual Verification Scenarios

1. Sign out, open `/admin/users`, verify redirect to `/sign-in` with return path.
2. Sign in as non-admin, open `/admin/users`, verify access-denied UI and no data exposure.
3. Open `/admin/users` as admin, verify list loads with name/email/phone/role/created date.
4. Search by email substring, verify matching users only.
5. Search by phone substring, verify matching users only.
6. Filter by role `admin`, verify only admin users appear.
7. Apply created-date range, verify users outside the range are excluded.
8. Open a user detail page, verify profile data and order history both render.
9. Open a user with zero orders, verify empty order-history state renders without error.
10. Change a user role from detail page, verify success and reflected role on refresh.
11. Attempt to remove own admin role, verify rejection message and no persisted change.
12. Trigger access removal flow and cancel confirmation, verify no mutation occurs.
13. Confirm access removal, verify success message states order history is preserved.
14. Attempt removed user sign-in, verify sign-in is blocked.
15. After access removal, verify historical orders remain visible in admin orders module.
16. Attempt user-admin actions from non-admin context (direct action call), verify `Unauthorized` responses.

