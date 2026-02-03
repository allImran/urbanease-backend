# SPEC: Order Status History

## ADDED Requirements

### Requirement: Automatic Status History Recording

The system MUST automatically record a status history entry each time an order's status is updated.

- **Role**: admin, staff (implicit, as only they can update status)

#### Scenario: Status change creates history record

- **GIVEN** an order exists with status `pending`
- **WHEN** an admin updates the status to `shipped` with comment "Package left warehouse"
- **THEN** a new record is created in `order_status_history` with:
  - `order_id`: the order's ID
  - `status`: `shipped`
  - `changed_at`: current timestamp
  - `comment`: "Package left warehouse"

#### Scenario: Status change without comment

- **GIVEN** an order exists with status `pending`
- **WHEN** a staff member updates the status to `confirmed` without providing a comment
- **THEN** a new record is created in `order_status_history` with:
  - `order_id`: the order's ID
  - `status`: `confirmed`
  - `changed_at`: current timestamp
  - `comment`: `null`

### Requirement: Status History Retrieval

The system MUST provide an endpoint to retrieve all status history entries for a specific order, ordered chronologically with the most recent first.

- **Role**: admin, staff (all orders), customer (own orders only)

#### Scenario: Admin retrieves order status history

- **GIVEN** an order with 5 status transitions
- **WHEN** an admin sends GET to `/orders/:id/history`
- **THEN** the system returns an array of 5 status history entries
- **AND** entries are ordered by `changed_at` DESC

#### Scenario: Customer retrieves own order history

- **GIVEN** a customer owns order `123`
- **WHEN** the customer sends GET to `/orders/123/history`
- **THEN** the system returns the status history entries for that order
- **AND** each entry includes: id, status, changed_at, and comment

#### Scenario: Customer denied access to another customer's history

- **GIVEN** a customer owns order `123`
- **AND** order `456` belongs to another customer
- **WHEN** the customer sends GET to `/orders/456/history`
- **THEN** the system returns 403 Forbidden

### Requirement: Optional Comment Field

The system MUST allow an optional comment to be attached to each status change for audit and communication purposes.

- **Role**: admin, staff

#### Scenario: Status update with detailed comment

- **GIVEN** an order exists
- **WHEN** an admin updates status to `cancelled` with comment "Customer requested refund via phone call"
- **THEN** the history entry stores the full comment text
- **AND** the comment is retrievable via the history endpoint

#### Scenario: Backward compatibility without comment

- **GIVEN** an existing integration that updates order status without providing a comment
- **WHEN** the integration sends `{ status: "delivered" }` without comment field
- **THEN** the status is updated successfully
- **AND** a history entry is created with `comment` as `null`

### Requirement: Order Detail with History

The system MUST support including status history in the order detail response when explicitly requested via query parameter.

- **Role**: admin, staff (all orders), customer (own orders only)

#### Scenario: Fetch order with history included

- **GIVEN** an order exists with status changes
- **WHEN** an admin sends GET to `/orders/:id?include=history`
- **THEN** the response includes the order details
- **AND** the response includes a `history` array with all status entries

#### Scenario: Fetch order without history parameter

- **GIVEN** an order exists with status changes
- **WHEN** a user sends GET to `/orders/:id` without the `include` parameter
- **THEN** the response includes only the order details
- **AND** the response does NOT include a `history` array

## MODIFIED Requirements

### Requirement: Order Status Update (from order-management)

The existing order status update capability MUST support an optional comment field to provide context for status changes.

#### Scenario: Update status with context (EXTENDED)

- **WHEN** user with `staff` role sends PATCH to `/orders/:id/status` with body `{ status: "shipped", comment: "Left warehouse via UPS" }`
- **THEN** order status is updated successfully
- **AND** a history entry is created with the comment preserved
