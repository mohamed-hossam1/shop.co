import { ProductDetails, ProductVariant } from "./Product";

export interface CartItem {
  id: number;
  cart_id: string;
  variant_id: number;
  quantity: number;
  lineTotal?: number;
  
  variant?: ProductVariant & {
    product?: ProductDetails;
  };
}

export interface Cart {
  id: string;
  user_id?: string;
  guest_id?: string;
  created_at?: string;
  items?: CartItem[];
  
  subtotal?: number;
  itemCount?: number;
}
export interface CartState {
  [variantId: number]: {
    id?: number;
    quantity: number;
    variant: ProductVariant & {
      product: ProductDetails;
    };
  }
}

export interface CartData {
  variant: ProductVariant & {
    product: ProductDetails;
  };
  quantity?: number;
}

import { PromoCode } from "./PromoCode";

export type AppliedPromo = PromoCode;
