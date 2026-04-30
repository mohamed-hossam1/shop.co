# Tasks: Promotions and Delivery Settings

**Input**: Design documents from `/specs/004-promos-delivery-settings/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md

**Tests**: No automated test tasks are included because the specification requests manual verification flows and the repo has no test suite yet.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`) for story-phase tasks only
- Every task includes concrete file path(s)

---

## Phase 1: Setup (Shared Structure)

**Purpose**: Create the promo and delivery admin module scaffolding in the existing admin route/component structure.

- [ ] T001 [P] Scaffold promo admin routes in `app/(admin)/admin/promo-codes/page.tsx`, `app/(admin)/admin/promo-codes/new/page.tsx`, and `app/(admin)/admin/promo-codes/[id]/edit/page.tsx`
- [ ] T002 [P] Scaffold delivery admin routes in `app/(admin)/admin/delivery/page.tsx`, `app/(admin)/admin/delivery/new/page.tsx`, and `app/(admin)/admin/delivery/[id]/edit/page.tsx`
- [ ] T003 [P] Scaffold promo admin components in `components/admin/promo-codes/PromoCodeTable.tsx` and `components/admin/promo-codes/PromoCodeForm.tsx`
- [ ] T004 [P] Scaffold delivery admin components in `components/admin/delivery/DeliveryTable.tsx` and `components/admin/delivery/DeliveryForm.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Align shared types and server actions before user-story implementation.

**⚠️ CRITICAL**: Complete this phase before starting any user story tasks.

- [ ] T005 [P] Tighten promo typing for nullable usage/expiry semantics and discount type unions in `types/PromoCode.ts`
- [ ] T006 [P] Align admin filter/input types for promo status and delivery inputs in `types/Admin.ts`
- [ ] T007 Implement promo normalization and validation helpers for `max_uses`, `expires_at`, and `min_purchase` handling in `actions/promoCodeAction.ts`
- [ ] T008 Add `getPromoCodeById` and duplicate-code guards for create/update flows in `actions/promoCodeAction.ts`
- [ ] T009 Add `getDeliverySettingById`, trim/case-insensitive duplicate checks, and positive-fee validation in `actions/deliveryAction.ts`
- [ ] T010 [P] Update cache revalidation coverage for promo/delivery admin and storefront consumers in `lib/admin/revalidate.ts`

**Checkpoint**: Shared contracts and admin action behavior are ready for independent story work.

---

## Phase 3: User Story 1 - View and Manage Promo Codes (Priority: P1) 🎯 MVP

**Goal**: Admin can list, create, edit, and delete promo codes from dedicated admin screens.

**Independent Test**: Open `/admin/promo-codes`, create a unique percentage promo, verify it appears with required columns, edit it, then delete it with confirmation.

### Implementation for User Story 1

- [ ] T011 [US1] Implement promo list page data loading and layout wiring in `app/(admin)/admin/promo-codes/page.tsx`
- [ ] T012 [P] [US1] Implement promo create page shell and form mounting in `app/(admin)/admin/promo-codes/new/page.tsx`
- [ ] T013 [P] [US1] Implement promo edit page with numeric id parsing, record load, and `notFound()` fallback in `app/(admin)/admin/promo-codes/[id]/edit/page.tsx`
- [ ] T014 [P] [US1] Build create/edit promo form validation, normalization, and submit handlers in `components/admin/promo-codes/PromoCodeForm.tsx`
- [ ] T015 [P] [US1] Build promo table columns and row actions in `components/admin/promo-codes/PromoCodeTable.tsx`
- [ ] T016 [US1] Wire destructive delete confirmation and post-delete refresh flow in `components/admin/promo-codes/PromoCodeTable.tsx` using `components/admin/ConfirmDialog.tsx`
- [ ] T017 [US1] Surface duplicate and validation errors with admin notice/toast patterns in `components/admin/promo-codes/PromoCodeForm.tsx` and `components/admin/promo-codes/PromoCodeTable.tsx`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - View and Manage Delivery Cities and Fees (Priority: P2)

**Goal**: Admin can manage city-fee delivery settings and changes apply on next checkout/profile load.

**Independent Test**: Open `/admin/delivery`, add a unique city with a positive fee, verify it appears on `/checkout` city options after reload, edit fee, then delete city.

### Implementation for User Story 2

- [ ] T018 [US2] Implement delivery list page data loading and layout wiring in `app/(admin)/admin/delivery/page.tsx`
- [ ] T019 [P] [US2] Implement delivery create page shell and form mounting in `app/(admin)/admin/delivery/new/page.tsx`
- [ ] T020 [P] [US2] Implement delivery edit page with numeric id parsing, record load, and `notFound()` fallback in `app/(admin)/admin/delivery/[id]/edit/page.tsx`
- [ ] T021 [P] [US2] Build delivery form validation, normalization, and submit handlers in `components/admin/delivery/DeliveryForm.tsx`
- [ ] T022 [P] [US2] Build delivery table rendering and row actions with delete confirmation in `components/admin/delivery/DeliveryTable.tsx`
- [ ] T023 [US2] Ensure mutation refresh flow is wired through admin UI and actions in `components/admin/delivery/DeliveryTable.tsx` and `actions/deliveryAction.ts`
- [ ] T024 [US2] Preserve storefront lookup contracts by keeping `getCities()`/`getDeliveryFee()` call sites unchanged in `components/checkout/Address/AddressForm.tsx`, `components/checkout/Address/Guestaddressstep.tsx`, and `components/profile/AddressForm.tsx`

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Filter Promo Codes by Status (Priority: P3)

**Goal**: Admin can isolate promo codes by status (All, Active, Inactive, Expired, Usage Capped) without full-page reloads.

**Independent Test**: Seed promo rows in mixed states and verify each status filter returns only matching rows.

### Implementation for User Story 3

- [ ] T025 [P] [US3] Add promo status filter controls and URL query synchronization in `components/admin/promo-codes/PromoCodeTable.tsx`
- [ ] T026 [P] [US3] Implement predicate-based status filtering (`active`, `inactive`, `expired`, `exhausted`) in `actions/promoCodeAction.ts`
- [ ] T027 [US3] Render derived status labels/badges including `Usage Capped` in `components/admin/promo-codes/PromoCodeTable.tsx` with helper usage from `lib/admin.ts`
- [ ] T028 [US3] Normalize and forward `search`/`status` params on server page load in `app/(admin)/admin/promo-codes/page.tsx`

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final UX consistency and manual verification coverage across all stories.

- [ ] T029 [P] Improve field guidance and empty/error state copy in `components/admin/promo-codes/PromoCodeForm.tsx`, `components/admin/delivery/DeliveryForm.tsx`, `components/admin/promo-codes/PromoCodeTable.tsx`, and `components/admin/delivery/DeliveryTable.tsx`
- [ ] T030 [P] Standardize promo/delivery value and date presentation using shared helpers in `components/admin/promo-codes/PromoCodeTable.tsx`, `components/admin/delivery/DeliveryTable.tsx`, and `lib/admin.ts`
- [ ] T031 Execute the manual smoke path and capture pass/fail notes in `specs/004-promos-delivery-settings/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2
- **Phase 5 (US3)**: Depends on Phase 2 and promo UI/action groundwork from US1
- **Phase 6 (Polish)**: Depends on all completed stories

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational; no dependency on US2/US3
- **US2 (P2)**: Starts after Foundational; independent of US1/US3
- **US3 (P3)**: Starts after Foundational; builds on promo surfaces delivered in US1

