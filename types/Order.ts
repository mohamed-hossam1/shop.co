interface CreateOrderData {
  addressId: number;
  paymentMethod: string;
  paymentImageFile?: File;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalPrice: number;
  couponId?: number;
}

interface OrderData {
  id: number;
  created_at: string;
  address_id: number;
  total_price: number;
  status: string;
  user_id: string;
  payment_image?: string;
  payment_method: string;
  delivery_fee: number;
  discount_amount: number;
  subtotal: number;
  coupon_id: 1;
  addresses: {
    area: string;
    city: string;
    phone: string;
    street: string;
    building_number: string;
  };
}

interface OrderItem {
  id: number;
  product_title: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product_image: string;
}

