# Change: Add WhatsApp Notification Service

## Why

The system needs a WhatsApp notification service to enable sending messages to users for various business events (order confirmations, updates, alerts, etc.). Other features will call this service to trigger WhatsApp messages to users.

## What Changes

- Add new `whatsapp-notification` capability
- Create a new module `src/modules/whatsapp/` with:
  - `whatsapp.handlers.ts` - Handler for sending WhatsApp messages
  - `whatsapp.routes.ts` - Route definition for the WhatsApp API
  - `whatsapp.types.ts` - Type definitions for requests/responses
  - `whatsapp.service.ts` - Service layer for WhatsApp API integration
- Add `WHATSAPP_TOKEN` to environment configuration
- Integrate with Meta WhatsApp Cloud API (v24.0)

## Impact

- Affected specs: New capability `whatsapp-notification`
- Affected code:
  - New module: `src/modules/whatsapp/`
  - Modified: `src/config/env.ts` (add WHATSAPP_TOKEN)
  - Modified: `src/routes.ts` (register whatsapp routes)
- External dependency: Meta WhatsApp Cloud API (https://graph.facebook.com/v24.0/964341533429410/messages)
