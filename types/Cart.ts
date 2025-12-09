interface CartData {
  products: ProductData;
  quantity: number;
}

interface CartState {
  [productId: string]: CartData;
}

interface CartContextType {
  cart: CartState | null;
  quantity: number;
  price: number;
  initCart: () => Promise<void>;
  addToCart: ({ products, quantity }: CartData) => Promise<void>;
  clearCart: () => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  isLoading: boolean;
}

