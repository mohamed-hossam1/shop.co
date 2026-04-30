# Implementation Plan: Promotions and Delivery Settings

**Branch**: `003-admin-orders-ops` | **Date**: 2026-04-30 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/004-promos-delivery-settings/spec.md`

---

## Summary

Build the missing admin UI for promotions and delivery settings at `/admin/promo-codes` and `/admin/delivery`, reusing the admin shell, route constants, and most of the existing server-action surface. The main implementation work is:

1. Add list/new/edit admin routes and client components for promo codes and delivery settings.
2. Harden the current promo and delivery actions so they match the spec's edge cases and validation rules.
3. Preserve checkout/profile consumers by keeping the existing `getCities()` and `getDeliveryFee()` contracts and relying on revalidation plus next-load refetch behavior.

The repo is currently checked out on `003-admin-orders-ops`, but the planning artifacts target `specs/004-promos-delivery-settings/`.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16 App Router  
**Primary Dependencies**: React 19, Tailwind CSS 4, Supabase SSR, TanStack Query, Lucide React  
**Storage**: Supabase PostgreSQL — `coupons`, `delivery`, and existing shopper consumers in `orders`, checkout, and profile flows  
**Testing**: Manual browser verification against admin and storefront scenarios; no automated test suite is present  
**Target Platform**: Web application, desktop-primary admin surface with mobile-safe layouts  
**Project Type**: Single Next.js App Router application with server actions as the backend layer  
**Performance Goals**: Promo and delivery lists load in under 2 seconds; admin mutations reflect on refresh in under 3 seconds; delivery changes affect the next checkout/profile load  
**Constraints**: No new API routes, no new packages, preserve server-action return shapes, preserve `validatePromoCode()` as checkout source of truth, no schema migration assumed in this phase  
**Scale/Scope**: Internal admin-only surface, small enough data volumes for single-page lists without pagination

---

## Constitution Check

The constitution file at `.specify/memory/constitution.md` is still an unfilled template, so there are no enforceable project-specific gates beyond the repo guidance in `AGENTS.md`. Applying those rules to this feature:

- ✅ **No API drift**: The feature stays on server actions and App Router pages. No `app/api` routes are introduced.
- ✅ **Admin guard preserved**: Routes live under `app/(admin)/admin/` and all write/read actions remain protected by `requireAdmin()`.
- ✅ **Storefront compatibility preserved**: Checkout and profile continue using the existing `getCities()` and `getDeliveryFee()` entry points.
- ✅ **Historical order data preserved**: Promo and delivery deletions only remove the source rows; order snapshots remain unchanged.
- ✅ **UI consistency preserved**: New pages reuse `AdminPageHeader`, `AdminSection`, `AdminField`, `AdminNotice`, `AdminStatusBadge`, and `ConfirmDialog`.
- ✅ **No unjustified complexity**: No new persistence layers, state stores, or packages are required.

Post-design re-check: still passes. The only action-layer expansion is minimal record-read support for edit pages.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-promos-delivery-settings/
├── spec.md              ✅ Complete
├── research.md          ✅ Complete
├── data-model.md        ✅ Complete
├── quickstart.md        ✅ Complete
├── contracts/
│   └── ui-contracts.md  ✅ Complete
├── plan.md              ← This file
├── checklists/
│   └── requirements.md  ✅ Complete
└── tasks.md             ← Phase 2 output (/speckit-tasks command)
```

### Source Code

```text
app/(admin)/admin/
├── promo-codes/
│   ├── page.tsx                 [NEW] Promo list page
│   ├── new/
│   │   └── page.tsx             [NEW] Promo create page
│   └── [id]/
│       └── edit/
│           └── page.tsx         [NEW] Promo edit page
├── delivery/
│   ├── page.tsx                 [NEW] Delivery list page
│   ├── new/
│   │   └── page.tsx             [NEW] Delivery create page
│   └── [id]/
│       └── edit/
│           └── page.tsx         [NEW] Delivery edit page
│
components/admin/
├── promo-codes/
│   ├── PromoCodeTable.tsx       [NEW] Filterable promo list + delete flow
│   └── PromoCodeForm.tsx        [NEW] Promo create/edit form
├── delivery/
│   ├── DeliveryTable.tsx        [NEW] Delivery list + delete flow
│   └── DeliveryForm.tsx         [NEW] Delivery create/edit form
├── AdminUI.tsx                  [EXISTING — reused]
└── ConfirmDialog.tsx            [EXISTING — reused]
│
actions/
├── promoCodeAction.ts           [MODIFY] Add record read + duplicate/nullable-cap handling
└── deliveryAction.ts            [MODIFY] Add record read + positive-fee validation
│
types/
├── PromoCode.ts                 [MODIFY] Tighten promo field types for admin/edit flows
├── Admin.ts                     [OPTIONAL MODIFY] Add any small form/helper types if needed
└── deliveryFee.ts               [EXISTING — reused]
│
lib/
├── admin.ts                     [EXISTING — reuse `getPromoStatusTone`, nav, helpers]
├── admin/revalidate.ts          [POSSIBLE MODIFY] Expand delivery revalidation paths if needed
└── auth/admin.ts                [EXISTING — reused]
│
constants/
└── routes.ts                    [EXISTING — admin promo/delivery routes already defined]
```

