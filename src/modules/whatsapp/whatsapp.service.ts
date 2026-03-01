import { env } from '../../config/env'
import type {
  WhatsAppAPIMessageRequest,
  WhatsAppAPIMessageResponse,
  WhatsAppMessageResponse
} from './whatsapp.types'

const WHATSAPP_API_URL = 'https://graph.facebook.com/v24.0/964341533429410/messages'
const PHONE_NUMBER_ID = '964341533429410'

export async function sendTextMessage(
  phoneNumber: string,
  message: string
): Promise<WhatsAppMessageResponse> {
  try {
    // Validate inputs
    if (!phoneNumber || phoneNumber.trim() === '') {
      return {
        success: false,
        error: 'Phone number is required'
      }
    }

    if (!message || message.trim() === '') {
      return {
        success: false,
        error: 'Message is required'
      }
    }

    // Prepare request body
    const requestBody: WhatsAppAPIMessageRequest = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    }

    // Make API call
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('WhatsApp API error:', response.status, errorText)
      return {
        success: false,
        error: `WhatsApp API error: ${response.status} ${response.statusText}`
      }
    }

    const data = await response.json() as WhatsAppAPIMessageResponse

    // Extract message ID from response
    const messageId = data.messages?.[0]?.id

    return {
      success: true,
      messageId
    }
  } catch (error) {
    console.error('Network error sending WhatsApp message:', error)
    return {
      success: false,
      error: 'Network error: Failed to send message'
    }
  }
}
