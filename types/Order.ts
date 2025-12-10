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

interface OrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  priceAtPurchase: number;
}
