# UI Contracts: User Administration

**Feature**: `005-user-administration` | **Date**: 2026-04-30

This document defines the interface contracts between admin user pages (Server Components), client components, and server actions.

---

## Route Surface

| Route | Responsibility |
|---|---|
| `/admin/users` | List, search, and filter user accounts |
| `/admin/users/[id]` | View one user profile, related orders, role controls, and access removal |

---

## `/admin/users` List Contracts

### Server Page: `app/(admin)/admin/users/page.tsx`

**Input from URL**:

```ts
searchParams: {
  search?: string;
  role?: "admin" | "user";
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
}
```

**Server action call**:

```ts
getAdminUsers(filters: AdminUserFilters)
```

**Action response contract**:

```ts
{ success: true; data: User[] } | { success: false; message: string }
```

**Page-to-component props**:

```ts
<UserTable
  users={User[]}
  filters={AdminUserFilters}
/>
```

---

### Client Component: `components/admin/users/UserTable.tsx`

**Receives**:

```ts
props: {
  users: User[];
  filters?: AdminUserFilters;
}
```

**Renders columns**:

- Name
- Email
- Phone
- Role
- Created Date
- Actions (View detail)

**Behavior**:

- Renders `AdminEmptyState` when `users.length === 0`.
- Uses `UserFilterBar` for URL-driven filtering.
- “View” action navigates to `/admin/users/[id]`.

---

### Client Component: `components/admin/users/UserFilterBar.tsx`

**Reads/Writes URL params**:

- `search`
- `role`
- `dateFrom`
- `dateTo`

**Behavior contract**:

- Search is debounced before updating URL.
- Role/date filters update URL immediately.
- Clear button resets all filter params.
- URL is the single source of truth for list state.

---

## `/admin/users/[id]` Detail Contracts

### Server Page: `app/(admin)/admin/users/[id]/page.tsx`

**Route param**:

```ts
params: { id: string }
```

**Server action calls**:

```ts
getAdminUserById(userId: string)
getAdminOrders({ userId: string })
```

**Detail data contract**:

```ts
{
  user: User;
  orders: Order[];
}
```

**Missing user behavior**:

- If user lookup fails, page returns `notFound()`.

---

### Client Component: `components/admin/users/UserProfileCard.tsx`

**Receives**:

```ts
props: {
  user: User;
  isSelf: boolean;
}
```

**Includes**:

- Profile fields display (name/email/phone/role/created_at)
- `UserRoleSelect` for role updates
- `DeleteUserAccessButton` for destructive access removal

---

### Client Component: `components/admin/users/UserOrdersTable.tsx`

**Receives**:

```ts
props: {
  orders: Order[];
}
```

**Renders columns**:

- Order ID
- Date
- Status
- Total
- Payment Method
- Action (`View Order`)

**Behavior**:

- Empty orders array shows non-error empty state.
- View action navigates to `/admin/orders/[id]`.

---

## Mutation Contracts

### `updateUserRole(userId, role)`

**Input**:

```ts
userId: string
role: "admin" | "user"
```

**Output**:

```ts
{ success: true; data: User } | { success: false; message: string }
```

**Constraints**:

- Admin-only.
- Rejects invalid roles.
- Rejects self-demotion from admin.

---

### `deleteUserAccess(userId, confirmation)`

**Input**:

```ts
userId: string
confirmation: { confirmRemoval: true } // or equivalent explicit confirmation token
```

**Output**:

```ts
{ success: true; message: string } | { success: false; message: string }
```

**Constraints**:

- Admin-only.
- Rejects self-removal.
- Requires explicit confirmation input.
- Success message must clarify historical order records are preserved.

---

## Error/Feedback Contract

- Action failures render human-readable admin notices/messages.
- Unauthorized action attempts return `Unauthorized` without partial writes.
- Destructive action cancellation must produce no backend mutation.

