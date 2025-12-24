
export interface ProductData{
  id:number,
  created_at?:string,
  description?:string,
  ingredients?:string,
  title:string,
  price_before: number,
  price_after: number,
  basic_price?:number,
  image_cover: string,
  images?: string[],
  stock: number,
  categories: { title: string, image?:string, id:number }
}