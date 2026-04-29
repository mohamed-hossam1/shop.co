# Tasks: Admin Foundation and Access Control

Feature: `001-admin-foundation`
Plan: [plan.md](./plan.md)

## Phase 1: Setup

- [x] T001 Verify existing admin infrastructure files in `lib/auth/admin.ts`, `components/admin/AdminChrome.tsx`, and `constants/routes.ts`

## Phase 2: Foundational

- [x] T002 Implement admin layout with role-based gatekeeping in `app/(admin)/admin/layout.tsx`

## Phase 3: User Story 3 - Admin Landing Page

- [x] T003 [US3] Create admin landing page as a module index in `app/(admin)/admin/page.tsx` using `ADMIN_NAV_ITEMS`

## Phase 4: Polish & Validation

- [x] T004 Verify unauthenticated redirect to `/sign-in` for `/admin` paths
- [x] T005 Verify non-admin access-denied state for `/admin` paths
- [x] T006 Verify admin access to landing page and module links
- [x] T007 Verify sign-out functionality from the admin shell

## Dependencies

- T002 is a prerequisite for T003
- T002 and T003 are prerequisites for validation tasks T004-T007

## Implementation Strategy

- Focus on the "Two-Tier Access Control" pattern: Middleware for unauthenticated, Layout for role-check.
- Use `AdminChrome` and `AdminUI` components to maintain consistency.
- Keep the landing page navigation-only as per spec.
