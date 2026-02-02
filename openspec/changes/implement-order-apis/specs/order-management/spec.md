# SPEC: Order Management

## ADDED Requirements

### Requirement: Admin/Staff Status Update

The system MUST allow only administrators and staff members to update an order's status.

- **Role**: admin, staff

#### Scenario: Staff updates status

- **WHEN** user with `staff` role sends PATCH to `/orders/:id/status`
- **THEN** order status is updated successfully

### Requirement: Admin-Only Order Modification

The system MUST restrict full modification of order details to administrators only.

- **Role**: admin

#### Scenario: Staff attempt modification

- **WHEN** user with `staff` role attempts to update order items
- **THEN** request is rejected with 403 Forbidden
