// Request Types

export interface CreateOrderRequest {
  invoice: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  cod_amount: number
  alternative_phone?: string
  recipient_email?: string
  note?: string
  item_description?: string
  total_lot?: number
  delivery_type?: 0 | 1 // 0 = home delivery, 1 = point delivery
}

export interface BulkOrderRequest {
  data: CreateOrderRequest[]
}

export interface DeliveryStatusRequest {
  type: 'cid' | 'invoice' | 'trackingcode'
  id: string
}

// Steadfast API Types

export interface SteadfastCreateOrderRequest {
  invoice: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  cod_amount: number
  alternative_phone?: string
  recipient_email?: string
  note?: string
  item_description?: string
  total_lot?: number
  delivery_type?: 0 | 1
}

export interface SteadfastBulkOrderRequest {
  data: string // JSON stringified array
}

export interface SteadfastConsignment {
  consignment_id: number
  invoice: string
  tracking_code: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  cod_amount: number
  status: string
  note?: string
  created_at: string
  updated_at: string
}

export interface SteadfastCreateOrderResponse {
  status: number
  message: string
  consignment: SteadfastConsignment
}

export interface SteadfastBulkOrderResponse {
  invoice: string
  recipient_name: string
  recipient_address: string
  recipient_phone: string
  cod_amount: string
  note: string | null
  consignment_id: number | null
  tracking_code: string | null
  status: 'success' | 'error'
}

export interface SteadfastDeliveryStatusResponse {
  status: number
  delivery_status: DeliveryStatus
}

// Response Types

export interface CreateOrderResponse {
  success: boolean
  consignment?: SteadfastConsignment
  error?: string
}

export interface BulkOrderResponse {
  success: boolean
  results?: SteadfastBulkOrderResponse[]
  error?: string
}

export interface DeliveryStatusResponse {
  success: boolean
  delivery_status?: DeliveryStatus
  error?: string
}

export type DeliveryStatus =
  | 'pending'
  | 'delivered_approval_pending'
  | 'partial_delivered_approval_pending'
  | 'cancelled_approval_pending'
  | 'unknown_approval_pending'
  | 'delivered'
  | 'partial_delivered'
  | 'cancelled'
  | 'hold'
  | 'in_review'
  | 'unknown'
