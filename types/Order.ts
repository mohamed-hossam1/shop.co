import { Address } from "./Address";

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  price_at_purchase: number;
  product_title: string;
  product_image: string;
  variant_color: string;
  variant_size: string;
  variant?: { stock: number };
}

export interface Order {
  id: number;
  user_id?: string;
  guest_id?: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  total_price: number;
  payment_method: string;
  payment_image?: string;
  delivery_fee: number;
  city?: string;
  area?: string;
  address_line?: string;
  notes?: string;
  user_name?: string;
  created_at: string;
  
  // Relations
  items?: OrderItem[];
}

export interface CreateOrderData {
  user_id?: string;
  guest_id?: string;
  status?: string;
  subtotal: number;
  discount_amount: number;
  total_price: number;
  payment_method: string;
  payment_image?: string;
  delivery_fee: number;
  city: string;
  area: string;
  address_line: string;
  notes?: string;
  user_name: string;
  coupon_id?: number;
}
