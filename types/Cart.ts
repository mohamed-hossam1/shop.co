
import { ProductData, ProductVariant } from "./Product";

export interface CartItem {
  id: number;
  cart_id: string;
  variant_id: number;
  quantity: number;
  lineTotal?: number;
  
  // Relations
  variant?: ProductVariant & {
    product?: ProductData;
  };
}

export interface Cart {
  id: string;
  user_id?: string;
  created_at?: string;
  items?: CartItem[];
  
  // UI fields / Calculated
  subtotal?: number;
  itemCount?: number;
}
export interface CartState {
  [variantId: number]: {
    id?: number;
    quantity: number;
    variant: ProductVariant & {
      product: ProductData;
    };
  }
}

export interface CartData {
  variant: ProductVariant & {
    product: ProductData;
  };
  quantity?: number;
}

import { PromoCode } from "./PromoCode";

export type AppliedPromo = PromoCode;
