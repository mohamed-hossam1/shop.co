
export interface Category {
  id: number;
  title: string;
  slug: string;
  image: string;
  created_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color: string;
  size: string;
  price: number;
  price_before: number;
  stock: number;
  sku: string;
  created_at: string;
}

export interface ProductData {
  id: number;
  title: string;
  description?: string;
  category_id?: number;
  image_cover: string;
  is_deleted?: boolean;
  new_arrival?: boolean;
  top_selling?: boolean;
  created_at?: string;
  
  // Relations
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  
  // Compatibility / Calculated
  price_after?: number; // Should be handled via variants but keeping for compatibility
  price_before?: number;
  stock?: number;
}
