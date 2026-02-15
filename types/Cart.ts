import { ProductData } from "./Product";

export interface CartData {
  products: ProductData;
  quantity: number;
}

export interface CartState {
  [productId: string]: CartData;
}


export interface AppliedPromo{
  discount_percentage: number;
  id: number;
  code:string

}
