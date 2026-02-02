# SPEC: Order Creation

## ADDED Requirements

### Requirement: Automatic User Creation

The system SHALL create a new user account using the provided phone number if a user ID is not provided.

- **Role**: public

#### Scenario: Create order with new user

- **WHEN** request has `phone: "1234567890"` and no `user_id`
- **THEN** a new Supabase user is created and assigned to the order

### Requirement: Item Snapshotting

Orders MUST store a snapshot of the product name, variant name, and price at the time of purchase.

- **Role**: system

#### Scenario: Snapshot verification

- **WHEN** an order is placed for product "X" with variant "Y" ($10)
- **THEN** `order_items` stores `snapshot_name: "X (Y)"` and `price_at_purchase: 10.00`

### Requirement: Total Calculation

The system MUST calculate the total order amount based on current variant prices.

- **Role**: system

#### Scenario: Validating total amount

- **WHEN** multiple items are included in a creation request
- **THEN** `orders.total_amount` equals the sum of all `price * quantity`
