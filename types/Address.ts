export interface Address {
  id: number;
  user_id: string;
  full_name: string;
  phone: string;
  city: string;
  area: string;
  address_line: string;
  notes?: string;
  is_default: boolean;
}