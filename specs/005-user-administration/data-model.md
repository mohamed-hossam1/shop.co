# Data Model: User Administration

**Phase**: 1 — Design  
**Feature**: `005-user-administration`  
**Date**: 2026-04-30

---

## Entities

### 1. User Account (`users`)

Represents platform profile and role assignment data.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Primary key, aligned with Supabase auth user id |
| `name` | `string` | Display name |
| `email` | `string` | Login/account email |
| `phone` | `string` | Contact number |
| `role` | `string` | Authorization role (`admin` is privileged) |
| `created_at` | `string` | ISO timestamp |

**Validation and constraints**:

- `id` must be present for all admin operations.
- `role` updates must be restricted to allowed admin-assignable roles.
- Self-demotion from `admin` and self access-removal are rejected.

---

### 2. User List Filters (`AdminUserFilters`)

Server action input for user discovery.

| Field | Type | Required | Notes |
|---|---|---|---|
| `search` | `string` | No | Matches name/email/phone (trimmed query) |
| `role` | `"admin" \| "user"` | No | Role-scoped filtering |
| `dateFrom` | `string` | No | Lower bound for `created_at` date |
| `dateTo` | `string` | No | Upper bound for `created_at` date |

**Validation and constraints**:

- Empty filter fields are treated as unset.
- Date values are interpreted as day boundaries (`T00:00:00` and `T23:59:59.999`).
- If `dateFrom > dateTo`, return clear validation message.

---

### 3. Role Assignment Command

Represents one admin-initiated role change.

| Field | Type | Notes |
|---|---|---|
| `targetUserId` | `string` | User being updated |
| `newRole` | `"admin" \| "user"` | Assigned role value |
| `actorAdminId` | `string` | Current admin performing action |

**Validation and constraints**:

- `actorAdminId` must belong to an authenticated admin.
- `newRole` must be within `ADMIN_ROLES`.
- `actorAdminId !== targetUserId` when `newRole !== "admin"`.

---

### 4. Access Removal Command

Represents destructive revocation of sign-in access.

| Field | Type | Notes |
|---|---|---|
| `targetUserId` | `string` | User whose auth access will be revoked |
| `actorAdminId` | `string` | Current authenticated admin |
| `confirmRemoval` | `boolean` (or confirmation token) | Must be explicitly provided by caller |

**Validation and constraints**:

- Only admins may execute.
- Admin cannot remove their own access.
- Command must include explicit confirmation input.
- Action removes sign-in access only; historical commerce records are preserved.

---

### 5. User Order History Projection

Read model shown in `/admin/users/[id]` to support profile + order history context.

| Field | Type | Source |
|---|---|---|
| `user` | `User` | `getAdminUserById(userId)` |
| `orders` | `Order[]` | `getAdminOrders({ userId })` |

**Projection behavior**:

- Empty `orders` is valid and renders empty state.
- Missing user returns not-found state.
- Orders remain visible historically if access has been removed and rows still reference `user_id`.

---

## Relationships

```text
users (id)
  ├─ role assignment updates (admin action)
  ├─ access removal command (auth revocation)
  └─ orders.user_id (historical purchase records)

orders (id, user_id)
  └─ order_items (order snapshots)
```

Key relationship invariant:

- Access removal does not rewrite or delete `orders` / `order_items` historical snapshots.

---

## State Transitions

### A. Role State

```text
User Role
  admin <-> user
```

- Transition triggered by admin action.
- Last successful update wins when concurrent updates occur.
- Unauthorized callers are rejected before persistence.

### B. Access State

```text
Auth-enabled account --(confirmed access removal)--> Auth revoked
```

- Trigger requires explicit destructive confirmation.
- Post-condition: sign-in attempts fail for removed account.
- Commerce history remains unchanged.

---

## Invariants

1. All user administration writes are admin-only server actions.
2. Non-admin callers must receive `Unauthorized` and no state changes.
3. Access removal semantics must remain: revoke authentication, preserve historical orders.
4. User list filters must be applied server-side (not client-only).
5. User detail must show both profile context and related order history.

