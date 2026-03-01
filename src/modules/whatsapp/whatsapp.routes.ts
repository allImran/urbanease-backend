import { Router } from 'express'
import { sendWhatsAppMessageHandler } from './whatsapp.handlers'

const router = Router()

// POST /api/whatsapp/send - Send a WhatsApp message
router.post('/send', sendWhatsAppMessageHandler)

export default router
