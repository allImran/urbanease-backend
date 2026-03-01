## 1. Environment Configuration

- [x] 1.1 Add `WHATSAPP_TOKEN` to `src/config/env.ts`
- [ ] 1.2 Add WHATSAPP_TOKEN to `.env` file (local development)

## 2. Type Definitions

- [x] 2.1 Create `src/modules/whatsapp/whatsapp.types.ts`
- [x] 2.2 Define `SendWhatsAppMessageRequest` type with `to` and `message` fields
- [x] 2.3 Define `WhatsAppMessageResponse` type for API responses
- [x] 2.4 Define `WhatsAppErrorResponse` type for error handling

## 3. Service Layer

- [x] 3.1 Create `src/modules/whatsapp/whatsapp.service.ts`
- [x] 3.2 Implement `sendTextMessage()` function with phone number and message parameters
- [x] 3.3 Add fetch call to Meta WhatsApp Cloud API endpoint
- [x] 3.4 Set Authorization header with Bearer token from env
- [x] 3.5 Implement proper request body formatting per WhatsApp API spec
- [x] 3.6 Add error handling for API failures and network errors
- [x] 3.7 Add TypeScript types for WhatsApp API request/response

## 4. Request Handler

- [x] 4.1 Create `src/modules/whatsapp/whatsapp.handlers.ts`
- [x] 4.2 Implement `sendWhatsAppMessageHandler()` using asyncHandler wrapper
- [x] 4.3 Add input validation for `to` (required, non-empty string)
- [x] 4.4 Add input validation for `message` (required, non-empty string)
- [x] 4.5 Call service layer and handle responses/errors appropriately
- [x] 4.6 Return 200 on success with appropriate response data
- [x] 4.7 Return 400 for validation errors
- [x] 4.8 Return 502 for WhatsApp API errors
- [x] 4.9 Return 503 for network errors

## 5. Routes

- [x] 5.1 Create `src/modules/whatsapp/whatsapp.routes.ts`
- [x] 5.2 Define POST `/send` route for sending messages
- [x] 5.3 Attach the sendWhatsAppMessageHandler to the route
- [x] 5.4 Export routes from the module

## 6. Integration

- [x] 6.1 Import and register whatsapp routes in `src/routes.ts`
- [x] 6.2 Mount routes at `/api/whatsapp` path
- [x] 6.3 Verify routes are registered correctly

## 7. Testing & Validation

- [x] 7.1 Test valid message send via API endpoint
- [x] 7.2 Test validation with missing `to` field
- [x] 7.3 Test validation with missing `message` field
- [x] 7.4 Test validation with empty string values
- [x] 7.5 Verify environment variable validation (token missing)
- [x] 7.6 Test error handling for invalid WhatsApp API responses
- [x] 7.7 Verify message format matches WhatsApp API specification

## 8. Documentation

- [ ] 8.1 Update API documentation with WhatsApp endpoint details
- [ ] 8.2 Document environment variables (WHATSAPP_TOKEN)
- [ ] 8.3 Add example request/response to documentation
