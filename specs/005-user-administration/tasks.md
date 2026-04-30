# Tasks: User Administration

**Input**: Design documents from `/media/mohamed/mo/shop.co/specs/005-user-administration/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contracts.md`, `quickstart.md`

**Tests**: No automated test suite or TDD requirement is specified for this feature. Execute manual verification scenarios from `quickstart.md`.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`) for traceability
- Each task includes concrete file path(s)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the route/component scaffolding for the new admin users module.

- [ ] T001 Create users admin route files in `app/(admin)/admin/users/page.tsx` and `app/(admin)/admin/users/[id]/page.tsx`
- [ ] T002 [P] Create users admin component files in `components/admin/users/UserFilterBar.tsx`, `components/admin/users/UserTable.tsx`, `components/admin/users/UserProfileCard.tsx`, and `components/admin/users/UserOrdersTable.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared type/action contracts required before story work.

**⚠️ CRITICAL**: Complete this phase before user-story implementation.

- [ ] T003 Extend admin user contracts in `types/Admin.ts` to include `dateFrom`/`dateTo` filters and explicit access-removal confirmation payload typing
- [ ] T004 Update admin user actions in `actions/userAction.ts` to validate created-date ranges and apply server-side `created_at` filtering in `getAdminUsers`

**Checkpoint**: Shared contracts are ready; user stories can begin.

---

## Phase 3: User Story 1 - Find and Review User Accounts (Priority: P1) 🎯 MVP

**Goal**: Deliver `/admin/users` list with search, role filter, and created-date range filter.

**Independent Test**: Open `/admin/users` as admin; verify name/email/phone/role/created-date columns and each filter (`search`, `role`, `dateFrom`, `dateTo`) narrows results correctly.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Implement URL-driven search/role/date filter controls in `components/admin/users/UserFilterBar.tsx`
- [ ] T006 [P] [US1] Implement users table UI with role badge, created-date display, and detail-link action in `components/admin/users/UserTable.tsx`
- [ ] T007 [US1] Implement server page loading and filter mapping in `app/(admin)/admin/users/page.tsx` using `getAdminUsers`
- [ ] T008 [US1] Add list-level empty/error handling in `app/(admin)/admin/users/page.tsx` and `components/admin/users/UserTable.tsx`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Manage Roles from User Detail (Priority: P2)

**Goal**: Deliver `/admin/users/[id]` detail with profile context, order history, and role update controls.

**Independent Test**: Open `/admin/users/[id]`; verify profile + orders render together, update role, refresh, and confirm role persists and protected access reflects the new role.

### Implementation for User Story 2

- [ ] T009 [P] [US2] Build profile summary and role-management panel in `components/admin/users/UserProfileCard.tsx`
- [ ] T010 [P] [US2] Build user-specific order history table with links to admin order detail in `components/admin/users/UserOrdersTable.tsx`
- [ ] T011 [US2] Implement user detail data composition and `notFound()` handling in `app/(admin)/admin/users/[id]/page.tsx` using `getAdminUserById` and `getAdminOrders`
- [ ] T012 [US2] Refine role-update feedback and self-demotion safeguards in `components/admin/UserRoleSelect.tsx` and `components/admin/users/UserProfileCard.tsx`

**Checkpoint**: User Stories 1 and 2 are both functional and independently testable.

---

## Phase 5: User Story 3 - Remove Platform Access Safely (Priority: P3)

**Goal**: Deliver explicit destructive access removal with preserved-history messaging.

**Independent Test**: From `/admin/users/[id]`, run cancel/confirm removal flows; verify cancel performs no mutation, confirm blocks future sign-in, and historical orders remain visible.

### Implementation for User Story 3

- [ ] T013 [US3] Enforce explicit confirmation contract and preserved-history success messaging in `actions/userAction.ts` `deleteUserAccess`
- [ ] T014 [P] [US3] Replace `window.confirm` with `ConfirmDialog` flow in `components/admin/DeleteUserAccessButton.tsx`
- [ ] T015 [P] [US3] Wire destructive access-removal control into the detail card in `components/admin/users/UserProfileCard.tsx`
- [ ] T016 [US3] Handle self-removal, missing-user, and already-removed no-op/error messaging in `actions/userAction.ts` and `components/admin/DeleteUserAccessButton.tsx`

**Checkpoint**: All user stories are functional and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and validation pass across all stories.

- [ ] T017 [P] Update interface/UX contract details to match final implementation in `specs/005-user-administration/contracts/ui-contracts.md`
- [ ] T018 [P] Update and execute final manual smoke steps in `specs/005-user-administration/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all story work.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; recommended after US1 for full list-to-detail workflow.
- **Phase 5 (US3)**: Depends on Phase 4 because removal is executed from the user detail context.
- **Phase 6 (Polish)**: Depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: No story dependency after foundational work.
- **US2 (P2)**: No hard technical dependency on US1, but relies on shared user module scaffolding and is normally delivered after US1.
- **US3 (P3)**: Depends on US2 detail surface and action contracts.

### Within Each User Story

- Shared contracts/actions before UI integration.
- Filter/form controls before page composition.
- Mutation contract changes before destructive UI wiring.
- Complete story checkpoint before moving to next priority.

---

## Parallel Opportunities

- **Setup**: T002 can run while route scaffolding from T001 is in progress if file ownership is split.
- **US1**: T005 and T006 run in parallel, then T007/T008 integrate.
- **US2**: T009 and T010 run in parallel, then T011/T012 integrate and refine.
- **US3**: After T013, T014 and T015 run in parallel, then T016 finalizes edge handling.
- **Polish**: T017 and T018 run in parallel.

## Parallel Example: User Story 1

```bash
Task T005: Implement filters in components/admin/users/UserFilterBar.tsx
Task T006: Implement table in components/admin/users/UserTable.tsx
```

## Parallel Example: User Story 2

```bash
Task T009: Build profile panel in components/admin/users/UserProfileCard.tsx
Task T010: Build orders table in components/admin/users/UserOrdersTable.tsx
```

## Parallel Example: User Story 3

```bash
Task T014: Refactor destructive UI in components/admin/DeleteUserAccessButton.tsx
Task T015: Wire removal control in components/admin/users/UserProfileCard.tsx
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 filters and table behavior at `/admin/users`.
4. Demo/deploy MVP.

### Incremental Delivery

1. Deliver US1 (user discovery).
2. Deliver US2 (detail + role management).
3. Deliver US3 (safe access removal).
4. Run polish/documentation validation.

### Parallel Team Strategy

1. One developer completes Phase 1-2 contracts.
2. Split US1 table/filter work (T005/T006).
3. Split US2 profile/orders work (T009/T010).
4. Split US3 action/UI work after T013.

---

## Notes

- All tasks follow the required checklist format: checkbox, Task ID, optional `[P]`, required story label for story phases, and concrete file path(s).
- Keep server-action response shape `{ success, data?, message? }` unchanged.
- Preserve dual guarantees for access removal: sign-in revoked, historical orders preserved.
