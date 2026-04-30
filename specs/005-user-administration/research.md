# Research: User Administration

**Phase**: 0 — Research and Decision Resolution  
**Feature**: `005-user-administration`  
**Date**: 2026-04-30

---

## 1. Reuse Existing Admin-Gated User Actions, Extend Only Gaps

**Decision**: Reuse existing user admin actions (`getAdminUsers`, `getAdminUserById`, `updateUserRole`, `deleteUserAccess`) and add only missing behavior required by this spec.

**Rationale**:

- Action layer already enforces admin checks through `requireAdmin()` for the relevant admin methods.
- Search by email/phone/name and role filtering already exist in `getAdminUsers`.
- Role update and access removal flows already exist and include self-protection checks.
- Missing behavior is scoped: created-date filter and stronger explicit-confirmation contract for access removal.

**Alternatives considered**:

- Build a completely new user admin action surface. Rejected because it duplicates functional guardrails already present.
- Move user admin reads directly into server pages. Rejected because the project uses server actions as the backend boundary.

---

## 2. Add Created-Date Filter at Action Layer, Not Client-Only

**Decision**: Extend `AdminUserFilters` and `getAdminUsers()` with `dateFrom` / `dateTo` filtering on `users.created_at`.

**Rationale**:

- FR-003 requires created-date filtering; this is not currently implemented.
- Server-side filtering keeps behavior consistent for all callers and avoids client-only bypasses.
- It aligns with existing admin filtering patterns in orders and promo modules.

**Alternatives considered**:

- Client-side date filtering over fetched user arrays. Rejected due poor scalability and bypass risk.
- Defer created-date filter to a later release. Rejected because it is part of P1 story acceptance.

---

## 3. Compose User Detail from Existing User + Order Actions

**Decision**: Build user detail page by composing `getAdminUserById(userId)` with `getAdminOrders({ userId })`.

**Rationale**:

- `getAdminOrders` already supports `userId` filtering and is admin-gated.
- This avoids introducing redundant order-history actions.
- Existing order data shape already supports detail table rendering and links to `/admin/orders/[id]`.

**Alternatives considered**:

- Add a new combined action (`getAdminUserDetail`) returning `{ user, orders }`. Rejected for now as unnecessary API expansion.
- Query order history from client components. Rejected to preserve server-first data loading conventions in admin pages.

---

## 4. Keep Destructive Confirmation in UI, Add Confirmation Requirement in Action Contract

**Decision**: Use shared `ConfirmDialog` in UI and require explicit confirmation input in `deleteUserAccess` action payload.

**Rationale**:

- FR-008 requires explicit destructive confirmation.
- Current implementation uses `window.confirm`, which is inconsistent with admin destructive patterns.
- Requiring confirmation input at the action boundary preserves explicitness even when UI is bypassed.

**Alternatives considered**:

- Keep `window.confirm` only. Rejected due inconsistency and weaker contract-level enforcement.
- Add a complex typed phrase input flow in the first iteration. Rejected as unnecessary complexity for this phase.

---

## 5. Preserve Historical Commerce Data During Access Removal

**Decision**: Access removal revokes sign-in capability via Supabase Auth delete only; no order or order-item mutations are introduced.

**Rationale**:

- FR-010 requires historical order preservation.
- Current `deleteUserAccess` logic does not modify `orders` or `order_items`.
- User-facing destructive copy can explicitly state preserved data scope.

**Alternatives considered**:

- Hard-delete user-related commerce rows. Rejected because it violates feature requirements.
- Soft-disable users in profile table without auth revocation. Rejected because FR-009 requires sign-in to be blocked.

---

## 6. Keep Admin Authorization at Layout + Action Layers

**Decision**: Continue with existing admin authorization strategy: admin layout/UI gate for views and `requireAdmin()` for server actions.

**Rationale**:

- This pattern already exists across admin modules and is consistently applied.
- Server actions remain the authoritative boundary for FR-013.
- No middleware redesign is required to deliver feature scope.

**Alternatives considered**:

- Add role enforcement into middleware for `/admin/*`. Rejected for this phase to avoid widening auth behavior changes across all admin modules.
- Rely only on client checks. Rejected as insufficient for authorization guarantees.

---

## 7. Follow Existing Admin Module Route and UI Patterns

**Decision**: Implement `/admin/users` as list + detail routes with server pages and client table/detail components using existing `AdminUI` primitives.

**Rationale**:

- Matches products/orders/promo/delivery module architecture.
- Reduces implementation risk and visual drift.
- Supports URL-driven filters and direct-linkable detail pages.

**Alternatives considered**:

- Modal-only detail management from list page. Rejected because it breaks route-level deep linking and diverges from existing admin patterns.
- Build separate ad-hoc styles/components. Rejected because reusable admin primitives already exist.

---

## 8. Concurrency and No-Op Edge Handling

**Decision**: Treat simultaneous role edits as last-write-wins and keep clear responses for missing/already-removed users.

**Rationale**:

- Matches current Supabase update behavior and project simplicity constraints.
- Spec edge cases call for deterministic final state and explicit no-op/error communication.
- Existing action return shape (`success` + `message`) naturally supports these cases.

**Alternatives considered**:

- Introduce optimistic-lock/version columns. Rejected due schema-change complexity outside this phase.
- Silently ignore stale mutations. Rejected because explicit admin feedback is required.

---

## Summary of Resolved Clarifications

| Topic | Decision |
|---|---|
| User list date filter | Add `dateFrom/dateTo` to `AdminUserFilters` and `getAdminUsers` |
| User detail order history | Reuse `getAdminOrders({ userId })` |
| Destructive confirmation | Use `ConfirmDialog` + explicit confirmation input in action |
| Access removal semantics | Revoke auth access only, preserve order history |
| Authorization boundary | Keep admin layout gate + `requireAdmin()` action checks |
| Admin route pattern | Add `/admin/users` list and `/admin/users/[id]` detail pages |

