export type OrderStatus =
  | 'pending'
  | 'conducted'
  | 'confirmed'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'partially_returned';

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_at: string;
  comment: string | null;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: number;
  business_id: string;
  shipping_address: any;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  history?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price_at_purchase: number;
  snapshot_name: string;
  created_at: string;
}

export interface CreateOrderDTO {
  user_id?: string;
  phone?: string;
  business_id: string;
  shipping_address: any;
  items: {
    product_id: string;
    variant_id: string;
    quantity: number;
  }[];
}

export interface UpdateOrderDTO extends Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>> {}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  comment?: string;
}