### Within Each Story

- Server page data loading before UI wiring that depends on loaded props
- Form/table core implementation before destructive or edge-case handling
- Story checkpoint validation before moving to the next priority

---

## Parallel Opportunities

- **Setup**: T001-T004 can run in parallel across separate route/component files.
- **Foundational**: T005, T006, and T010 can run in parallel; T007-T009 are action-level tasks and can be split by module.
- **US1**: T012, T013, T014, and T015 can run in parallel after foundational action/type work lands.
- **US2**: T019, T020, T021, and T022 can run in parallel after delivery action updates.
- **US3**: T025 (UI URL controls) and T026 (server filtering predicates) can run in parallel, then merge via T027-T028.

### Parallel Example: User Story 1

```bash
# Parallelize route shells
Task T012: app/(admin)/admin/promo-codes/new/page.tsx
Task T013: app/(admin)/admin/promo-codes/[id]/edit/page.tsx

# Parallelize core UI components
Task T014: components/admin/promo-codes/PromoCodeForm.tsx
Task T015: components/admin/promo-codes/PromoCodeTable.tsx
```

### Parallel Example: User Story 2

```bash
# Parallelize delivery routes
Task T019: app/(admin)/admin/delivery/new/page.tsx
Task T020: app/(admin)/admin/delivery/[id]/edit/page.tsx

# Parallelize delivery UI components
Task T021: components/admin/delivery/DeliveryForm.tsx
Task T022: components/admin/delivery/DeliveryTable.tsx
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) end-to-end.
3. Validate promo CRUD independently before expanding scope.

### Incremental Delivery

1. Ship US1 (promo CRUD) as the first operational milestone.
2. Add US2 (delivery settings) and verify checkout/profile next-load propagation.
3. Add US3 (promo status filtering) for campaign-ops efficiency.
4. Finish with Phase 6 polish and manual smoke verification.

### Parallel Team Strategy

1. Team completes Phase 1-2 together.
2. Split into parallel tracks:
   - Track A: US1 promo pages/forms/tables
   - Track B: US2 delivery pages/forms/tables
3. Merge both tracks, then implement US3 filters and final polish.
