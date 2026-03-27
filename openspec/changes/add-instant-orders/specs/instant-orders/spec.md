# SPEC: Instant Orders

## ADDED Requirements

### Requirement: Create Instant Order with Existing Temp User

The system SHALL allow creating an instant order using an existing temp user ID.

- **Role**: admin, staff

#### Scenario: Create order with user_id

- **WHEN** a POST request is made to `/api/instant-orders` with `business_id`, `user_id`, `delivery_charge`, `cod_reference`, and `order_items`
- **AND** the `user_id` is a valid temp user (global, no business ownership check)
- **THEN** the order is created
- **AND** the `customer_info` field is populated with a snapshot from the temp user (name, phone, address)
- **AND** `temp_user_id` is set to the provided `user_id`
- **AND** the order status defaults to "pending"

### Requirement: Create Instant Order with New Customer

The system SHALL allow creating an instant order with new customer data, automatically creating a temp user.

- **Role**: admin, staff

#### Scenario: Create order without user_id

- **WHEN** a POST request is made to `/api/instant-orders` with `business_id`, `name`, `phone`, `address`, `delivery_charge`, `cod_reference`, and `order_items`
- **AND** no `user_id` is provided
- **THEN** a new temp user is created with the provided name, phone, and address
- **AND** the order is created with `temp_user_id` set to the new user's ID
- **AND** the `customer_info` field is populated with a snapshot of the provided data

### Requirement: Customer Info Snapshot

The system SHALL store an immutable snapshot of customer information at order creation time.

- **Role**: system

#### Scenario: Snapshot preservation

- **WHEN** an order is created with customer info
- **THEN** the `customer_info` JSONB field stores `{name, phone, address}` at that moment
- **AND** subsequent updates to the temp user do not affect the order's `customer_info`

#### Scenario: Update without customer overwrite

- **WHEN** an order update is made without explicit `customer_info` in the request body
- **THEN** the existing `customer_info` remains unchanged
- **AND** only the specified fields (status, items, etc.) are updated

### Requirement: Order Items Validation

The system SHALL validate that `order_items` is a properly structured JSON array with required fields.

- **Role**: system

#### Scenario: Valid order items

- **WHEN** `order_items` is an array where each item contains `title`, `price`, `quantity`, and `unit`
- **THEN** the order is accepted for creation

#### Scenario: Invalid order items structure

- **WHEN** `order_items` is not an array or any item is missing required fields
- **THEN** the system returns a 400 error
- **AND** the error message specifies which validation failed

#### Scenario: Invalid quantity or price

- **WHEN** any item has `quantity` less than 1 or `price` less than 0
- **THEN** the system returns a 400 error

### Requirement: Order User Resolution

The system SHALL require either `user_id` OR both `name` and `phone` to create an order.

- **Role**: system

#### Scenario: User ID provided

- **WHEN** `user_id` is provided in the request
- **THEN** the system validates that the temp user exists globally
- **AND** uses that temp user regardless of which business created it
- **AND** `name` and `phone` fields are ignored even if present

#### Scenario: Name and phone provided

- **WHEN** `user_id` is not provided but `name` and `phone` are present
- **THEN** the system creates a new global temp user with that information
- **OR** uses an existing temp user if the phone number already exists

#### Scenario: Insufficient customer info

- **WHEN** neither `user_id` nor both `name` and `phone` are provided
- **THEN** the system returns a 400 error
- **AND** the error message indicates the requirement

### Requirement: Update Order

The system SHALL allow updating specific order fields while maintaining data integrity.

- **Role**: admin, staff

#### Scenario: Update order status

- **WHEN** a PATCH request is made to `/api/instant-orders/:id` with `status`
- **THEN** the order status is updated to the new value
- **AND** the new status must be one of: pending, confirmed, canceled, returned, on_the_way, delivered

#### Scenario: Update order items

- **WHEN** a PATCH request includes `order_items` with a valid array
- **THEN** the order items are replaced with the new array

#### Scenario: Update multiple fields

- **WHEN** a PATCH request includes `status`, `delivery_charge`, and `cod_reference`
- **THEN** all specified fields are updated
- **AND** `customer_info` remains unchanged unless explicitly provided

### Requirement: List Orders with Filters

The system SHALL support listing orders with business-scoped filtering and pagination.

- **Role**: admin, staff

#### Scenario: List all business orders

- **WHEN** a GET request is made to `/api/instant-orders?business_id={uuid}` without additional filters
- **THEN** the system returns all orders for that business with pagination

#### Scenario: Filter by status

- **WHEN** the query includes `status=confirmed`
- **THEN** only orders with status "confirmed" are returned

#### Scenario: Filter by date range

- **WHEN** the query includes `from=2026-01-01` and `to=2026-03-31`
- **THEN** only orders created within that date range are returned

#### Scenario: Search by customer

- **WHEN** the query includes `search=John`
- **THEN** orders where `customer_info->>name` OR `customer_info->>phone` contains "John" are returned

#### Scenario: Combined filters

- **WHEN** multiple filters are applied (status, date range, search, business_id)
- **THEN** all filters are applied with AND logic
- **AND** only orders matching all criteria are returned

#### Scenario: Pagination

- **WHEN** the query includes `page=1` and `limit=20`
- **THEN** the system returns the first 20 matching orders
- **AND** the response includes pagination metadata

### Requirement: Get Single Order

The system SHALL allow retrieving a single order by ID with business verification.

- **Role**: admin, staff

#### Scenario: Successful retrieval

- **WHEN** a GET request is made to `/api/instant-orders/:id`
- **AND** the order belongs to the requestor's business
- **THEN** the complete order details are returned

#### Scenario: Cross-business access prevention

- **WHEN** a retrieval is attempted for an order from a different business
- **THEN** the system returns a 404 error (not found)

### Requirement: Business Isolation

The system SHALL ensure instant orders are strictly scoped to their business.

- **Role**: system

#### Scenario: Business scope enforcement

- **WHEN** any order operation is performed
- **THEN** the system verifies the business_id in the JWT matches the order's business_id
- **AND** operations on orders from other businesses are rejected

### Requirement: Order Status Enum

The system SHALL only allow specific status values for instant orders.

- **Role**: system

#### Scenario: Valid status values

- **WHEN** setting or updating an order status
- **THEN** the status must be one of: pending, confirmed, canceled, returned, on_the_way, delivered

#### Scenario: Invalid status rejection

- **WHEN** an update attempts to set status to an invalid value
- **THEN** the system returns a 400 error
- **AND** the error message lists the valid status options
