## ADDED Requirements

### Requirement: Send WhatsApp Text Message

The system SHALL provide an API endpoint to send text messages via WhatsApp Cloud API.

#### Scenario: Send message successfully
- **GIVEN** a valid WhatsApp phone number and message content
- **WHEN** a POST request is made to `/api/whatsapp/send`
- **THEN** the message is sent to the recipient via WhatsApp Cloud API
- **AND** a success response is returned with status 200

#### Scenario: Invalid request payload
- **GIVEN** missing required fields (to, message) in request body
- **WHEN** a POST request is made to `/api/whatsapp/send`
- **THEN** a 400 Bad Request error is returned
- **AND** the response includes validation error details

#### Scenario: WhatsApp API failure
- **GIVEN** a valid request payload
- **WHEN** the WhatsApp Cloud API returns an error
- **THEN** a 502 Bad Gateway error is returned
- **AND** error details are logged server-side

#### Scenario: Network connectivity failure
- **GIVEN** a valid request payload
- **WHEN** the system cannot reach the WhatsApp Cloud API
- **THEN** a 503 Service Unavailable error is returned
- **AND** the error is logged for monitoring

### Requirement: WhatsApp Environment Configuration

The system SHALL validate and expose the WhatsApp API token from environment variables.

#### Scenario: Missing WHATSAPP_TOKEN
- **GIVEN** the WHATSAPP_TOKEN environment variable is not set
- **WHEN** the application starts
- **THEN** the application fails to start with a clear error message
- **AND** the error indicates the missing required environment variable

#### Scenario: Valid WHATSAPP_TOKEN
- **GIVEN** the WHATSAPP_TOKEN environment variable is set
- **WHEN** the application starts
- **THEN** the configuration is loaded successfully
- **AND** the token is available for WhatsApp API authentication

### Requirement: WhatsApp Message Format

The system SHALL format and send messages according to the WhatsApp Cloud API specification.

#### Scenario: Text message with URL preview
- **GIVEN** a message containing a URL
- **WHEN** the message is sent to WhatsApp
- **THEN** the request includes `preview_url: true`
- **AND** the message body is sent as specified

#### Scenario: Bearer token authentication
- **GIVEN** a valid WHATSAPP_TOKEN
- **WHEN** making a request to WhatsApp Cloud API
- **THEN** the Authorization header includes `Bearer <WHATSAPP_TOKEN>`
- **AND** the API version is set to v24.0
