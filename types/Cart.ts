import { ProductData } from "./Product";

export interface CartData {
  products: ProductData;
  quantity: number;
}

export interface CartState {
  [productId: string]: CartData;
}

export interface CartContextType {
  cart: CartState | null;
  quantity: number;
  price: number;
  appliedPromo: AppliedPromo | null; 
  setAppliedPromo: (promo: AppliedPromo | null) => void;
  initCart: () => Promise<void>;
  addToCart: (data: CartData) => Promise<void>;
  clearCart: () => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  isLoading: boolean;
}


export interface AppliedPromo{
  discount_percentage: number;
  id: number;
  code:string

}