**Structure Decision**: Follow the established admin resource pattern already used by products and categories: server pages load data and pass it into client tables/forms; client components own filters, transitions, confirmation dialogs, submission, and refresh behavior.

---

## Proposed Changes

### A. Harden the Promo Action Layer

#### `actions/promoCodeAction.ts` [MODIFY]

Keep the existing action surface, but bring it in line with the feature spec:

- Keep `getPromoCodes(filters)` as the list action; it already exists and is admin-gated.
- Add `getPromoCodeById(id)` for edit pages so promo editing follows the same route pattern as products/categories.
- Normalize promo status filtering to the exact spec predicates:
  - `active`: `is_active && !isExpired && !isUsageCapped`
  - `inactive`: `!is_active`
  - `expired`: `isExpired`
  - `exhausted`: `used_count >= max_uses` only when `max_uses` is not `null`
- Treat `max_uses = null` as unlimited and `max_uses = 0` as immediately usage capped.
- Treat blank `expires_at` as `null`.
- Normalize blank `min_purchase` to `0` rather than introducing nullable checkout logic.
- Add explicit duplicate-code checks on create and update so the UI gets a stable, readable error instead of a raw database failure.
- Preserve the existing public shopper-side contract of `validatePromoCode()` while fixing its unlimited-use handling.

#### `types/PromoCode.ts` [MODIFY]

Tighten the type to match the planned admin semantics:

- `type`: `"percentage" | "fixed"`
- `max_uses`: `number | null`
- `expires_at`: `string | null`
- keep `min_purchase` as `number` with `0` representing "no minimum"

This avoids touching checkout consumers that already expect numeric minimum purchases.

---

### B. Add Promo Admin Pages and Components

#### `app/(admin)/admin/promo-codes/page.tsx` [NEW]

Server Component that:

1. Reads `searchParams`
2. Maps them into `AdminPromoFilters`
3. Calls `getPromoCodes(filters)`
4. Renders `AdminPageHeader`
5. Passes results into `PromoCodeTable`

Query params:

- `search`
- `status` = `all | active | inactive | expired | exhausted`

UI label for `exhausted` should be "Usage Capped" to match the spec language.

#### `app/(admin)/admin/promo-codes/new/page.tsx` [NEW]

Server page that renders `PromoCodeForm` in create mode.

#### `app/(admin)/admin/promo-codes/[id]/edit/page.tsx` [NEW]

Server page that:

1. Parses numeric `id`
2. Calls `getPromoCodeById(id)`
3. Returns `notFound()` on invalid/missing promo
4. Renders `PromoCodeForm` with the loaded record

#### `components/admin/promo-codes/PromoCodeTable.tsx` [NEW]

Client component responsibilities:

- Search by promo code string
- Filter by `All`, `Active`, `Inactive`, `Expired`, `Usage Capped`
- Render the required list columns:
  - code
  - discount type
  - discount value
  - minimum purchase
  - usage count
  - usage cap
  - expiry date
  - active/inactive state
- Show `Edit` and `Delete` actions
- Use `ConfirmDialog` for deletion
- Push filter state into the URL using the same pattern as `ProductTable`
- Surface action errors through `AdminNotice`

#### `components/admin/promo-codes/PromoCodeForm.tsx` [NEW]

Client form responsibilities:

- Shared create/edit component
- Fields:
  - code
  - type
  - value
  - minimum purchase
  - maximum usage cap
  - expiry date
  - active toggle
- Validation before submit:
  - code required
  - value must be positive
  - percentage values must stay within 1–100
  - minimum purchase must be `>= 0`
  - maximum usage cap must be blank/null or an integer `>= 0`
  - blank expiry date becomes `null`
- Save via `createPromoCode()` or `updatePromoCode()`
- Redirect back to `/admin/promo-codes` and refresh on success

---

