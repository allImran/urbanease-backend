# Business Spec

## ADDED Requirements

### Requirement: Business Management

The system MUST provide capabilities to manage businesses.

#### Scenario: Business Resource

The system MUST support a `Business` resource with the following fields:

- `id`: Unique identifier (UUID).
- `name`: String, required.
- `slug`: String, unique, required.
- `is_active`: Boolean, default true.
- `created_at`: Datetime.
- `updated_at`: Datetime.

#### Scenario: List Businesses

`GET /businesses`

- MUST return a paginated list of businesses.
- Response 200: Array of Business objects.

#### Scenario: Get Business

`GET /businesses/:id`

- MUST return the business details for the given ID.
- Response 200: Business object.
- Response 404: If not found.

#### Scenario: Create Business

`POST /businesses`

- MUST create a new business.
- Request body: `name`, `slug` (optional if auto-generated, but sticking to explicit for now).
- Response 201: Created Business object.
- Response 400: Validation error.

#### Scenario: Update Business

`PUT /businesses/:id`

- MUST update the business details.
- Request body: `name`, `slug`.
- Response 200: Updated Business object.
- Response 404: If not found.

#### Scenario: Delete Business

`DELETE /businesses/:id`

- MUST soft delete the business (set `is_active` to false).
- Response 204: No content.
