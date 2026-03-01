## Context

The e-commerce platform needs a WhatsApp notification service to send messages to users. This is a common requirement for:
- Order confirmations
- Shipping updates
- Payment notifications
- Promotional messages
- Account-related alerts

Meta provides the WhatsApp Cloud API which allows programmatic sending of messages. The system already has a WhatsApp phone number ID and access token.

## Goals / Non-Goals

**Goals:**
- Provide a simple, reusable service for sending WhatsApp text messages
- Support the basic text message type with preview_url capability
- Follow existing project patterns (handlers, routes, types, service layer)
- Proper error handling for external API failures
- Type-safe implementation using TypeScript

**Non-Goals:**
- Message templates (text messages only for now)
- Media messages (images, documents, audio)
- Interactive messages (buttons, lists)
- Message queue/retry mechanism (direct API calls only)
- Incoming message webhooks
- Message status tracking

## Decisions

### Module Structure
Following the existing project convention, the WhatsApp feature will be organized as:
```
src/modules/whatsapp/
├── whatsapp.routes.ts      # Route definitions (POST /whatsapp/send)
├── whatsapp.handlers.ts    # HTTP request/response handlers
├── whatsapp.service.ts     # WhatsApp API integration layer
└── whatsapp.types.ts       # TypeScript types for DTOs
```

### Service Layer Pattern
A dedicated `whatsapp.service.ts` will handle the external API integration:
- Encapsulates the Meta API endpoint and authentication
- Handles request/response transformation
- Centralizes error handling for WhatsApp-specific errors
- Makes the code testable and maintainable

### Environment Configuration
The `WHATSAPP_TOKEN` will be added to `src/config/env.ts` following the existing pattern for validated environment variables.

### API Endpoint Design
- **Route:** `POST /api/whatsapp/send`
- **Authentication:** Internal API (may add auth middleware in future)
- **Request Body:**
  ```typescript
  {
    to: string,          // Phone number (e.g., "8801722454490")
    message: string      // Text message content
  }
  ```
- **Response:** Success/error status with optional error details

### HTTP Client
Using Node.js native `fetch` (available in Node 18+) for external API calls. No additional dependencies needed.

### Error Handling Strategy
- Validation errors: 400 Bad Request (invalid phone number, empty message)
- WhatsApp API errors: 502 Bad Gateway (propagate external failures)
- Network errors: 503 Service Unavailable
- Detailed error messages logged server-side; generic messages to client

## Risks / Trade-offs

### Risks
1. **API Rate Limits** - Meta has rate limits on WhatsApp API. Mitigation: Document limits; consider queue in future.
2. **Message Delivery** - No guarantee of delivery. Mitigation: Return API response; caller handles retries.
3. **Token Expiration** - WhatsApp tokens may expire. Mitigation: Document token rotation process.
4. **Cost** - WhatsApp API has per-message costs. Mitigation: Business awareness; monitoring.

### Trade-offs
1. **Direct API Calls vs Queue** - Chose direct calls for simplicity. Queue adds complexity but better for scale.
2. **Text Only vs Rich Media** - Starting with text only. Can extend to media/templates later.
3. **Internal API vs Module Export** - Exposing as HTTP route allows any service to use it. Module export would require TypeScript import coupling.

## Migration Plan

No migration needed - this is a new capability. Other features can immediately start using the endpoint.

## Open Questions

- Should we require authentication for the WhatsApp send endpoint? (Current decision: No, treat as internal API)
- Should we implement rate limiting on our side? (Current decision: No, rely on Meta's rate limits)
- Should we add phone number validation format? (Current decision: Basic non-empty validation, let WhatsApp API validate format)