### C. Harden the Delivery Action Layer

#### `actions/deliveryAction.ts` [MODIFY]

The delivery admin CRUD surface already exists; align it to the spec and edit-route needs:

- Keep `getDeliverySettings()`, `createDeliverySetting()`, `updateDeliverySetting()`, and `deleteDeliverySetting()`
- Add `getDeliverySettingById(id)` for edit pages
- Keep case-insensitive duplicate-city validation on create and update
- Tighten fee validation from `>= 0` to `> 0`
- Trim city input before duplicate checks and persistence
- Keep `revalidateDeliveryPaths()` after successful mutations

#### `lib/admin/revalidate.ts` [POSSIBLE MODIFY]

Current delivery revalidation already covers `/checkout`, `/admin`, and `/admin/delivery`. Expand it only if implementation review shows a route-level dependency worth refreshing, such as `/profile`, while keeping shopper client-query behavior unchanged.

---

### D. Add Delivery Admin Pages and Components

#### `app/(admin)/admin/delivery/page.tsx` [NEW]

Server Component that:

1. Calls `getDeliverySettings()`
2. Renders `AdminPageHeader`
3. Passes results to `DeliveryTable`

#### `app/(admin)/admin/delivery/new/page.tsx` [NEW]

Server page that renders `DeliveryForm` in create mode.

#### `app/(admin)/admin/delivery/[id]/edit/page.tsx` [NEW]

Server page that:

1. Parses numeric `id`
2. Calls `getDeliverySettingById(id)`
3. Returns `notFound()` on invalid/missing records
4. Renders `DeliveryForm` with the loaded entry

#### `components/admin/delivery/DeliveryTable.tsx` [NEW]

Client component responsibilities:

- Render city and delivery fee columns
- Provide `Add City`, `Edit`, and `Delete` actions
- Use `ConfirmDialog` for deletes
- Show empty state copy when there are no rows
- Refresh the page after successful mutation so the list reflects the current table state

#### `components/admin/delivery/DeliveryForm.tsx` [NEW]

Client form responsibilities:

- Shared create/edit component
- Fields:
  - city
  - delivery fee
- Validation before submit:
  - city required
  - delivery fee must be a positive number
- Save via `createDeliverySetting()` or `updateDeliverySetting()`
- Redirect back to `/admin/delivery` and refresh on success

---

### E. Preserve Storefront Consumers

No new shopper UI is required, but the implementation must preserve current consumer behavior:

- `components/checkout/Address/AddressForm.tsx`
- `components/checkout/Address/Guestaddressstep.tsx`
- `components/profile/AddressForm.tsx`
- `components/checkout/CheckoutList.tsx`

These already fetch:

- city lists via `getCities()` and React Query
- delivery fees via `getDeliveryFee(city)` at selection time
- promo validation via `validatePromoCode()`

Implementation implication:

- Admin delivery mutations only need to guarantee next-load freshness, not live in-tab sync.
- Admin promo mutations must immediately affect the next `validatePromoCode()` call.

---

## Complexity Tracking

No constitution violations. No additional complexity justification required.

---

## Verification Plan

### Manual Verification Scenarios

1. Unauthenticated user visits `/admin/promo-codes` or `/admin/delivery` and is redirected by the existing admin protection flow.
2. Authenticated non-admin user reaches either route and sees `AdminAccessDenied`.
3. Admin opens `/admin/promo-codes` and sees every promo row with the required fields.
4. Admin filters promo codes by `Active`, `Inactive`, `Expired`, and `Usage Capped`; each result set matches the corresponding predicate.
5. Admin creates a percentage promo with blank expiry and blank max uses; it saves and is usable at checkout.
6. Admin creates a promo with `max_uses = 0`; it appears as usage capped and is rejected by checkout validation.
7. Admin attempts to create or update a promo with a duplicate code and receives a readable error without creating a duplicate row.
8. Admin edits a promo value or active state; the list updates and the next cart/checkout validation reflects the new values.
9. Admin deletes a promo that was used historically; order rows remain unchanged while checkout can no longer redeem the deleted code.
10. Admin opens `/admin/delivery` and sees every city/fee row.
11. Admin creates a new city with a valid positive fee; it appears in the list and on the next checkout/profile city load.
12. Admin attempts to create or update a city with a duplicate name and receives a readable error.
13. Admin attempts to submit a zero or negative delivery fee and receives a validation error.
14. Admin edits a city fee; the next `getDeliveryFee(city)` call returns the new value.
15. Admin deletes a city referenced by historical orders; existing order rows keep their stored city and delivery fee values.
