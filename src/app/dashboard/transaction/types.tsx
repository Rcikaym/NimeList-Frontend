export interface DataType {
  id: string;
  order_id: string;
  status: string;
  total: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface PremiumDetails {
  name: string;
  price: number;
  duration: string;
}

export interface TransactionDetails {
  order_id: string;
  status: string;
  total: number;
  payment_platform: string;
  username: string;
  created_at: string;
  updated_at: string;
  premium: PremiumDetails;
}
