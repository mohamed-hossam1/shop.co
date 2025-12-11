interface PromoCode{
  id:number,
  code:string,
  discount_percentage:number,
  used_count: number,
  max_uses: number,
  is_active:boolean,
  min_purchase: number
}
