# Implementation Plan: Admin Foundation and Access Control

**Branch**: `main` | **Date**: 2026-04-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-admin-foundation/spec.md`

## Summary

Establish a secure, isolated `/admin` surface within the existing Next.js App Router application. This phase delivers: (1) middleware-level authentication gating for all `/admin` routes, (2) server-side role enforcement through a shared `requireAdmin()` guard applied to every admin action, (3) a reusable admin shell (layout, sidebar, header, breadcrumbs) that future module phases can plug into, and (4) an admin landing page listing all planned management modules.

**Research finding**: The codebase already contains significant foundational work. `requireAdmin()` exists in `lib/auth/admin.ts`, admin route constants exist in `constants/routes.ts`, admin UI primitives exist in `components/admin/AdminUI.tsx` and `AdminChrome.tsx`, `AdminAccessDenied.tsx` is built, and `middleware.ts` already includes `/admin` in `protectedRoutes`. The primary remaining work is the `app/(admin)` route group, its layout, and the landing page — and verifying all pieces wire together correctly.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16 App Router  
**Primary Dependencies**: React 19, Supabase SSR, Tailwind CSS 4, Motion, Lucide React  
**Storage**: Supabase PostgreSQL — `users` table with `role` field  
**Testing**: Manual verification (no automated test suite in repo)  
**Target Platform**: Web — server-rendered Next.js pages with client-interactive components  
**Project Type**: Full-stack web application (monorepo — single Next.js app)  
**Performance Goals**: Standard interactive web app — page load < 3s, no blocking layout shifts  
**Constraints**: No `app/api` route handlers; all server logic via server actions. No new npm packages for this phase.  
**Scale/Scope**: Single admin user role in Phase 1; no multi-level permission hierarchy

---

## Constitution Check

*No project-specific constitution has been ratified (constitution.md is an unfilled template). Effective governance is derived from the documented constraints in AGENTS.md.*

**Effective gates for this project:**

| Gate | Status | Notes |
|------|--------|-------|
| No `app/api` route handlers introduced | ✅ Pass | Admin access control uses server actions + layout guards only |
| Route groups maintain existing URL convention | ✅ Pass | `app/(admin)/admin/` — URLs remain at `/admin/*` |
| Server actions return `{ success, data?, message? }` shape | ✅ Pass | `requireAdmin()` already follows this pattern |
| Guest/auth flows in storefront preserved | ✅ Pass | Admin is isolated in its own route group |
| No new database tables required | ✅ Pass | Uses existing `users.role` field |
| Two-tier security (middleware + server-side guard) | ✅ Pass | middleware handles unauthenticated; `requireAdmin()` handles role |

**No constitution violations to justify.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-admin-foundation/
├── plan.md              ← this file
├── research.md          ← Phase 0 output (below)
├── data-model.md        ← Phase 1 output (below)
└── tasks.md             ← Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
app/
└── (admin)/
    └── admin/
        ├── layout.tsx          [CREATE] Admin shell layout — auth gate + role check + AdminChrome
        └── page.tsx            [CREATE] Admin landing page — module index with nav links

components/
└── admin/
    ├── AdminChrome.tsx         [EXISTS — verified complete] Sidebar + header shell
    ├── AdminUI.tsx             [EXISTS — verified complete] Primitives: card, badge, field, notice, empty state
    ├── AdminAccessDenied.tsx   [EXISTS — verified complete] Non-admin access denied screen
    ├── OrderStatusSelect.tsx   [EXISTS]
    ├── UserRoleSelect.tsx      [EXISTS]
    └── DeleteUserAccessButton.tsx [EXISTS]

lib/
├── auth/
│   └── admin.ts               [EXISTS — complete] requireAdmin(), getCurrentUserProfile(), isAdminRole()
├── admin.ts                   [EXISTS — complete] ADMIN_NAV_ITEMS, ADMIN_ORDER_STATUSES, ADMIN_ROLES, formatters
└── admin/
    └── revalidate.ts          [EXISTS — complete] revalidateCatalogPaths, revalidateOrderPaths, etc.

constants/
└── routes.ts                  [EXISTS — complete] ADMIN, ADMIN_PRODUCTS, ADMIN_CATEGORIES, etc.

types/
├── Admin.ts                   [EXISTS — complete] AdminOrderStatus, AdminRole, filter interfaces
└── User.ts                    [EXISTS — complete] User interface with role field

middleware.ts                  [EXISTS — /admin in protectedRoutes] Handles unauthenticated redirect
```

---

## Phase 0: Research

### Decision 1: Admin Route Group Structure

**Decision**: Use `app/(admin)/admin/layout.tsx` as the admin shell layout, inside a dedicated `(admin)` route group.

**Rationale**: Mirrors the existing `(store)` and `(auth)` route group pattern already in the codebase. Route group name `(admin)` does not appear in URLs. The `/admin` path prefix is cleanly owned by this group. This allows a completely independent layout from the storefront navbar/footer.

**Alternatives considered**:
- Flat `app/admin/layout.tsx` without a route group — works but breaks the established organizational pattern; route group is preferred per project conventions.
- Separate Next.js app for admin — contradicts the plan's explicit constraint: "dashboard lives inside the existing Next.js app."

---

### Decision 2: Two-Tier Access Control Strategy

**Decision**: Middleware handles **unauthenticated** requests (tier 1). The admin layout server component calls `requireAdmin()` and conditionally renders `AdminAccessDenied` for **authenticated non-admin** requests (tier 2). Every admin server action also calls `requireAdmin()` independently (defense-in-depth).

**Rationale**: Middleware already includes `/admin` in `protectedRoutes` — unauthenticated users are redirected to `/sign-in` before the page renders. The layout enforces role; the access-denied component already exists. This avoids a redirect loop (non-admin users are signed in, so middleware passes them through, then the layout denies them with a clear message).

**Alternatives considered**:
- Middleware checks both auth AND role — requires middleware to fetch `users.role`, which adds latency on every admin request and couples the middleware to the database. Not worth it given layout already runs server-side.
- Individual page-level `requireAdmin()` per page — creates duplication; a layout-level check covers all child pages automatically.

---

### Decision 3: Admin Landing Page Content

**Decision**: The landing page is a navigation-only module index. It renders `ADMIN_NAV_ITEMS` from `lib/admin.ts` as a grid of linked cards. No metrics, no counts, no database queries beyond the auth check.

**Rationale**: Spec FR-011 is explicit: "The admin landing page MUST NOT include reporting widgets, analytics charts, or aggregated metrics in this phase." `ADMIN_NAV_ITEMS` is already defined with all six modules. The page can be a pure server component with zero data fetching beyond the layout's role check.

**Alternatives considered**:
- Summary cards with live counts (total orders, products, etc.) — explicitly out of scope for Phase 1 per spec and PLAN.me.

---

### Decision 4: Sign-Out Behavior

**Decision**: The admin shell sign-out control calls `SignOutSupabase()` (existing server action) and redirects to `/sign-in`. No separate admin sign-in page.

**Rationale**: The existing storefront auth flow handles all sign-in. After sign-out, middleware will enforce `/admin` protection and redirect to `/sign-in?redirect=/admin` if the user returns, completing the round-trip correctly.

**Alternatives considered**:
- Separate `/admin/login` page — unnecessary complexity; the shared sign-in page works correctly and the spec assumption states: "Sign-out from the admin area redirects to the storefront sign-in page."

---

## Phase 1: Data Model

### Entities Involved

This phase introduces no new database tables or columns. All entities are pre-existing.

#### Admin User (read from `users` table)

| Field | Type | Role in this feature |
|-------|------|----------------------|
| `id` | `string` (UUID) | Identity; compared against session user ID |
| `name` | `string` | Displayed in admin header |
| `email` | `string` | Displayed in admin header |
| `role` | `string` | Gate value; must equal `"admin"` for access |
| `created_at` | `string` (ISO timestamp) | Not used in Phase 1 |

**Validation rule**: `role === "admin"` is the single boolean gate. Any other string value (including `"user"`, `null`, `undefined`, empty string) denies admin access.

#### State Transitions (Access Control)

```
Request to /admin/*
       │
       ▼
[Middleware] ─── No session? ──► Redirect to /sign-in?redirect=/admin/*
       │
  Has session
       │
       ▼
[Admin Layout] ─── role ≠ "admin"? ──► Render <AdminAccessDenied />
       │
  role === "admin"
       │
       ▼
[Render Admin Shell + Page Content]
```

---

## Phase 1: Interface Contracts

The admin surface exposes no public HTTP API. Contracts are defined as **server action shapes** (internal to the Next.js app) and **component props** (UI contracts).

### Server Action: `requireAdmin()`

```typescript
// lib/auth/admin.ts
// Returns the current admin's User profile, or throws Error("Unauthorized")
requireAdmin(): Promise<User>
```

**Called by**: Admin layout (for role gate), every admin mutation action.  
**Throws**: `Error("Unauthorized")` — callers catch and return `{ success: false, message: "Unauthorized" }`.

---

### Component Contract: `AdminChrome`

```typescript
// components/admin/AdminChrome.tsx
interface AdminChromeProps {
  user: User;          // Required — renders name/email in header
  children: React.ReactNode;
}
```

**Renders**: Sidebar with `ADMIN_NAV_ITEMS`, header with user identity, sign-out control, main content area.

---

### Component Contract: `AdminAccessDenied`

```typescript
// components/admin/AdminAccessDenied.tsx
interface AdminAccessDeniedProps {
  userName?: string | null;   // Optional — shown in denial message
}
```

---

### Layout Server Component Contract

```typescript
// app/(admin)/admin/layout.tsx
// Server Component — no props beyond children
// Behavior:
//   1. Calls requireAdmin() — on throw, renders <AdminAccessDenied />
//   2. On success, wraps children in <AdminChrome user={adminUser} />
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
})
```

---

## Complexity Tracking

No constitution violations. No complexity justification required.

---

## What Is Already Built (Pre-existing)

The following are confirmed present in the codebase and do not need to be created:

| Artifact | File | Status |
|----------|------|--------|
| Auth guard | `lib/auth/admin.ts` | ✅ Complete |
| Admin constants | `lib/admin.ts` | ✅ Complete |
| Revalidation helpers | `lib/admin/revalidate.ts` | ✅ Complete |
| Admin UI primitives | `components/admin/AdminUI.tsx` | ✅ Complete |
| Admin shell | `components/admin/AdminChrome.tsx` | ✅ Complete |
| Access denied screen | `components/admin/AdminAccessDenied.tsx` | ✅ Complete |
| Admin route constants | `constants/routes.ts` | ✅ Complete |
| Admin types | `types/Admin.ts` | ✅ Complete |
| Middleware protection | `middleware.ts` | ✅ `/admin` in `protectedRoutes` |
| Admin user actions | `actions/userAction.ts` | ✅ `getAdminUsers`, `updateUserRole`, `deleteUserAccess` |

## What Needs To Be Created

| Artifact | File | Priority |
|----------|------|----------|
| Admin route group layout | `app/(admin)/admin/layout.tsx` | P1 — blocks everything |
| Admin landing page | `app/(admin)/admin/page.tsx` | P1 |

These are the only two files required to complete Phase 1 of the Admin Foundation.
