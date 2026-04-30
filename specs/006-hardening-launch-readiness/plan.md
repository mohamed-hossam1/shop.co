# Implementation Plan: Hardening, Integrity, and Launch Readiness

**Branch**: `[006-hardening-launch-readiness]` | **Date**: 2026-04-30 | **Spec**: `/specs/006-hardening-launch-readiness/spec.md`
**Input**: Feature specification from `/specs/006-hardening-launch-readiness/spec.md`

## Summary

This feature secures critical flows for production launch by enforcing order ownership access controls, recalculating checkout prices on the server to prevent payload tampering, enforcing robust server-side RBAC for admin mutations, displaying stock visibility warnings, and adding cache revalidation to admin catalog operations.

## Technical Context

**Language/Version**: TypeScript, React 19, Next.js 16 App Router  
**Primary Dependencies**: Supabase Auth/Postgres, Zustand, React Query, Next.js Server Actions  
**Storage**: PostgreSQL (Supabase)  
**Testing**: Manual / End-to-End User Scenario Testing (No automated framework identified)  
**Target Platform**: Web Browser / Next.js Server Components  
**Project Type**: E-commerce Web Application  
**Performance Goals**: Fast server responses and efficient Next.js cache invalidation  
**Constraints**: Security (RBAC and data integrity) must be retrofitted into existing actions without breaking guest checkout flows.  
**Scale/Scope**: Moderate. Cross-cutting concerns in `actions/ordersAction.ts`, `actions/productsAction.ts`, and `app/(store)/order-success/page.tsx`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The local constitution is currently template boilerplate. No violations. 
Security and integrity principles mandate that server-side validation is strictly required for authorization and financial calculations.

## Project Structure

### Documentation (this feature)

```text
specs/006-hardening-launch-readiness/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── contracts/           # Phase 1 output (/speckit-plan command)
```

### Source Code (repository root)

```text
actions/
├── ordersAction.ts       # Update createOrder pricing, getOrderById ownership
├── productsAction.ts     # Add cache revalidation
├── categoriesAction.ts   # Add cache revalidation
├── deliveryAction.ts     # Add cache revalidation
└── promoCodeAction.ts    # Add cache revalidation

app/
└── (store)/
    └── order-success/
        └── page.tsx      # Ownership validation integration

components/
└── admin/
    ├── products/         # Add stock warning badges
    └── orders/           # Add stock warning badges
```

**Structure Decision**: Modifications will be localized to existing Next.js server actions for security logic, and existing admin UI components for stock visibility.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |
