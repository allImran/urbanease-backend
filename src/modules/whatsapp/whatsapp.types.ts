export interface SendWhatsAppMessageRequest {
  to: string
  message: string
}

export interface WhatsAppMessageResponse {
  success: boolean
  messageId?: string
  error?: string
}

export interface WhatsAppErrorResponse {
  error: string
  details?: string
}

// WhatsApp Cloud API Types
export interface WhatsAppAPIMessageRequest {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'text'
  text: {
    preview_url: boolean
    body: string
  }
}

export interface WhatsAppAPIMessageResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}
