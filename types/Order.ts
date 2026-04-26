import { Address } from "./Address";

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  price_at_purchase: number;
  product_title: string;
  product_image: string;
  variant_snapshot: any;
}

export interface Order {
  id: number;
  user_id: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  total_price: number;
  payment_method: string;
  payment_image: string;
  delivery_fee: number;
  guest_info: any;
  created_at: string;
  
  // Relations
  items?: OrderItem[];
  addresses?: Address;
}

export interface CreateOrderData {
  user_id?: string;
  status?: string;
  subtotal: number;
  discount_amount: number;
  total_price: number;
  payment_method: string;
  payment_image?: string;
  delivery_fee: number;
  guest_info?: any;
}
