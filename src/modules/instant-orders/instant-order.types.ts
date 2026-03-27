export type InstantOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'canceled'
  | 'returned'
  | 'on_the_way'
  | 'delivered'

export interface CustomerInfo {
  name: string
  phone: string
  address: string
}

export interface OrderItem {
  title: string
  price: number
  quantity: number
  unit: string
}

export interface InstantOrder {
  id: string
  business_id: string
  user_id: string | null
  temp_user_id: string | null
  customer_info: CustomerInfo
  delivery_charge: number
  cod_reference: string | null
  order_items: OrderItem[]
  status: InstantOrderStatus
  created_at: string
  updated_at: string
}

export interface CreateInstantOrderDTO {
  business_id: string
  user_id?: string
  customer_info?: CustomerInfo
  delivery_charge?: number
  cod_reference?: string
  order_items: OrderItem[]
}

export interface UpdateInstantOrderDTO {
  status?: InstantOrderStatus
  delivery_charge?: number
  cod_reference?: string
  order_items?: OrderItem[]
  customer_info?: CustomerInfo // Allow explicit customer info updates
}

export interface ListInstantOrdersQuery {
  business_id: string
  user_id?: string
  status?: InstantOrderStatus
  search?: string // Search by customer name/phone in customer_info
  from?: string // ISO date string
  to?: string // ISO date string
  page?: number
  limit?: number
}

export interface InstantOrderListResponse {
  data: InstantOrder[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}
