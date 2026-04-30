# Quickstart: Promotions and Delivery Settings

**Feature**: `004-promos-delivery-settings`  
**Date**: 2026-04-30

---

## Prerequisites

- Admin foundation is already in place:
  - `app/(admin)/admin/layout.tsx`
  - `components/admin/AdminChrome.tsx`
  - `components/admin/AdminUI.tsx`
  - `components/admin/ConfirmDialog.tsx`
- Admin nav routes already exist in `constants/routes.ts` and `lib/admin.ts`.
- Existing promo and delivery server actions already exist and will be extended rather than replaced.
- No automated test suite exists; verification is manual.

---

## Where Things Live

```text
app/(admin)/admin/promo-codes/
  page.tsx
  new/page.tsx
  [id]/edit/page.tsx

app/(admin)/admin/delivery/
  page.tsx
  new/page.tsx
  [id]/edit/page.tsx

components/admin/promo-codes/
  PromoCodeTable.tsx
  PromoCodeForm.tsx

components/admin/delivery/
  DeliveryTable.tsx
  DeliveryForm.tsx
```

---

## Key Imports

```ts
// Promo actions
import {
  getPromoCodes,
  getPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
} from "@/actions/promoCodeAction";

// Delivery actions
import {
  getDeliverySettings,
  getDeliverySettingById,
  createDeliverySetting,
  updateDeliverySetting,
  deleteDeliverySetting,
  getCities,
  getDeliveryFee,
} from "@/actions/deliveryAction";

// Admin UI primitives
import {
  AdminPageHeader,
  AdminSection,
  AdminField,
  AdminNotice,
  AdminStatusBadge,
  AdminEmptyState,
  adminInputClassName,
  adminSelectClassName,
  adminCheckboxClassName,
} from "@/components/admin/AdminUI";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getPromoStatusTone } from "@/lib/admin";
import ROUTES from "@/constants/routes";
```

---

## URL / Filter Mapping

### Promo list

| UI control | URL param | Notes |
|---|---|---|
| Search input | `search` | promo code text |
| Status filter | `status` | `all`, `active`, `inactive`, `expired`, `exhausted` |

Use `exhausted` in the URL/action layer and label it as `Usage Capped` in the UI.

---

## Form Normalization Rules

### Promo form

- blank `min_purchase` becomes `0`
- blank `max_uses` becomes `null`
- blank `expires_at` becomes `null`
- `max_uses = 0` is valid and means the code is immediately usage capped

### Delivery form

- trim `city`
- parse `delivery_fee` to number
- reject `delivery_fee <= 0`

---

## Storefront Impact

- Cart and checkout continue using `validatePromoCode()` with no new API surface.
- Checkout and profile city selectors continue using `getCities()`.
- Checkout delivery fee calculation continues using `getDeliveryFee(city)`.
- After a delivery mutation, the next checkout/profile load should refetch the latest city list and fee data.

Open shopper sessions do not update live; this matches the feature spec.

---

## Manual Smoke Path

1. Sign in as an admin user.
2. Visit `/admin/promo-codes`.
3. Create a promo with:
   - code: `SPRING25`
   - type: `percentage`
   - value: `25`
   - minimum purchase: blank or `0`
   - maximum usage cap: blank
   - expiry: blank
4. Verify it appears in the list and can be applied in cart/checkout.
5. Edit the promo to change its value and verify the next promo validation reflects the change.
6. Attempt to create the same promo code again and verify the duplicate error.
7. Visit `/admin/delivery`.
8. Create a city with a positive fee.
9. Refresh `/checkout` and confirm the city appears in the selector and the fee lookup returns the new amount.
10. Delete the city and confirm it disappears on the next checkout/profile load without altering historical order rows.
