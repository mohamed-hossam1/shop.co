# Data Model: Admin Foundation and Access Control

**Feature**: `001-admin-foundation`  
**Date**: 2026-04-29

---

## Entities

### Admin Session (runtime concept — not a database table)

The admin session is a composite of two pre-existing data sources:

| Source | Field | Description |
|--------|-------|-------------|
| Supabase Auth (session cookie) | `user.id` | Supabase auth UID, used to look up the `users` row |
| `users` table | `role` | String field; must equal `"admin"` to grant access |

No new tables, columns, or migrations are required for this phase.

---

### User (existing `users` table — fields relevant to admin access control)

| Field | Type | Nullable | Validation Rule |
|-------|------|----------|-----------------|
| `id` | `uuid` | No | Must match Supabase auth `user.id` |
| `name` | `string` | No | Displayed in admin header (no mutation in Phase 1) |
| `email` | `string` | No | Displayed in admin header (no mutation in Phase 1) |
| `role` | `string` | No | Must equal `"admin"` exactly (case-sensitive) for access |
| `phone` | `string` | Yes | Not used in Phase 1 |
| `created_at` | `timestamp` | No | Not used in Phase 1 |

**Role validation**: `role === "admin"` — any other value (including `"user"`, `null`, or a missing row) results in access denied.

---

## State Machine: Admin Access Control

```
Incoming request to /admin/*
         │
         ▼
    ┌─────────────────┐
    │   Middleware     │
    │  (Edge Runtime)  │
    └─────────────────┘
         │
         ├── No Supabase session ──────────────────► HTTP 307 → /sign-in?redirect=/admin/*
         │
         └── Session present
                  │
                  ▼
         ┌─────────────────────┐
         │  Admin Layout       │
         │  (Node.js Runtime)  │
         │  requireAdmin()     │
         └─────────────────────┘
                  │
                  ├── users row not found OR role ≠ "admin" ──► Render <AdminAccessDenied />
                  │
                  └── role === "admin"
                           │
                           ▼
                  ┌──────────────────────┐
                  │  <AdminChrome>       │
                  │  + Page Content      │
                  └──────────────────────┘
```

---

## Guard Function Contract

```
requireAdmin()
  Input:  current request cookies (via Supabase SSR)
  Output: User (the admin's profile row)
  Throws: Error("Unauthorized") when:
    - No active Supabase session
    - Session exists but no users row found
    - users row exists but role !== "admin"

Usage in server actions:
  try {
    await requireAdmin();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

Usage in layouts:
  const admin = await requireAdmin().catch(() => null);
  if (!admin) return <AdminAccessDenied />;
```

---

## Navigation Data Model

The admin landing page renders `ADMIN_NAV_ITEMS` from `lib/admin.ts`:

| Module | Route Constant | URL |
|--------|---------------|-----|
| Overview | `ROUTES.ADMIN` | `/admin` |
| Products | `ROUTES.ADMIN_PRODUCTS` | `/admin/products` |
| Categories | `ROUTES.ADMIN_CATEGORIES` | `/admin/categories` |
| Orders | `ROUTES.ADMIN_ORDERS` | `/admin/orders` |
| Promo Codes | `ROUTES.ADMIN_PROMO_CODES` | `/admin/promo-codes` |
| Delivery | `ROUTES.ADMIN_DELIVERY` | `/admin/delivery` |
| Users | `ROUTES.ADMIN_USERS` | `/admin/users` |

All routes exist as constants. No new constants are needed for Phase 1.

---

## No New Migrations Required

Phase 1 reads the `users.role` field that already exists. No schema changes, no new tables, no new views, no new RPCs.
