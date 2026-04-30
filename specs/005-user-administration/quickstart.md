# Quickstart: User Administration

**Feature**: `005-user-administration`  
**Date**: 2026-04-30

---

## Prerequisites

- Admin foundation and route shell already exist (`app/(admin)/admin/layout.tsx`, `components/admin/AdminChrome.tsx`).
- Action-layer admin guard exists via `requireAdmin()`.
- User and order action surfaces already exist and are being extended:
  - `actions/userAction.ts`
  - `actions/ordersAction.ts`
- No automated tests exist; verification is manual.

---

## Where Things Live

```text
app/(admin)/admin/users/
  page.tsx
  [id]/page.tsx

components/admin/users/
  UserFilterBar.tsx
  UserTable.tsx
  UserProfileCard.tsx
  UserOrdersTable.tsx

actions/
  userAction.ts

types/
  Admin.ts
```

---

## Key Imports

```ts
import ROUTES from "@/constants/routes";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

import {
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteUserAccess,
} from "@/actions/userAction";

import { getAdminOrders } from "@/actions/ordersAction";
import { AdminUserFilters } from "@/types/Admin";
```

---

## URL Filter Mapping (`/admin/users`)

| UI Control | Query Param | Example |
|---|---|---|
| Search input | `search` | `?search=gmail.com` |
| Role select | `role` | `?role=admin` |
| Date From | `dateFrom` | `?dateFrom=2026-01-01` |
| Date To | `dateTo` | `?dateTo=2026-01-31` |

Notes:

- `search` matches name/email/phone.
- Empty params are removed from URL.
- Date range is interpreted server-side against `created_at`.

---

## Access Removal Flow

1. Admin opens `/admin/users/[id]`.
2. Admin clicks `Remove Access`.
3. `ConfirmDialog` appears with destructive warning and preserved-data note.
4. Admin confirms.
5. Client calls `deleteUserAccess` with explicit confirmation payload.
6. On success, user is redirected to `/admin/users` and list refreshes.

Expected result:

- Affected account can no longer sign in.
- Existing order history remains visible in admin order/user history views.

---

## Manual Smoke Path

1. Sign in as admin and open `/admin/users`.
2. Verify users table renders name/email/phone/role/created date.
3. Search by email, verify filtering.
4. Search by phone, verify filtering.
5. Filter by role `admin`, verify only admins are listed.
6. Set created-date range, verify users are constrained to range.
7. Open one user detail page.
8. Verify profile info and order-history table both load.
9. Change role and save, verify updated role on refresh.
10. Trigger access-removal dialog and cancel, verify no change.
11. Confirm access removal, verify success and redirect.
12. Attempt sign-in as removed user, verify authentication fails.
13. Verify removed user's historical orders are still visible in admin orders.
14. Sign in as non-admin and attempt user admin actions, verify server-side unauthorized responses.

