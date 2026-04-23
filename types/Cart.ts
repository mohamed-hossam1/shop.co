
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


