import { env } from '../../config/env'
import type {
  SteadfastCreateOrderRequest,
  SteadfastCreateOrderResponse,
  SteadfastBulkOrderResponse,
  SteadfastDeliveryStatusResponse,
  CreateOrderResponse,
  BulkOrderResponse,
  DeliveryStatusResponse,
  SteadfastConsignment
} from './courier.types'

const STEADFAST_API_URL = 'https://portal.packzy.com/api/v1'

async function makeSteadfastRequest(
  endpoint: string,
  method: 'GET' | 'POST',
  body?: any
): Promise<Response> {
  const headers: Record<string, string> = {
    'Api-Key': env.STEADFAST_API_KEY,
    'Secret-Key': env.STEADFAST_SECRET_KEY,
    'Content-Type': 'application/json'
  }

  const requestInit: RequestInit = {
    method,
    headers
  }

  if (body && method === 'POST') {
    requestInit.body = JSON.stringify(body)
  }

  const response = await fetch(`${STEADFAST_API_URL}${endpoint}`, requestInit)
  return response
}

export async function createSteadfastOrder(
  orderData: SteadfastCreateOrderRequest
): Promise<CreateOrderResponse> {
  try {
    // Validate required fields
    if (!orderData.invoice || orderData.invoice.trim() === '') {
      return {
        success: false,
        error: 'Invoice is required'
      }
    }

    if (!orderData.recipient_name || orderData.recipient_name.trim() === '') {
      return {
        success: false,
        error: 'Recipient name is required'
      }
    }

    if (!orderData.recipient_phone || orderData.recipient_phone.trim() === '') {
      return {
        success: false,
        error: 'Recipient phone is required'
      }
    }

    // Validate phone number format (11 digits)
    const phoneRegex = /^\d{11}$/
    if (!phoneRegex.test(orderData.recipient_phone)) {
      return {
        success: false,
        error: 'Recipient phone must be 11 digits'
      }
    }

    if (orderData.alternative_phone && !phoneRegex.test(orderData.alternative_phone)) {
      return {
        success: false,
        error: 'Alternative phone must be 11 digits'
      }
    }

    if (!orderData.recipient_address || orderData.recipient_address.trim() === '') {
      return {
        success: false,
        error: 'Recipient address is required'
      }
    }

    if (orderData.cod_amount < 0) {
      return {
        success: false,
        error: 'COD amount cannot be less than 0'
      }
    }

    // Validate recipient_name length (max 100 characters)
    if (orderData.recipient_name.length > 100) {
      return {
        success: false,
        error: 'Recipient name cannot exceed 100 characters'
      }
    }

    // Validate recipient_address length (max 250 characters)
    if (orderData.recipient_address.length > 250) {
      return {
        success: false,
        error: 'Recipient address cannot exceed 250 characters'
      }
    }

    // Make API call
    const response = await makeSteadfastRequest('/create_order', 'POST', orderData)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Steadfast API error:', response.status, errorText)
      return {
        success: false,
        error: `Steadfast API error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json() as SteadfastCreateOrderResponse

    return {
      success: true,
      consignment: data.consignment
    }
  } catch (error) {
    console.error('Network error creating Steadfast order:', error)
    return {
      success: false,
      error: 'Network error: Failed to create order'
    }
  }
}

export async function createBulkSteadfastOrders(
  orders: SteadfastCreateOrderRequest[]
): Promise<BulkOrderResponse> {
  try {
    // Validate orders array
    if (!Array.isArray(orders) || orders.length === 0) {
      return {
        success: false,
        error: 'Orders must be a non-empty array'
      }
    }

    // Maximum 500 items allowed
    if (orders.length > 500) {
      return {
        success: false,
        error: 'Maximum 500 orders allowed per bulk request'
      }
    }

    // Make API call with JSON stringified array
    const response = await makeSteadfastRequest('/create_order/bulk-order', 'POST', {
      data: JSON.stringify(orders)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Steadfast bulk order API error:', response.status, errorText)
      return {
        success: false,
        error: `Steadfast API error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json() as SteadfastBulkOrderResponse[]

    return {
      success: true,
      results: data
    }
  } catch (error) {
    console.error('Network error creating bulk Steadfast orders:', error)
    return {
      success: false,
      error: 'Network error: Failed to create bulk orders'
    }
  }
}

export async function getDeliveryStatusByCid(
  cid: string
): Promise<DeliveryStatusResponse> {
  try {
    if (!cid || cid.trim() === '') {
      return {
        success: false,
        error: 'Consignment ID is required'
      }
    }

    const response = await makeSteadfastRequest(`/status_by_cid/${encodeURIComponent(cid)}`, 'GET')

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Steadfast delivery status API error:', response.status, errorText)
      return {
        success: false,
        error: `Steadfast API error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json() as SteadfastDeliveryStatusResponse

    return {
      success: true,
      delivery_status: data.delivery_status
    }
  } catch (error) {
    console.error('Network error getting delivery status by CID:', error)
    return {
      success: false,
      error: 'Network error: Failed to get delivery status'
    }
  }
}

export async function getDeliveryStatusByInvoice(
  invoice: string
): Promise<DeliveryStatusResponse> {
  try {
    if (!invoice || invoice.trim() === '') {
      return {
        success: false,
        error: 'Invoice is required'
      }
    }

    const response = await makeSteadfastRequest(
      `/status_by_invoice/${encodeURIComponent(invoice)}`,
      'GET'
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Steadfast delivery status API error:', response.status, errorText)
      return {
        success: false,
        error: `Steadfast API error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json() as SteadfastDeliveryStatusResponse

    return {
      success: true,
      delivery_status: data.delivery_status
    }
  } catch (error) {
    console.error('Network error getting delivery status by invoice:', error)
    return {
      success: false,
      error: 'Network error: Failed to get delivery status'
    }
  }
}

export async function getDeliveryStatusByTrackingCode(
  trackingCode: string
): Promise<DeliveryStatusResponse> {
  try {
    if (!trackingCode || trackingCode.trim() === '') {
      return {
        success: false,
        error: 'Tracking code is required'
      }
    }

    const response = await makeSteadfastRequest(
      `/status_by_trackingcode/${encodeURIComponent(trackingCode)}`,
      'GET'
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Steadfast delivery status API error:', response.status, errorText)
      return {
        success: false,
        error: `Steadfast API error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json() as SteadfastDeliveryStatusResponse

    return {
      success: true,
      delivery_status: data.delivery_status
    }
  } catch (error) {
    console.error('Network error getting delivery status by tracking code:', error)
    return {
      success: false,
      error: 'Network error: Failed to get delivery status'
    }
  }
}
