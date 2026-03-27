# SPEC: Temp Users

## ADDED Requirements

### Requirement: Create Temp User

The system SHALL allow admin/staff to create a new temporary user record that is globally accessible across all businesses.

- **Role**: admin, staff

#### Scenario: Successful temp user creation

- **WHEN** a POST request is made to `/api/temp-users` with valid `name`, `phone`, and optional `address`
- **THEN** a new temp user is created with a unique ID
- **AND** the response includes the created temp user data
- **AND** the `created_at` timestamp is automatically set

#### Scenario: Duplicate phone validation

- **WHEN** a temp user creation is attempted with a phone number that already exists globally
- **THEN** the system returns a 400 error
- **AND** the error message indicates the phone number is already in use

### Requirement: Update Temp User

The system SHALL allow updating temp user information.

- **Role**: admin, staff

#### Scenario: Successful temp user update

- **WHEN** a PATCH request is made to `/api/temp-users/:id` with valid updates
- **THEN** the temp user is updated with the new values
- **AND** the `updated_at` timestamp is automatically refreshed

### Requirement: Search Temp Users

The system SHALL support searching temp users globally by name or phone with partial matching.

- **Role**: admin, staff

#### Scenario: Search by name

- **WHEN** a GET request is made to `/api/temp-users/search?name=John`
- **THEN** the system returns all temp users with names containing "John" (case-insensitive)

#### Scenario: Search by phone

- **WHEN** a GET request is made to `/api/temp-users/search?phone=123`
- **THEN** the system returns all temp users with phone numbers containing "123"

#### Scenario: Combined search

- **WHEN** both `name` and `phone` query parameters are provided
- **THEN** the system returns temp users matching either criterion (OR logic)

### Requirement: Global Phone Uniqueness

The system SHALL enforce globally unique phone numbers across all businesses.

- **Role**: system

#### Scenario: Global uniqueness enforcement

- **WHEN** a temp user is created with phone "+1234567890"
- **THEN** no other temp user can be created with the same phone number, regardless of business

#### Scenario: Phone reuse across orders

- **WHEN** a temp user with phone "+1234567890" exists
- **THEN** orders from any business can reference this temp user by ID
- **AND** the customer info is shared across businesses
