# Research: Admin Foundation and Access Control

**Feature**: `001-admin-foundation`  
**Date**: 2026-04-29  
**Status**: Complete — all unknowns resolved

---

## Finding 1: Existing Admin Infrastructure Audit

**Decision**: Leverage all existing admin infrastructure. Do not duplicate or replace.

**Rationale**: Code audit confirmed that `requireAdmin()`, `ADMIN_NAV_ITEMS`, admin UI primitives, `AdminChrome`, `AdminAccessDenied`, route constants, types, and middleware protection all exist and are production-ready. The only gap is the App Router layout and landing page files in `app/(admin)/admin/`.

**Artifacts confirmed present**:
- `lib/auth/admin.ts` — `requireAdmin()`, `getCurrentUserProfile()`, `isAdminRole()`
- `lib/admin.ts` — `ADMIN_NAV_ITEMS`, `ADMIN_ORDER_STATUSES`, `ADMIN_ROLES`, `getStatusTone()`, `getRoleTone()`, `formatAdminLabel()`
- `lib/admin/revalidate.ts` — `revalidateCatalogPaths()`, `revalidateCategoryPaths()`, `revalidatePromoPaths()`, `revalidateDeliveryPaths()`, `revalidateOrderPaths()`, `revalidateUserPaths()`
- `components/admin/AdminChrome.tsx` — full sidebar + header shell
- `components/admin/AdminUI.tsx` — `AdminPageHeader`, `AdminCard`, `AdminSection`, `AdminField`, `AdminNotice`, `AdminStatusBadge`, `AdminEmptyState`, `adminInputClassName`, `adminSelectClassName`
- `components/admin/AdminAccessDenied.tsx` — full access-denied screen with store/profile links
- `constants/routes.ts` — `ADMIN`, `ADMIN_PRODUCTS`, `ADMIN_CATEGORIES`, `ADMIN_ORDERS`, `ADMIN_PROMO_CODES`, `ADMIN_DELIVERY`, `ADMIN_USERS`
- `types/Admin.ts` — `AdminOrderStatus`, `AdminRole`, `AdminOrderFilters`, `AdminPromoFilters`, `AdminUserFilters`, `DeliveryInput`
- `middleware.ts` — `/admin` already in `protectedRoutes`
- `actions/userAction.ts` — `getAdminUsers()`, `getAdminUserById()`, `updateUserRole()`, `deleteUserAccess()` all call `requireAdmin()`

---

## Finding 2: Two-Tier Access Control Pattern (Next.js App Router)

**Decision**: Middleware for unauthenticated tier; layout server component for role tier.

**Rationale**: Next.js App Router middleware runs on the Edge before page rendering. It can efficiently check session presence (cookie-based auth with Supabase SSR) without a full database query. The layout server component runs in Node.js runtime and can make the `users` table role lookup via `requireAdmin()`. This cleanly separates concerns:
- Middleware: "Is anyone logged in?" → fast, edge-compatible
- Layout: "Is this person an admin?" → accurate, DB-backed

**Alternatives considered**:
- Middleware doing role check: Would require `users` table access from the Edge runtime, which complicates Supabase client initialization and adds latency to every request. Rejected.
- Per-page `requireAdmin()` calls: Creates duplication and risk of missing coverage on new pages. Layout-level check is the correct App Router pattern for shared authorization.

---

## Finding 3: Admin Shell Sidebar Active State

**Decision**: Use `usePathname()` hook in the sidebar to highlight the active nav item.

**Rationale**: The `AdminChrome` component already implements this pattern (confirmed in source). The sidebar receives `ADMIN_NAV_ITEMS` and compares each `href` against `usePathname()` to apply active styling. This is a standard Next.js client component pattern.

**Note**: The sidebar client boundary is isolated within `AdminChrome`. The layout itself remains a server component — only the chrome shell becomes a client component for navigation state.

---

## Finding 4: Sign-Out in Admin Context

**Decision**: Use Supabase `createClient().auth.signOut()` directly from a client component button within `AdminChrome`, then `router.push('/sign-in')`.

**Rationale**: Matches the pattern already used in `Sidebar.tsx` (profile section). The existing `SignOutSupabase()` server action can also be used via a form action. Either approach works; the client-side pattern is simpler for a button inside a client component (`AdminChrome` is already a client component due to `usePathname`).

---

## All NEEDS CLARIFICATION items: None

The spec contained no `[NEEDS CLARIFICATION]` markers. All design decisions were derivable from PLAN.me, the codebase audit, and established project conventions.
