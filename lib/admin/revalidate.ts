import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";

function revalidatePaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export function revalidateCatalogPaths(productId?: number) {
  revalidatePaths([
    ROUTES.HOME,
    ROUTES.PRODUCTS,
    ROUTES.ADMIN,
    ROUTES.ADMIN_PRODUCTS,
    ROUTES.ADMIN_CATEGORIES,
  ]);

  if (productId) {
    revalidatePath(`${ROUTES.PRODUCTS}/${productId}`);
    revalidatePath(`${ROUTES.ADMIN_PRODUCTS}/${productId}`);
  }
}

export function revalidateCategoryPaths() {
  revalidatePaths([
    ROUTES.HOME,
    ROUTES.PRODUCTS,
    ROUTES.ADMIN,
    ROUTES.ADMIN_CATEGORIES,
    ROUTES.ADMIN_PRODUCTS,
  ]);
}

export function revalidatePromoPaths() {
  revalidatePaths([
    ROUTES.CART,
    ROUTES.CHECKOUT,
    ROUTES.ADMIN,
    ROUTES.ADMIN_PROMO_CODES,
  ]);
}

export function revalidateDeliveryPaths() {
  revalidatePaths([
    ROUTES.CHECKOUT,
    ROUTES.ADMIN,
    ROUTES.ADMIN_DELIVERY,
  ]);
}

export function revalidateOrderPaths(orderId?: number) {
  revalidatePaths([
    ROUTES.ORDERS,
    ROUTES.ORDER_SUCCESS,
    ROUTES.ADMIN,
    ROUTES.ADMIN_ORDERS,
  ]);

  if (orderId) {
    revalidatePath(`${ROUTES.ADMIN_ORDERS}/${orderId}`);
  }
}

export function revalidateUserPaths(userId?: string) {
  revalidatePaths([ROUTES.ADMIN, ROUTES.ADMIN_USERS]);

  if (userId) {
    revalidatePath(`${ROUTES.ADMIN_USERS}/${userId}`);
  }
}
