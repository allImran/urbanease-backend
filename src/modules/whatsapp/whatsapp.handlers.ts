import { Request, Response, NextFunction } from 'express'
import { sendTextMessage } from './whatsapp.service'
import type { SendWhatsAppMessageRequest, WhatsAppMessageResponse } from './whatsapp.types'

export const sendWhatsAppMessageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { to, message } = req.body as SendWhatsAppMessageRequest

    // Input validation
    if (!to || typeof to !== 'string' || to.trim() === '') {
      return res.status(400).json({
        error: 'Invalid or missing "to" field. Phone number is required.'
      })
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: 'Invalid or missing "message" field. Message content is required.'
      })
    }

    // Call service layer
    const result: WhatsAppMessageResponse = await sendTextMessage(to.trim(), message.trim())

    // Handle different response scenarios
    if (result.success) {
      return res.status(200).json({
        success: true,
        messageId: result.messageId
      })
    }

    // Check if it's a network error or API error
    if (result.error?.includes('Network error')) {
      return res.status(503).json({
        error: 'Service unavailable: Unable to connect to WhatsApp service'
      })
    }

    // API error from WhatsApp
    return res.status(502).json({
      error: 'Bad gateway: WhatsApp service error',
      details: result.error
    })
  } catch (error) {
    console.error('Unexpected error in sendWhatsAppMessageHandler:', error)
    next(error)
  }
}
