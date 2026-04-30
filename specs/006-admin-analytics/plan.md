# Implementation Plan: Admin Analytics Dashboard

**Branch**: `006-admin-analytics` | **Date**: 2026-04-30 | **Spec**: [specify.md](specify.md)
**Input**: Feature specification from `/specs/006-admin-analytics/specify.md`

## Summary

Transform `/admin` from a module launcher into an analytics-first dashboard that shows revenue, order volume, product performance, customer activity, and recent transactions, while keeping the existing admin module cards as secondary shortcuts on the same page.

The implementation stays within the current Next.js App Router + Supabase server-action architecture, adds one dedicated analytics action, and computes all values server-side from the existing `orders`, `order_items`, and `users` tables.

## Technical Context

**Language/Version**: TypeScript, Next.js 16, React 19, Tailwind CSS 4
**Primary Dependencies**: Next.js App Router, Supabase SSR/server client, Zustand, React Query, Radix UI, Headless UI, Motion
**Storage**: PostgreSQL via Supabase; no new tables planned for v1
**Testing**: Existing manual verification plus `npm run lint`; no dedicated automated test suite in repo
**Target Platform**: Web application on Linux/macOS/Windows browsers
**Project Type**: Web application
**Performance Goals**: Default dashboard load should stay responsive for the last 30 days dataset; analytics should be computed per request without visible blocking beyond a normal server render
**Constraints**: Preserve admin-only access, keep existing module routes unchanged, use delivered orders only for recognized revenue, avoid schema migrations, cap custom ranges at 366 days, keep Africa/Cairo date boundaries
**Scale/Scope**: Single storefront app with one admin dashboard page, one analytics action, and a small set of dashboard components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Single app architecture is preserved: this feature adds pages/components/actions inside the existing Next.js app, not a separate service.
- Server actions remain the backend boundary: analytics data is fetched through a new server action rather than a new API layer.
- No schema migration is required: v1 uses existing tables only.
- Admin access control remains enforced server-side: analytics action must use the existing admin guard pattern.
- Scope is intentionally narrow: `/admin` changes shape, but existing module routes remain intact.

## Project Structure

### Documentation (this feature)

```text
specs/006-admin-analytics/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── admin-analytics.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
└── (admin)/
    └── admin/
        └── page.tsx

actions/
└── analyticsAction.ts

components/
└── admin/
    └── analytics/
        ├── AnalyticsFilterBar.tsx
        ├── CustomerActivityPanel.tsx
        ├── KpiGrid.tsx
        ├── RecentTransactionsTable.tsx
        ├── RevenueOrdersTrend.tsx
        ├── StatusDistribution.tsx
        └── TopProductsTable.tsx

types/
└── AdminAnalytics.ts

lib/
└── admin.ts
```

**Structure Decision**: Keep the feature inside the existing single Next.js app, with one server action, one feature folder for analytics UI, and a dedicated analytics type module. This matches the current app/router, action-layer, and shared-types conventions already used throughout the repository.

## Complexity Tracking

No constitution violations require justification at this stage.
