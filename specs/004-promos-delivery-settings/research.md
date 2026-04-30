# Research: Promotions and Delivery Settings

**Phase**: 0 — Codebase Analysis & Decision Resolution  
**Feature**: `004-promos-delivery-settings`  
**Date**: 2026-04-30

---

## 1. Reuse the Existing Admin-Gated Action Surface

**Decision**: Reuse the current promo and delivery server actions, and add only minimal record-read helpers for edit pages.

**Rationale**:

- `actions/promoCodeAction.ts` already contains `getPromoCodes()`, `createPromoCode()`, `updatePromoCode()`, `deletePromoCode()`, and `validatePromoCode()`.
- `actions/deliveryAction.ts` already contains `getDeliverySettings()`, `createDeliverySetting()`, `updateDeliverySetting()`, `deleteDeliverySetting()`, `getCities()`, and `getDeliveryFee()`.
- Admin writes are already protected by `requireAdmin()` and already call `revalidatePromoPaths()` / `revalidateDeliveryPaths()`.
- The only missing backend support for route-based edit pages is single-record reads: `getPromoCodeById(id)` and `getDeliverySettingById(id)`.

**Alternatives considered**:

- Build a new promo/delivery action surface from scratch. Rejected because it duplicates working admin gating and revalidation.
- Query Supabase directly from edit pages. Rejected because the repo treats `actions/*.ts` as the backend contract layer.

---

## 2. Follow the Existing Admin Resource Route Pattern

**Decision**: Implement promo and delivery as dedicated list/new/edit pages, matching products and categories.

**Rationale**:

- Current admin pages use server-page reads plus client form/table components.
- `ROUTES.ADMIN_PROMO_CODES` and `ROUTES.ADMIN_DELIVERY` already exist.
- `ADMIN_NAV_ITEMS` already exposes both modules in the admin chrome.
- Dedicated routes support direct linking, browser history, and cleaner create/edit flows than in-table modal state.

**Alternatives considered**:

- Keep everything on one list page with inline create/edit sections. Rejected because it diverges from the admin conventions already established in phases 1 and 2.
- Use modal-only editing. Rejected because edit pages would then depend on list preload state and become harder to bookmark or reload safely.

---

## 3. Model Promo Status as Derived Predicates, Not a Stored Enum

**Decision**: Keep promo status filters as computed predicates over `is_active`, `expires_at`, `used_count`, and `max_uses`.

**Rationale**:

- The spec defines filters in predicate form:
  - `Active` = active toggle on, not expired, not usage capped
  - `Inactive` = `is_active === false`
  - `Expired` = expiry date is in the past
  - `Usage Capped` = `used_count >= max_uses`
- These are not mutually exclusive states. A promo can be both inactive and expired.
- Computing the filters at read time keeps the implementation aligned with the existing `validatePromoCode()` rules and avoids inventing a separate persisted status field.

**Alternatives considered**:

- Introduce a stored status column. Rejected because it would duplicate existing source fields and drift from checkout validation rules.
- Force a single mutually exclusive display state. Rejected because it would not match the acceptance criteria for `Inactive`, `Expired`, and `Usage Capped`.

---

## 4. Normalize Optional Promo Fields in the Action Layer

**Decision**: Keep `min_purchase` numeric with `0` meaning "no minimum", but treat `max_uses` and `expires_at` as nullable in application logic.

**Rationale**:

- The spec explicitly allows:
  - no expiry date
  - `max_uses = null` for unlimited usage
  - `max_uses = 0` for immediately usage-capped promos
- The current implementation incorrectly does `promo.used_count >= promo.max_uses` without null handling, which makes `null` behave like `0`.
- Keeping `min_purchase` as `0` rather than `null` avoids widening checkout logic that currently compares numeric prices directly against `coupon.min_purchase`.

**Alternatives considered**:

- Make `min_purchase` nullable too. Rejected because it adds needless null handling to checkout and does not improve feature behavior.
- Require non-null `max_uses` and `expires_at`. Rejected because it conflicts with the feature spec.

---

## 5. Add Explicit Duplicate Handling for Promo Create/Update

**Decision**: Add server-side duplicate-code checks and readable error messages for both promo creation and promo edits.

**Rationale**:

- `createPromoCode()` currently inserts directly and relies on the database response for duplicates.
- `updatePromoCode()` currently has no duplicate-code preflight at all.
- The feature spec requires a clear duplicate-code error and zero accidental duplicates.
- The action layer is the correct place to enforce this because non-admin callers must also be rejected server-side.

**Alternatives considered**:

- Client-only duplicate validation. Rejected because it can be bypassed and does not protect direct action calls.
- Raw database error passthrough only. Rejected because it gives unstable UX and does not guarantee a clean message.

---

## 6. Tighten Delivery Validation to Match the Spec

**Decision**: Keep the delivery CRUD actions but change fee validation from `>= 0` to `> 0`.

**Rationale**:

- The spec says delivery fees must be positive numbers.
- `createDeliverySetting()` and `updateDeliverySetting()` currently allow zero-fee rows.
- City uniqueness checks already exist and should stay case-insensitive.

**Alternatives considered**:

- Keep allowing `0` as a free-delivery city. Rejected because it contradicts the current feature scope and acceptance criteria.
- Push fee validation to the client only. Rejected because server-side rejection is required for direct action calls too.

---

## 7. Preserve Current Storefront Refresh Semantics

**Decision**: Keep delivery propagation on the existing next-load model: route revalidation plus fresh client queries on the next checkout/profile load.

**Rationale**:

- Checkout/profile city lists are fetched client-side through React Query via `getCities()`.
- Delivery fee lookup is already done on demand through `getDeliveryFee(city)`.
- The spec explicitly says mid-checkout sessions are not retroactively updated.
- `revalidateDeliveryPaths()` already covers `/checkout`, `/admin`, and `/admin/delivery`; admin-side `router.refresh()` after mutation is sufficient for the dashboard itself.

**Alternatives considered**:

- Add live cache busting or websocket sync to open shopper sessions. Rejected as unnecessary complexity for this release.
- Create a checkout-specific delivery settings API. Rejected because the current server actions already serve the consumers correctly.

---

## 8. Reuse the Established Admin UI System

**Decision**: Build promo and delivery screens from the existing admin primitives and list/form patterns.

**Rationale**:

- `AdminPageHeader`, `AdminSection`, `AdminField`, `AdminNotice`, `AdminStatusBadge`, and `ConfirmDialog` already support the needed states.
- Products and categories already demonstrate the desired server/client split, URL-driven filters, and post-mutation refresh flow.
- This keeps the admin surface visually and behaviorally consistent.

**Alternatives considered**:

- Introduce a separate component system for the new screens. Rejected because it creates unnecessary UI drift.
- Use store-level state for list filters. Rejected because existing admin tables already use the URL as the filter state.

---

## Summary of Resolved Unknowns

| Topic | Decision |
|---|---|
| Promo list action existence | Already exists as `getPromoCodes()` |
| Delivery CRUD action existence | Already exists as admin-gated actions |
| Edit-page data loading | Add `getPromoCodeById(id)` and `getDeliverySettingById(id)` |
| Promo status logic | Derived predicates, not a stored enum |
| Unlimited promo usage | `max_uses = null` |
| No promo minimum purchase | `min_purchase = 0` |
| Delivery refresh behavior | Next load/request, not live in-tab sync |
| Admin UI pattern | Dedicated list/new/edit routes with client forms/tables |
