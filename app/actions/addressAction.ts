"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAddresses() {
  const supabase = await createClient()
  const {data:user} = await supabase.auth.getUser()
  if(user?.user){
    const {data:addresses, error} = await supabase.from("addresses")
    .select("*")
    .eq("user_id",user?.user.id)
    return addresses
  }
  else{
    return []
  }
}



export async function addAddress(productId:number, quantity:number) {
  const supabase = await createClient()
  const {data:user} = await supabase.auth.getUser()
  if(user?.user){
    const {data:addresses, error} = await supabase.from("addresses")
    .insert({quantity: quantity, "product_id": productId, "user_id":user.user.id})
    .select(`quantity, products(id, title, price_before, price_after, image_cover, categories(title) )`)
    return {addresses,error}
  }
  else{
    return []
  }
}

export async function removeAddress(productId:number) {
  const supabase = await createClient()
  const {data:user} = await supabase.auth.getUser()
  if(user?.user){
    const {data:addresses, error} = await supabase.from("addresses")
    .delete()
    .eq("user_id",user.user.id)
    .eq("product_id",productId)
    return addresses
  }
  else{
    return []
  }
}

